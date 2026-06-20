import { Global, Module } from '@nestjs/common';
import { SchemasModule } from '../persistence/mongoose/schemas/schemas.module';
import { MapVinaService } from './mapvina/mapvina.service';
import { SmsService } from './sms/sms.service';
import { NotificationService } from './notification/notification.service';
import { MediaStorageService } from './storage/media-storage.service';
@Global()
@Module({
  imports: [SchemasModule],
  providers: [MapVinaService, SmsService, NotificationService, MediaStorageService],
  exports: [MapVinaService, SmsService, NotificationService, MediaStorageService],
})
export class InfraModule {}
