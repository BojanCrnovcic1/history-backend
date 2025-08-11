import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from 'src/entities/media.entity';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { Events } from 'src/entities/events.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
        Media, Events]),
        AuthModule,
    ],
  providers: [MediaService],
  controllers: [MediaController],
  exports: [MediaService],
})
export class MediaModule {}
