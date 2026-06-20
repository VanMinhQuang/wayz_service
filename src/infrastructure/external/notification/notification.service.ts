import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Notification } from '../../persistence/mongoose/schemas/event.schema';
@Injectable()
export class NotificationService {
  constructor(@InjectModel(Notification.name) private readonly notifications: Model<Notification>) {}
  async create(userId: Types.ObjectId | string, type: string, data: Record<string, unknown> = {}) {
    // FCM delivery is intentionally behind this boundary; persist first for reliable in-app inbox.
    return this.notifications.create({ userId, type, data });
  }
}
