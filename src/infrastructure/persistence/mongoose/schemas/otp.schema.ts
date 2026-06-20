import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type OtpDocument = HydratedDocument<OtpRequest>;
@Schema({ timestamps: true })
export class OtpRequest {
  @Prop({ required: true, index: true }) phone!: string;
  @Prop({ required: true }) purpose!: 'register' | 'reset-password' | 'change-password';
  @Prop({ required: true, select: false }) codeHash!: string;
  @Prop({ required: true, expires: 0 }) expiresAt!: Date;
  @Prop({ default: 0 }) attempts!: number;
  @Prop() verifiedAt?: Date;
}
export const OtpSchema = SchemaFactory.createForClass(OtpRequest);
OtpSchema.index({ phone: 1, purpose: 1, createdAt: -1 });
