import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadInterface } from './jwt-payload.interface';
import {S3} from "@aws-sdk/client-s3";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async signUp(createUserDto: CreateUserDto): Promise<User | null> {
    const { username, password } = createUserDto;

    const exist = await this.prisma.user.findFirst({
      where: {
        username,
      },
    });

    if (exist) {
      throw new ConflictException('User already exists');
    }

    const user = await this.prisma.user.create({
      data: {
        username,
        password,
      },
    });

    return user;
  }

  async signIn(body: { username: string; password: string }) {
    const { username, password } = body;

    const user = await this.prisma.user.findFirst({
      where: { username },
    });

    const isAuthenticated = await bcrypt.compare(password, user.password);

    if (!user || !isAuthenticated) throw new UnauthorizedException('Wrong name or password');

    const payload: JwtPayloadInterface = { username }
    const accessToken = await this.jwtService.sign(payload);

    return accessToken;
  }

  async uploadFile(imageBuffer: Buffer, fileName: string) {
    const s3 = new S3({
      region: 'ap-northeast-1',
    });
    return await s3.putObject({
      Bucket: 'chat-app-profile-images',
      Body: imageBuffer,
      Key: fileName
    });
  }
}
