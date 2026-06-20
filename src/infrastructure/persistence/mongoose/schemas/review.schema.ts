import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
export type ReviewDocument = HydratedDocument<Review>;
@Schema({ timestamps: true }) export class Review {
  @Prop({ type: Types.ObjectId, ref: 'Place', required: true }) placeId!: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) userId!: Types.ObjectId;
  @Prop({ required: true, min: 1, max: 5 }) rating!: number;
  @Prop({ maxlength: 2000, default: '' }) text!: string;
  @Prop({ type: [String], default: [] }) imageKeys!: string[];
  @Prop({ default: true }) visible!: boolean;
}
export const ReviewSchema = SchemaFactory.createForClass(Review);
ReviewSchema.index({ placeId: 1, userId: 1 }, { unique: true });
