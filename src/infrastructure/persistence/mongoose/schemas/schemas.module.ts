import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { OtpRequest, OtpSchema } from './otp.schema';
import { Session, SessionSchema } from './session.schema';
import { Category, CategorySchema, Place, PlaceSchema } from './place.schema';
import { Review, ReviewSchema } from './review.schema';
import {
  Friendship,
  FriendshipSchema,
  Group,
  GroupMember,
  GroupMemberSchema,
  GroupSchema,
  Post,
  PostLike,
  PostLikeSchema,
  PostSchema,
} from './social.schema';
import {
  Event,
  EventInvitation,
  EventInvitationSchema,
  EventSchema,
  Notification,
  NotificationSchema,
  PlaceShare,
  PlaceShareSchema,
  Report,
  ReportSchema,
} from './event.schema';
export const schemas = [
  { name: User.name, schema: UserSchema },
  { name: OtpRequest.name, schema: OtpSchema },
  { name: Session.name, schema: SessionSchema },
  { name: Category.name, schema: CategorySchema },
  { name: Place.name, schema: PlaceSchema },
  { name: Review.name, schema: ReviewSchema },
  { name: Friendship.name, schema: FriendshipSchema },
  { name: Group.name, schema: GroupSchema },
  { name: GroupMember.name, schema: GroupMemberSchema },
  { name: Post.name, schema: PostSchema },
  { name: PostLike.name, schema: PostLikeSchema },
  { name: Event.name, schema: EventSchema },
  { name: EventInvitation.name, schema: EventInvitationSchema },
  { name: PlaceShare.name, schema: PlaceShareSchema },
  { name: Notification.name, schema: NotificationSchema },
  { name: Report.name, schema: ReportSchema },
];
@Module({ imports: [MongooseModule.forFeature(schemas)], exports: [MongooseModule] })
export class SchemasModule {}
