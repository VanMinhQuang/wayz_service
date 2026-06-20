import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
export type UserDocument = HydratedDocument<User>;
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, index: true }) phone!: string;
  @Prop({ required: true, select: false }) passwordHash!: string;
  @Prop({ default: '' }) fullName!: string;
  @Prop({ default: '' }) email!: string;
  @Prop({ default: '' }) nickname!: string;
  @Prop() avatarKey?: string;
  @Prop({ type: [String], default: ['user'] }) roles!: string[];
  @Prop({ default: true }) active!: boolean;
}
export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ nickname: 'text', fullName: 'text' });
