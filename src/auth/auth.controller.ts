import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { AuthService } from './auth.service';
import JwtAuthenticationGuard from './jwt.guard';
import { GetUser } from './get-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @UsePipes(ValidationPipe)
  async signUp(@Body() createUserDto: CreateUserDto): Promise<User | null> {
    return this.authService.signUp(createUserDto);
  }

  @Post('login')
  @UsePipes(ValidationPipe)
  async signIn(@Body() body: { username: string, password: string }): Promise<string> {
    return this.authService.signIn(body);
  }

  @Post('/test')
  @UseGuards(JwtAuthenticationGuard)
  test(@GetUser() user: User) {
    console.log(user);
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: '.files',
    }),
  }))
  async uploadFile(@UploadedFile() file: any) {
    console.log(file);
    await this.authService.uploadFile(file.path, file.originalname);
    return "OK";
  }

}
