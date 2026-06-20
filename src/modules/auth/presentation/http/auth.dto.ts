import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
const phonePattern = /^(\+84|84|0)(3|5|7|8|9)[0-9]{8}$/;
export class RequestOtpDto { @Matches(phonePattern) phone!: string; @IsString() purpose!: 'register' | 'reset-password' | 'change-password'; }
export class RegisterDto { @Matches(phonePattern) phone!: string; @IsString() @MinLength(6) @MaxLength(128) password!: string; @IsString() @MinLength(6) @MaxLength(6) otp!: string; }
export class LoginDto { @Matches(phonePattern) phone!: string; @IsString() password!: string; }
export class VerifyOtpDto { @Matches(phonePattern) phone!: string; @IsString() purpose!: 'register' | 'reset-password' | 'change-password'; @IsString() @MinLength(6) @MaxLength(6) otp!: string; }
export class ResetPasswordDto extends VerifyOtpDto { @IsString() @MinLength(6) @MaxLength(128) password!: string; }
export class RefreshDto { @IsString() refreshToken!: string; }
export class UpdateProfileDto {
  @IsOptional() @IsString() @MaxLength(100) fullName?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() @MaxLength(50) nickname?: string;
  @IsOptional() @IsString() avatarKey?: string;
}
