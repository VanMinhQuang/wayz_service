import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtAuthGuard, JwtUser } from '../../../../shared/presentation/http/auth';
import {
  AddGroupMemberDto,
  CreateGroupDto,
  CreatePostDto,
  FeedQueryDto,
  FindUserDto,
  FriendDto,
} from './social.dto';
import { SocialService } from '../../application/social.service';
@ApiTags('social')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'social', version: '1' })
export class SocialController {
  constructor(private readonly social: SocialService) {}
  @Get('users') users(@Query() dto: FindUserDto) {
    return this.social.findByPhone(dto.phone);
  }
  @Get('friends') friends(@CurrentUser() u: JwtUser) {
    return this.social.friends(u.sub);
  }
  @Post('friends/requests') request(@CurrentUser() u: JwtUser, @Body() dto: FriendDto) {
    return this.social.requestFriend(u.sub, dto.userId);
  }
  @Patch('friends/requests/:id/accept') accept(@CurrentUser() u: JwtUser, @Param('id') id: string) {
    return this.social.respondFriend(u.sub, id, true);
  }
  @Patch('friends/requests/:id/reject') reject(@CurrentUser() u: JwtUser, @Param('id') id: string) {
    return this.social.respondFriend(u.sub, id, false);
  }
  @Delete('friends/:userId') remove(@CurrentUser() u: JwtUser, @Param('userId') id: string) {
    return this.social.removeFriend(u.sub, id);
  }
  @Get('groups') groups(@CurrentUser() u: JwtUser) {
    return this.social.listGroups(u.sub);
  }
  @Post('groups') group(@CurrentUser() u: JwtUser, @Body() dto: CreateGroupDto) {
    return this.social.createGroup(u.sub, dto);
  }
  @Post('groups/:id/members') add(
    @CurrentUser() u: JwtUser,
    @Param('id') id: string,
    @Body() dto: AddGroupMemberDto,
  ) {
    return this.social.addMember(u.sub, id, dto.userId);
  }
  @Delete('groups/:id/members/:userId') leave(
    @CurrentUser() u: JwtUser,
    @Param('id') id: string,
    @Param('userId') userId: string,
  ) {
    return this.social.removeMember(u.sub, id, userId);
  }
  @Get('feed') feed(@CurrentUser() u: JwtUser, @Query() dto: FeedQueryDto) {
    return this.social.feed(u.sub, dto.cursor, dto.limit);
  }
  @Post('posts') post(@CurrentUser() u: JwtUser, @Body() dto: CreatePostDto) {
    return this.social.createPost(u.sub, dto);
  }
  @Post('posts/:id/like') like(@CurrentUser() u: JwtUser, @Param('id') id: string) {
    return this.social.like(u.sub, id);
  }
  @Delete('posts/:id/like') unlike(@CurrentUser() u: JwtUser, @Param('id') id: string) {
    return this.social.unlike(u.sub, id);
  }
  @Delete('posts/:id') hide(@CurrentUser() u: JwtUser, @Param('id') id: string) {
    return this.social.hidePost(u.sub, id);
  }
}
