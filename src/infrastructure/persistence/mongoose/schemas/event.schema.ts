import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Event {
  @Prop({ required: true, maxlength: 120 }) title!: string;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) creatorId!: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Place', required: true }) placeId!: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Group' }) groupId?: Types.ObjectId;
  @Prop({ required: true }) scheduledAt!: Date;
  @Prop({ maxlength: 1000, default: '' }) note!: string;
  @Prop({ enum: ['active', 'cancelled'], default: 'active' }) status!: string;
}
export type EventDocument = HydratedDocument<Event>;
export const EventSchema = SchemaFactory.createForClass(Event);
EventSchema.index({ scheduledAt: 1, status: 1 });

@Schema({ timestamps: true })
export class EventInvitation {
  @Prop({ type: Types.ObjectId, ref: 'Event', required: true }) eventId!: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) userId!: Types.ObjectId;
  @Prop({ enum: ['pending', 'accepted', 'declined'], default: 'pending' }) status!: string;
}
export const EventInvitationSchema = SchemaFactory.createForClass(EventInvitation);
EventInvitationSchema.index({ eventId: 1, userId: 1 }, { unique: true });

@Schema({ timestamps: true })
export class PlaceShare {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) senderId!: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Place', required: true }) placeId!: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'User' }) recipientId?: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Group' }) groupId?: Types.ObjectId;
  @Prop({ maxlength: 500, default: '' }) message!: string;
}
export const PlaceShareSchema = SchemaFactory.createForClass(PlaceShare);

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true }) userId!: Types.ObjectId;
  @Prop({ required: true }) type!: string;
  @Prop({ type: Object, default: {} }) data!: Record<string, unknown>;
  @Prop({ default: false }) read!: boolean;
}
export const NotificationSchema = SchemaFactory.createForClass(Notification);
NotificationSchema.index({ userId: 1, createdAt: -1 });

@Schema({ timestamps: true })
export class Report {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) reporterId!: Types.ObjectId;
  @Prop({ required: true, enum: ['post', 'review'] }) targetType!: string;
  @Prop({ required: true }) targetId!: string;
  @Prop({ required: true, maxlength: 500 }) reason!: string;
  @Prop({ enum: ['open', 'resolved'], default: 'open' }) status!: string;
}
export const ReportSchema = SchemaFactory.createForClass(Report);
