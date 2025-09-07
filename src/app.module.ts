import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from 'config/database.config';
import { join } from 'path';
import { EventsModule } from './events/events.module';
import { MediaModule } from './media/media.module';
import { EventTypesModule } from './event-types/event-types.module';
import { TimePeriodsModule } from './time-periods/time-periods.module';
import { LocationsModule } from './locations/locations.module';
import { AuthMiddleware } from './auth/auth.middleware';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { WebhookModule } from './webhook/webhook.module';
import { VisitsModule } from './visits/visits.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: DatabaseConfig.host,
      port: 3306,
      username: DatabaseConfig.username,
      password: DatabaseConfig.password,
      database: DatabaseConfig.database,
      entities: [join(__dirname, '**', 'entities', '*.entity.{ts,js}')]
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '30m' },
      }),
    }),
    EventsModule,
    MediaModule,
    EventTypesModule,
    TimePeriodsModule,
    LocationsModule,
    UsersModule,
    AuthModule,
    SubscriptionsModule,
    WebhookModule,
    VisitsModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    
    consumer.apply(AuthMiddleware)
            .exclude('auth/*')
            .forRoutes('api/*');
  }
}