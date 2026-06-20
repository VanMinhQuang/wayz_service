import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
export type PlaceDocument = HydratedDocument<Place>;
@Schema({ _id: false }) export class GeoPoint { @Prop({ enum: ['Point'], default: 'Point' }) type!: 'Point'; @Prop({ type: [Number], required: true }) coordinates!: [number, number]; }
@Schema({ timestamps: true })
export class Category { @Prop({ required: true, unique: true }) name!: string; @Prop() icon?: string; @Prop({ default: true }) active!: boolean; }
export class Place {
  @Prop({ required: true, index: true }) name!: string;
  @Prop({ required: true }) address!: string;
  @Prop({ type: GeoPoint, required: true }) location!: GeoPoint;
  @Prop({ type: Types.ObjectId, ref: 'Category', required: true, index: true }) categoryId!: Types.ObjectId;
  @Prop({ type: [String], default: [] }) tags!: string[];
  @Prop({ type: [String], default: [] }) imageKeys!: string[];
  @Prop() description?: string;
  @Prop() phone?: string;
  @Prop() openingHours?: string;
  @Prop({ default: 0 }) ratingAverage!: number;
  @Prop({ default: 0 }) reviewCount!: number;
  @Prop({ default: true, index: true }) active!: boolean;
}
export const CategorySchema = SchemaFactory.createForClass(Category);
export const PlaceSchema = SchemaFactory.createForClass(Place);
PlaceSchema.index({ location: '2dsphere' });
PlaceSchema.index({ name: 'text', address: 'text', tags: 'text' });
