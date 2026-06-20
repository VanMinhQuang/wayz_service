import { IsIn, IsString } from 'class-validator';
export class CreateUploadDto {
  @IsIn(['avatar', 'place', 'review', 'post']) purpose!: 'avatar' | 'place' | 'review' | 'post';
  @IsString() mimeType!: string;
}
export class ConfirmUploadDto {
  @IsString() key!: string;
}
