import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport';
import { JwtStategy } from './jwt.stategy';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret: 'topSecret',
      signOptions: {
        expiresIn: '2d',
      },
    }),
    MulterModule.register({
      dest: './files',
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtStategy],
  exports: [JwtStategy, PassportModule]
})
export class AuthModule {}
