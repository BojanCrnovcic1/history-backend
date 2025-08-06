import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from 'src/entities/media.entity';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { Events } from 'src/entities/events.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Media, Events])],
  providers: [MediaService],
  controllers: [MediaController],
  exports: [MediaService],
})
export class MediaModule {}
