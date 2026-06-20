import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SchemasModule } from '../../infrastructure/persistence/mongoose/schemas/schemas.module';
import { AuthController } from './presentation/http/auth.controller'; import { AuthService } from './application/auth.service'; import { JwtStrategy } from './infrastructure/auth/jwt.strategy';
@Module({ imports: [SchemasModule, PassportModule, JwtModule.register({})], controllers: [AuthController], providers: [AuthService, JwtStrategy], exports: [AuthService, JwtModule] }) export class AuthModule {}
