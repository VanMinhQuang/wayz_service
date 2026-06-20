import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Friendship,
  Group,
  GroupMember,
  Post,
  PostLike,
} from '../../../infrastructure/persistence/mongoose/schemas/social.schema';
import { User } from '../../../infrastructure/persistence/mongoose/schemas/user.schema';
import { NotificationService } from '../../../infrastructure/external/notification/notification.service';
import { CreateGroupDto, CreatePostDto } from '../presentation/http/social.dto';
const oid = (id: string) => new Types.ObjectId(id);
@Injectable()
export class SocialService {
  constructor(
    @InjectModel(User.name) private readonly users: Model<User>,
    @InjectModel(Friendship.name) private readonly friendships: Model<Friendship>,
    @InjectModel(Group.name) private readonly groups: Model<Group>,
    @InjectModel(GroupMember.name) private readonly members: Model<GroupMember>,
    @InjectModel(Post.name) private readonly posts: Model<Post>,
    @InjectModel(PostLike.name) private readonly likes: Model<PostLike>,
    private readonly notifications: NotificationService,
  ) {}
  async findByPhone(phone: string) {
    const normalized = `+84${phone.replace(/^\+?84|^0/, '')}`;
    const user = await this.users.findOne({ phone: normalized }, 'fullName nickname avatarKey phone');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
  async requestFriend(me: string, other: string) {
    if (me === other) throw new BadRequestException('Cannot add yourself');
    const existing = await this.friendships.findOne({
      $or: [
        { requesterId: me, addresseeId: other },
        { requesterId: other, addresseeId: me },
      ],
    });
    if (existing) throw new BadRequestException('Friendship already exists');
    const friend = await this.friendships.create({ requesterId: me, addresseeId: other });
    await this.notifications.create(other, 'friend.request', { friendshipId: friend._id.toString() });
    return friend;
  }
  async respondFriend(me: string, friendshipId: string, accept: boolean) {
    const f = await this.friendships.findOne({ _id: friendshipId, addresseeId: me, status: 'pending' });
    if (!f) throw new NotFoundException('Friend request not found');
    f.status = accept ? 'accepted' : 'rejected';
    await f.save();
    if (accept) await this.notifications.create(f.requesterId, 'friend.accepted', { friendshipId });
    return f;
  }
  async removeFriend(me: string, other: string) {
    const result = await this.friendships.deleteOne({
      status: 'accepted',
      $or: [
        { requesterId: me, addresseeId: other },
        { requesterId: other, addresseeId: me },
      ],
    });
    if (!result.deletedCount) throw new NotFoundException('Friendship not found');
    return { success: true };
  }
  async friendIds(userId: string) {
    const rows = await this.friendships.find({
      status: 'accepted',
      $or: [{ requesterId: userId }, { addresseeId: userId }],
    });
    return rows.map((f) => (f.requesterId.toString() === userId ? f.addresseeId : f.requesterId));
  }
  async friends(me: string) {
    const ids = await this.friendIds(me);
    return this.users.find({ _id: { $in: ids } }, 'fullName nickname avatarKey phone');
  }
  async createGroup(me: string, dto: CreateGroupDto) {
    const wanted = [...new Set(dto.memberIds ?? [])].filter((id) => id !== me);
    const friendIds = (await this.friendIds(me)).map(String);
    if (wanted.some((id) => !friendIds.includes(id)))
      throw new ForbiddenException('Only friends can be added to a group');
    const group = await this.groups.create({ name: dto.name, imageKey: dto.imageKey, ownerId: me });
    await this.members.insertMany([
      { groupId: group._id, userId: me, role: 'owner' },
      ...wanted.map((userId) => ({ groupId: group._id, userId, role: 'member' })),
    ]);
    await Promise.all(
      wanted.map((id) => this.notifications.create(id, 'group.added', { groupId: group._id.toString() })),
    );
    return group;
  }
  async ensureMember(groupId: string, userId: string) {
    const member = await this.members.exists({ groupId, userId });
    if (!member) throw new ForbiddenException('Not a group member');
  }
  async listGroups(me: string) {
    const memberships = await this.members.find({ userId: me });
    return this.groups.find({ _id: { $in: memberships.map((m) => m.groupId) } });
  }
  async addMember(me: string, groupId: string, userId: string) {
    const owner = await this.members.exists({ groupId, userId: me, role: 'owner' });
    if (!owner) throw new ForbiddenException('Only owner can add members');
    const friendIds = (await this.friendIds(me)).map(String);
    if (!friendIds.includes(userId)) throw new ForbiddenException('Only friends can be added');
    await this.members.create({ groupId, userId });
    return this.notifications.create(userId, 'group.added', { groupId });
  }
  async removeMember(me: string, groupId: string, userId: string) {
    const isOwner = await this.members.exists({ groupId, userId: me, role: 'owner' });
    if (!isOwner && me !== userId) throw new ForbiddenException();
    await this.members.deleteOne({ groupId, userId });
    return { success: true };
  }
  async createPost(me: string, dto: CreatePostDto) {
    if (!dto.imageKeys.length || dto.imageKeys.length > 10)
      throw new BadRequestException('Post needs 1-10 images');
    return this.posts.create({ authorId: me, ...dto });
  }
  async feed(me: string, cursor?: string, limit = 20) {
    const friendIds = await this.friendIds(me);
    const filter: any = { visible: true, authorId: { $in: [...friendIds, oid(me)] } };
    if (cursor) filter._id = { $lt: oid(cursor) };
    const rows = await this.posts
      .find(filter)
      .populate('authorId', 'fullName nickname avatarKey')
      .populate('placeId', 'name address')
      .sort({ _id: -1 })
      .limit(limit + 1);
    const hasMore = rows.length > limit;
    const data = rows.slice(0, limit);
    return { data, nextCursor: hasMore ? data[data.length - 1]._id.toString() : null };
  }
  async like(me: string, postId: string) {
    const post = await this.posts.findById(postId);
    if (!post || !post.visible) throw new NotFoundException('Post not found');
    const allowed =
      post.authorId.toString() === me || (await this.friendIds(me)).some((id) => id.equals(post.authorId));
    if (!allowed) throw new ForbiddenException('Post is not visible to you');
    try {
      await this.likes.create({ postId, userId: me });
      await this.posts.updateOne({ _id: postId }, { $inc: { likeCount: 1 } });
    } catch {
      /* already liked: idempotent */
    }
    return this.posts.findById(postId);
  }
  async unlike(me: string, postId: string) {
    const result = await this.likes.deleteOne({ postId, userId: me });
    if (result.deletedCount)
      await this.posts.updateOne({ _id: postId, likeCount: { $gt: 0 } }, { $inc: { likeCount: -1 } });
    return { success: true };
  }
  async hidePost(me: string, postId: string) {
    const post = await this.posts.findOneAndUpdate(
      { _id: postId, authorId: me },
      { visible: false },
      { new: true },
    );
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }
}
