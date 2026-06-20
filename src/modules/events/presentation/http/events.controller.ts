import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtAuthGuard, JwtUser } from '../../../../shared/presentation/http/auth';
import { CreateEventDto, NotificationQueryDto, SharePlaceDto, UpdateEventDto } from './events.dto';
import { EventsService } from '../../application/events.service';
@ApiTags('events')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'events', version: '1' })
export class EventsController {
  constructor(private readonly events: EventsService) {}
  @Get() list(@CurrentUser() u: JwtUser) {
    return this.events.listForUser(u.sub);
  }
  @Post() create(@CurrentUser() u: JwtUser, @Body() dto: CreateEventDto) {
    return this.events.createEvent(u.sub, dto);
  }
  @Patch(':id') update(@CurrentUser() u: JwtUser, @Param('id') id: string, @Body() dto: UpdateEventDto) {
    return this.events.update(u.sub, id, dto);
  }
  @Delete(':id') cancel(@CurrentUser() u: JwtUser, @Param('id') id: string) {
    return this.events.cancel(u.sub, id);
  }
  @Patch(':id/accept') accept(@CurrentUser() u: JwtUser, @Param('id') id: string) {
    return this.events.respond(u.sub, id, true);
  }
  @Patch(':id/decline') decline(@CurrentUser() u: JwtUser, @Param('id') id: string) {
    return this.events.respond(u.sub, id, false);
  }
  @Post('shares') share(@CurrentUser() u: JwtUser, @Body() dto: SharePlaceDto) {
    return this.events.sharePlace(u.sub, dto);
  }
}
@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'notifications', version: '1' })
export class NotificationsController {
  constructor(private readonly events: EventsService) {}
  @Get() list(@CurrentUser() u: JwtUser, @Query() q: NotificationQueryDto) {
    return this.events.listNotifications(u.sub, q.cursor, q.limit);
  }
  @Patch(':id/read') read(@CurrentUser() u: JwtUser, @Param('id') id: string) {
    return this.events.readNotification(u.sub, id);
  }
}
