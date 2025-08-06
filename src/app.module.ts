import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from 'config/database.config';
import { join } from 'path';
import { EventsModule } from './events/events.module';
import { MediaModule } from './media/media.module';
import { EventTypesModule } from './event-types/event-types.module';
import { TimePeriodsModule } from './time-periods/time-periods.module';
import { LocationsModule } from './locations/locations.module';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: DatabaseConfig.host,
      port: 3306,
      username: DatabaseConfig.username,
      password: DatabaseConfig.password,
      database: DatabaseConfig.database,
      entities: [join(__dirname, '**', 'entities', '*.entity.{ts,js}')]
    }),
    EventsModule,
    MediaModule,
    EventTypesModule,
    TimePeriodsModule,
    LocationsModule,
  ],
})
export class AppModule {}
