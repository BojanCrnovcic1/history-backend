import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/users.entity';
import { PasswordResetRequests } from '../entities/password-reset-requests.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';
import { JwtService } from '../auth/jwt.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([Users, PasswordResetRequests]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '30m' },
      }),
    }),
    
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    MailService,
    JwtService,
  ],
  exports: [UsersService], 
})
export class UsersModule {}