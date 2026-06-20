import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bullmq';
import { AuthModule } from './modules/auth/auth.module';
import { PlacesModule } from './modules/places/places.module';
import { SocialModule } from './modules/social/social.module';
import { EventsModule } from './modules/events/events.module';
import { MediaModule } from './modules/media/media.module';
import { AdminModule } from './modules/admin/admin.module';
import { InfraModule } from './infrastructure/external/infra.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({ inject: [ConfigService], useFactory: (c: ConfigService) => ({ uri: c.get<string>('MONGODB_URI', 'mongodb://localhost:27017/wayz?replicaSet=rs0') }) }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    BullModule.forRootAsync({ inject: [ConfigService], useFactory: (c: ConfigService) => ({ connection: { host: c.get('REDIS_HOST', 'localhost'), port: Number(c.get('REDIS_PORT', 6379)) } }) }),
    InfraModule, AuthModule, PlacesModule, SocialModule, EventsModule, MediaModule, AdminModule,
  ],
})
export class AppModule {}
