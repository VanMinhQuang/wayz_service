import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtAuthGuard, JwtUser } from '../../../../shared/presentation/http/auth';
import { MediaStorageService } from '../../../../infrastructure/external/storage/media-storage.service';
import { ConfirmUploadDto, CreateUploadDto } from './media.dto';
@ApiTags('media')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'media', version: '1' })
export class MediaController {
  constructor(private readonly storage: MediaStorageService) {}
  @Post('uploads') create(@CurrentUser() u: JwtUser, @Body() dto: CreateUploadDto) {
    return this.storage.createUpload(u.sub, dto.mimeType, dto.purpose);
  }
  @Post('uploads/confirm') confirm(@CurrentUser() u: JwtUser, @Body() dto: ConfirmUploadDto) {
    return this.storage.confirmUpload(u.sub, dto.key);
  }
  @Get(':key') read(@Param('key') key: string) {
    return this.storage.signedReadUrl(key);
  }
}
