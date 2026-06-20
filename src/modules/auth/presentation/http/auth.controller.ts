import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtAuthGuard, JwtUser } from '../../../../shared/presentation/http/auth';
import { AuthService } from '../../application/auth.service';
import {
  LoginDto,
  RefreshDto,
  RegisterDto,
  RequestOtpDto,
  ResetPasswordDto,
  UpdateProfileDto,
} from './auth.dto';
@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly auth: AuthService) {}
  @Post('otp') requestOtp(@Body() dto: RequestOtpDto) {
    return this.auth.requestOtp(dto.phone, dto.purpose);
  }
  @Post('register') register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }
  @Post('login') login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }
  @Post('password/reset') reset(@Body() dto: ResetPasswordDto) {
    return this.auth.resetPassword(dto);
  }
  @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Post('password/change') changePassword(
    @CurrentUser() user: JwtUser,
    @Body() dto: ResetPasswordDto,
  ) {
    return this.auth.changePassword(user.sub, dto);
  }
  @Post('refresh') refresh(@Body() dto: RefreshDto) {
    return this.auth.refresh(dto.refreshToken);
  }
  @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Post('logout') logout(@CurrentUser() user: JwtUser) {
    return this.auth.logout(user.sub);
  }
  @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Get('me') me(@CurrentUser() user: JwtUser) {
    return this.auth.profile(user.sub);
  }
  @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Patch('me') update(
    @CurrentUser() user: JwtUser,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.auth.updateProfile(user.sub, dto);
  }
}
