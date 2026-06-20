import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as argon2 from 'argon2';
import { randomInt, randomUUID } from 'crypto';
import { Model, Types } from 'mongoose';
import { OtpRequest } from '../../../infrastructure/persistence/mongoose/schemas/otp.schema';
import { Session } from '../../../infrastructure/persistence/mongoose/schemas/session.schema';
import { User } from '../../../infrastructure/persistence/mongoose/schemas/user.schema';
import { SmsService } from '../../../infrastructure/external/sms/sms.service';
import { LoginDto, RegisterDto, ResetPasswordDto, UpdateProfileDto } from '../presentation/http/auth.dto';

const normalizePhone = (value: string) => `+84${value.replace(/^\+?84|^0/, '')}`;
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly users: Model<User>, @InjectModel(OtpRequest.name) private readonly otps: Model<OtpRequest>,
    @InjectModel(Session.name) private readonly sessions: Model<Session>, private readonly jwt: JwtService,
    private readonly config: ConfigService, private readonly sms: SmsService,
  ) {}
  private safeUser(user: any) { const obj = user.toObject ? user.toObject() : user; delete obj.passwordHash; return obj; }
  async requestOtp(phoneRaw: string, purpose: OtpRequest['purpose']) {
    const phone = normalizePhone(phoneRaw);
    if (purpose === 'register' && await this.users.exists({ phone })) throw new BadRequestException('Phone is already registered');
    if (purpose !== 'register' && !await this.users.exists({ phone })) throw new BadRequestException('Phone is not registered');
    const code = String(randomInt(0, 1_000_000)).padStart(6, '0');
    await this.otps.deleteMany({ phone, purpose, verifiedAt: { $exists: false } });
    await this.otps.create({ phone, purpose, codeHash: await argon2.hash(code), expiresAt: new Date(Date.now() + 5 * 60_000) });
    await this.sms.sendOtp(phone, code);
    return { expiresIn: 300 };
  }
  private async verifyOtp(phoneRaw: string, purpose: OtpRequest['purpose'], code: string) {
    const phone = normalizePhone(phoneRaw);
    const otp = await this.otps.findOne({ phone, purpose, verifiedAt: { $exists: false }, expiresAt: { $gt: new Date() } }).sort({ createdAt: -1 }).select('+codeHash');
    if (!otp || otp.attempts >= 5 || !await argon2.verify(otp.codeHash, code)) { if (otp) await this.otps.updateOne({ _id: otp._id }, { $inc: { attempts: 1 } }); throw new BadRequestException('Invalid or expired OTP'); }
    otp.verifiedAt = new Date(); await otp.save(); return phone;
  }
  async register(dto: RegisterDto) { const phone = await this.verifyOtp(dto.phone, 'register', dto.otp); const user = await this.users.create({ phone, passwordHash: await argon2.hash(dto.password) }); return this.issueTokens(user); }
  async login(dto: LoginDto) { const phone = normalizePhone(dto.phone); const user = await this.users.findOne({ phone, active: true }).select('+passwordHash'); if (!user || !await argon2.verify(user.passwordHash, dto.password)) throw new UnauthorizedException('Invalid phone or password'); return this.issueTokens(user); }
  async resetPassword(dto: ResetPasswordDto) { const phone = await this.verifyOtp(dto.phone, 'reset-password', dto.otp); await this.users.updateOne({ phone }, { passwordHash: await argon2.hash(dto.password) }); await this.sessions.updateMany({ userId: (await this.users.findOne({ phone }))!._id }, { revokedAt: new Date() }); return { success: true }; }
  async changePassword(userId: string, dto: ResetPasswordDto) { const phone = await this.verifyOtp(dto.phone, 'change-password', dto.otp); const user = await this.users.findById(userId); if (!user || user.phone !== phone) throw new ForbiddenException('OTP phone does not match current user'); await this.users.updateOne({ _id: userId }, { passwordHash: await argon2.hash(dto.password) }); await this.sessions.updateMany({ userId, revokedAt: { $exists: false } }, { revokedAt: new Date() }); return { success: true }; }
  async profile(userId: string) { const user = await this.users.findById(userId); if (!user) throw new UnauthorizedException(); return this.safeUser(user); }
  async updateProfile(userId: string, dto: UpdateProfileDto) { const user = await this.users.findByIdAndUpdate(userId, dto, { new: true }); if (!user) throw new UnauthorizedException(); return this.safeUser(user); }
  private async issueTokens(user: any) {
    const tokenId = randomUUID(); const roles = user.roles ?? ['user']; const payload = { sub: user._id.toString(), phone: user.phone, roles };
    const accessToken = await this.jwt.signAsync(payload, { secret: this.config.get('JWT_ACCESS_SECRET'), expiresIn: '15m' });
    const refreshToken = await this.jwt.signAsync({ ...payload, jti: tokenId }, { secret: this.config.get('JWT_REFRESH_SECRET'), expiresIn: '30d' });
    await this.sessions.create({ userId: user._id, tokenId, expiresAt: new Date(Date.now() + 30 * 86400_000) });
    return { accessToken, refreshToken, user: this.safeUser(user) };
  }
  async refresh(refreshToken: string) {
    try { const payload = await this.jwt.verifyAsync(refreshToken, { secret: this.config.get('JWT_REFRESH_SECRET') }); const session = await this.sessions.findOne({ tokenId: payload.jti, userId: new Types.ObjectId(payload.sub), revokedAt: { $exists: false }, expiresAt: { $gt: new Date() } }); if (!session) throw new ForbiddenException(); session.revokedAt = new Date(); await session.save(); const user = await this.users.findById(payload.sub).select('+passwordHash'); if (!user || !user.active) throw new ForbiddenException(); return this.issueTokens(user); } catch { throw new UnauthorizedException('Invalid refresh token'); }
  }
  async logout(userId: string) { await this.sessions.updateMany({ userId, revokedAt: { $exists: false } }, { revokedAt: new Date() }); return { success: true }; }
}
