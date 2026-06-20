import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
export type SessionDocument = HydratedDocument<Session>;
@Schema({ timestamps: true })
export class Session {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true }) userId!: Types.ObjectId;
  @Prop({ required: true, unique: true, select: false }) tokenId!: string;
  @Prop({ required: true, expires: 0 }) expiresAt!: Date;
  @Prop() revokedAt?: Date;
}
export const SessionSchema = SchemaFactory.createForClass(Session);
