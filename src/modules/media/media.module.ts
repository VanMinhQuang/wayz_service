import { Module } from '@nestjs/common'; import { MediaController } from './presentation/http/media.controller';
@Module({ controllers: [MediaController] }) export class MediaModule {}
