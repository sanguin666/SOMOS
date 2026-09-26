import { Injectable, Logger, NotFoundException, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { And, In, IsNull, LessThanOrEqual, MoreThan, Repository } from 'typeorm';
import { PushToken } from './entities/push-token.entity.js';
import { EventReminder } from './entities/event-reminder.entity.js';
import { UserPoi } from '../user-pois/entities/user-poi.entity.js';
import { Event } from '../events/entities/event.entity.js';
import { EventRecurrence } from '../events/entities/event-kinds.js';
import { Language } from '../common/enums/language.enum.js';
import { ExpoPushClient, type PushMessage } from './expo-push.client.js';
import { formatTime, text } from './texts.js';
import type { UpdateNotificationPreferencesDto } from './dto/update-notification-preferences.dto.js';
import type { RegisterPushTokenDto } from './dto/register-push-token.dto.js';

export type NotificationKind = 'news' | 'requests' | 'events' | 'live';

export interface NotificationPreferences {
  news: boolean;
  requests: boolean;
  events: boolean;
  live: boolean;
}

export interface Notification {
  title: string;
  body: string;
  // Read by the app when the notification is tapped: `screen` and `id`
  // say what to open. `poiId` is added here, for every notification.
  data?: Record<string, string>;
}

/** Who a notification is for, so it can be written in their words. */
export interface Reader {
  language: Language;
  timeZone?: string | null;
}

/** A notification, or how to write it for one reader. */
export type Composer = Notification | ((reader: Reader) => Notification);

const PREFERENCE_COLUMN = {
  news: 'notifyNews',
  requests: 'notifyRequests',
  events: 'notifyEvents',
  live: 'notifyLive',
} as const satisfies Record<NotificationKind, keyof UserPoi>;

const REMINDER_LEAD_MS = 60 * 60 * 1000;
const REMINDER_SWEEP_MS = 60 * 1000;

@Injectable()
export class NotificationsService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(NotificationsService.name);
  private sweep?: NodeJS.Timeout;

  constructor(
    @InjectRepository(PushToken)
    private readonly tokenRepository: Repository<PushToken>,
    @InjectRepository(UserPoi)
    private readonly membershipRepository: Repository<UserPoi>,
    @InjectRepository(EventReminder)
    private readonly reminderRepository: Repository<EventReminder>,
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private readonly expoPush: ExpoPushClient,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit(): void {
    // Tests call sendDueEventReminders themselves, with a clock of their own.
    if (this.configService.get<string>('NODE_ENV') === 'test') return;
    this.sweep = setInterval(() => {
      this.sendDueEventReminders().catch((error: Error) =>
        this.logger.warn(`Event reminders failed: ${error.message}`),
      );
    }, REMINDER_SWEEP_MS);
  }

  onModuleDestroy(): void {
    if (this.sweep) clearInterval(this.sweep);
  }

  async registerToken(userId: string, dto: RegisterPushTokenDto): Promise<void> {
    // Upsert on the token: a phone that changes hands moves to its new
    // owner instead of notifying both.
    await this.tokenRepository.upsert(
      {
        token: dto.token,
        user: { id: userId },
        language: dto.language ?? Language.EN,
        timeZone: dto.timeZone ?? null,
      },
      ['token'],
    );
  }

  async removeToken(userId: string, token: string): Promise<void> {
    await this.tokenRepository.delete({ token, user: { id: userId } });
  }

  async getPreferences(userId: string, poiId: string): Promise<NotificationPreferences> {
    return toPreferences(await this.findMembership(userId, poiId));
  }

  async updatePreferences(
    userId: string,
    poiId: string,
    dto: UpdateNotificationPreferencesDto,
  ): Promise<NotificationPreferences> {
    const membership = await this.findMembership(userId, poiId);
    for (const kind of Object.keys(PREFERENCE_COLUMN) as NotificationKind[]) {
      const value = dto[kind];
      if (value !== undefined) membership[PREFERENCE_COLUMN[kind]] = value;
    }
    return toPreferences(await this.membershipRepository.save(membership));
  }

  /** The events in a place this person rang the bell for. */
  async listEventReminders(userId: string, poiId: string): Promise<string[]> {
    await this.findMembership(userId, poiId);
    const reminders = await this.reminderRepository.find({
      where: { user: { id: userId }, event: { poi: { id: poiId } } },
      relations: { event: true },
    });
    return reminders.map((r) => r.event.id);
  }

  async addEventReminder(userId: string, eventId: string): Promise<void> {
    const event = await this.eventRepository.findOne({ where: { id: eventId }, relations: { poi: true } });
    if (!event) throw new NotFoundException('Event not found');
    await this.findMembership(userId, event.poi.id);
    await this.reminderRepository.upsert({ user: { id: userId }, event: { id: eventId } }, ['user', 'event']);
  }

  async removeEventReminder(userId: string, eventId: string): Promise<void> {
    await this.reminderRepository.delete({ user: { id: userId }, event: { id: eventId } });
  }

  /**
   * Sends the reminder for every belled one-off event starting within the
   * next hour, once. Runs every minute; `now` is there for tests.
   */
  async sendDueEventReminders(now = new Date()): Promise<void> {
    const due = await this.reminderRepository.find({
      where: {
        remindedAt: IsNull(),
        event: {
          recurrence: EventRecurrence.NONE,
          startsAt: And(MoreThan(now), LessThanOrEqual(new Date(now.getTime() + REMINDER_LEAD_MS))),
        },
      },
      relations: { user: true, event: { poi: true } },
    });
    for (const reminder of due) {
      reminder.remindedAt = now;
      await this.reminderRepository.save(reminder);
      const { event } = reminder;
      await this.notifyUsers([reminder.user.id], event.poi.id, 'events', (reader) => ({
        title: text(reader.language, 'inOneHour', { title: event.title }),
        body: [formatTime(event.startsAt, reader.language, reader.timeZone), event.location]
          .filter(Boolean)
          .join(', '),
        data: { screen: 'event', id: event.id },
      }));
    }
  }

  /** Everyone in a place who kept this kind on, e.g. important news. */
  async notifyPoiMembers(poiId: string, kind: NotificationKind, notification: Composer): Promise<void> {
    const memberships = await this.membershipRepository.find({
      where: { poi: { id: poiId }, [PREFERENCE_COLUMN[kind]]: true },
      relations: { user: true },
    });
    await this.sendToUsers(
      memberships.map((m) => m.user.id),
      poiId,
      notification,
    );
  }

  /**
   * Particular people in a place (the person whose request got a reply,
   * those who belled an event), minus anyone who turned that kind off.
   */
  async notifyUsers(
    userIds: string[],
    poiId: string,
    kind: NotificationKind,
    notification: Composer,
  ): Promise<void> {
    if (userIds.length === 0) return;
    const memberships = await this.membershipRepository.find({
      where: { poi: { id: poiId }, user: { id: In(userIds) }, [PREFERENCE_COLUMN[kind]]: true },
      relations: { user: true },
    });
    await this.sendToUsers(
      memberships.map((m) => m.user.id),
      poiId,
      notification,
    );
  }

  /**
   * The same as notifyPoiMembers/notifyUsers, but never throws and never
   * holds up the caller: a notification failing must not fail the news
   * post or reply that triggered it.
   */
  fireAndForget(send: () => Promise<void>): void {
    send().catch((error: Error) => this.logger.warn(`Notification failed: ${error.message}`));
  }

  private async sendToUsers(userIds: string[], poiId: string, notification: Composer): Promise<void> {
    if (userIds.length === 0 || !this.expoPush.enabled) return;
    const tokens = await this.tokenRepository.find({ where: { user: { id: In(userIds) } } });
    const messages: PushMessage[] = tokens.map((t) => {
      const written = typeof notification === 'function' ? notification(t) : notification;
      return { to: t.token, ...written, data: { ...written.data, poiId } };
    });
    const dead = await this.expoPush.send(messages);
    if (dead.length > 0) await this.tokenRepository.delete({ token: In(dead) });
  }

  private async findMembership(userId: string, poiId: string): Promise<UserPoi> {
    const membership = await this.membershipRepository.findOne({
      where: { user: { id: userId }, poi: { id: poiId } },
    });
    if (!membership) throw new NotFoundException('Not a member of this place');
    return membership;
  }
}

function toPreferences(membership: UserPoi): NotificationPreferences {
  return {
    news: membership.notifyNews,
    requests: membership.notifyRequests,
    events: membership.notifyEvents,
    live: membership.notifyLive,
  };
}
