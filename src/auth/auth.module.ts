import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Users } from '../entities/users.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtService } from './jwt.service';
import { AuthMiddleware } from './auth.middleware';
import { UsersModule } from '../users/users.module';
import { PasswordResetRequests } from '../entities/password-reset-requests.entity';
import { MailService } from '../users/mail.service';
import { UsersService } from 'src/users/users.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, PasswordResetRequests]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '30m' },
      }),
    }),
    UsersModule,
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtService,
    JwtStrategy,
    LocalStrategy,
    AuthMiddleware,
    MailService,
    UsersService,
  ],
  exports: [
    AuthService,
    JwtService,
    AuthMiddleware,
    JwtStrategy,
    LocalStrategy,
  ],
})
export class AuthModule {}