import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Friendship {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) requesterId!: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) addresseeId!: Types.ObjectId;
  @Prop({ enum: ['pending', 'accepted', 'rejected'], default: 'pending' }) status!: string;
}
export type FriendshipDocument = HydratedDocument<Friendship>;
export const FriendshipSchema = SchemaFactory.createForClass(Friendship);
FriendshipSchema.index({ requesterId: 1, addresseeId: 1 }, { unique: true });

@Schema({ timestamps: true })
export class Group {
  @Prop({ required: true, maxlength: 80 }) name!: string;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) ownerId!: Types.ObjectId;
  @Prop() imageKey?: string;
}
export type GroupDocument = HydratedDocument<Group>;
export const GroupSchema = SchemaFactory.createForClass(Group);

@Schema({ timestamps: true })
export class GroupMember {
  @Prop({ type: Types.ObjectId, ref: 'Group', required: true }) groupId!: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) userId!: Types.ObjectId;
  @Prop({ enum: ['owner', 'member'], default: 'member' }) role!: string;
}
export const GroupMemberSchema = SchemaFactory.createForClass(GroupMember);
GroupMemberSchema.index({ groupId: 1, userId: 1 }, { unique: true });

@Schema({ timestamps: true })
export class Post {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true }) authorId!: Types.ObjectId;
  @Prop({
    type: [String],
    required: true,
    validate: [(v: string[]) => v.length > 0 && v.length <= 10, '1-10 images required'],
  })
  imageKeys!: string[];
  @Prop({ maxlength: 500, default: '' }) caption!: string;
  @Prop({ type: Types.ObjectId, ref: 'Place' }) placeId?: Types.ObjectId;
  @Prop({ default: true }) visible!: boolean;
  @Prop({ default: 0 }) likeCount!: number;
}
export type PostDocument = HydratedDocument<Post>;
export const PostSchema = SchemaFactory.createForClass(Post);
PostSchema.index({ authorId: 1, createdAt: -1 });

@Schema({ timestamps: true })
export class PostLike {
  @Prop({ type: Types.ObjectId, ref: 'Post', required: true }) postId!: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) userId!: Types.ObjectId;
}
export const PostLikeSchema = SchemaFactory.createForClass(PostLike);
PostLikeSchema.index({ postId: 1, userId: 1 }, { unique: true });
