import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsLatitude,
  IsLongitude,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { CursorQueryDto } from '../../../../shared/presentation/http/pagination';
export class NearbyQueryDto extends CursorQueryDto {
  @Type(() => Number) @IsLatitude() lat!: number;
  @Type(() => Number) @IsLongitude() lng!: number;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(50) @Max(50_000) radius = 5000;
  @IsOptional() @IsMongoId() categoryId?: string;
  @IsOptional() @IsString() q?: string;
}
export class SearchPlacesDto extends CursorQueryDto {
  @IsString() @MaxLength(100) q!: string;
  @IsOptional() @IsMongoId() categoryId?: string;
}
export class CreateReviewDto {
  @Type(() => Number) @IsInt() @Min(1) @Max(5) rating!: number;
  @IsOptional() @IsString() @MaxLength(2000) text?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) imageKeys?: string[];
}
export class RouteQueryDto {
  @Type(() => Number) @IsLatitude() originLat!: number;
  @Type(() => Number) @IsLongitude() originLng!: number;
}
export class GeocodeQueryDto {
  @IsString() @MaxLength(200) q!: string;
}
export class CreateCategoryDto {
  @IsString() @MaxLength(50) name!: string;
  @IsOptional() @IsString() icon?: string;
}
export class CreatePlaceDto {
  @IsString() @MaxLength(150) name!: string;
  @IsString() @MaxLength(300) address!: string;
  @Type(() => Number) @IsLatitude() lat!: number;
  @Type(() => Number) @IsLongitude() lng!: number;
  @IsMongoId() categoryId!: string;
  @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
  @IsOptional() @IsArray() @IsString({ each: true }) imageKeys?: string[];
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() openingHours?: string;
}
export class UpdatePlaceDto extends PartialType(CreatePlaceDto) {
  @IsOptional() @IsBoolean() active?: boolean;
}
