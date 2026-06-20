import { IsArray, IsDateString, IsMongoId, IsOptional, IsString, MaxLength } from 'class-validator';
import { CursorQueryDto } from '../../../../shared/presentation/http/pagination';
export class SharePlaceDto {
  @IsMongoId() placeId!: string;
  @IsOptional() @IsMongoId() recipientId?: string;
  @IsOptional() @IsMongoId() groupId?: string;
  @IsOptional() @IsString() @MaxLength(500) message?: string;
}
export class CreateEventDto {
  @IsString() @MaxLength(120) title!: string;
  @IsMongoId() placeId!: string;
  @IsDateString() scheduledAt!: string;
  @IsOptional() @IsMongoId() groupId?: string;
  @IsOptional() @IsArray() @IsMongoId({ each: true }) inviteeIds?: string[];
  @IsOptional() @IsString() @MaxLength(1000) note?: string;
}
export class UpdateEventDto {
  @IsOptional() @IsString() @MaxLength(120) title?: string;
  @IsOptional() @IsDateString() scheduledAt?: string;
  @IsOptional() @IsString() @MaxLength(1000) note?: string;
}
export class NotificationQueryDto extends CursorQueryDto {}
