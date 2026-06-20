import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq'; import { EventsService } from '../../application/events.service';
@Processor('event-reminders') export class EventsProcessor extends WorkerHost { constructor(private readonly events: EventsService) { super(); } async process(job: Job<{ eventId: string }>) { await this.events.sendReminder(job.data.eventId); } }
