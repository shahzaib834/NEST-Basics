import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayloadInterface } from './jwt-payload.interface';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class JwtStategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'topSecret',
    });
  }

  async validate(payload: JwtPayloadInterface) {
    const { username } = payload;

    const user = await this.prisma.user.findFirst({
      where: { username },
    });

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
