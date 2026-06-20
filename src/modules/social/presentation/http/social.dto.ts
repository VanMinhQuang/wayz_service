import { IsArray, IsMongoId, IsOptional, IsString, MaxLength } from 'class-validator';
import { CursorQueryDto } from '../../../../shared/presentation/http/pagination';
export class FindUserDto {
  @IsString() phone!: string;
}
export class FriendDto {
  @IsMongoId() userId!: string;
}
export class CreateGroupDto {
  @IsString() @MaxLength(80) name!: string;
  @IsOptional() @IsString() imageKey?: string;
  @IsOptional() @IsArray() @IsMongoId({ each: true }) memberIds?: string[];
}
export class AddGroupMemberDto {
  @IsMongoId() userId!: string;
}
export class CreatePostDto {
  @IsArray() @IsString({ each: true }) imageKeys!: string[];
  @IsOptional() @IsString() @MaxLength(500) caption?: string;
  @IsOptional() @IsMongoId() placeId?: string;
}
export class FeedQueryDto extends CursorQueryDto {}
