import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PushToken } from './entities/push-token.entity.js';
import { UserPoi } from '../user-pois/entities/user-poi.entity.js';
import { ExpoPushClient, type PushMessage } from './expo-push.client.js';
import type { UpdateNotificationPreferencesDto } from './dto/update-notification-preferences.dto.js';

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
  data?: Record<string, string>;
}

const PREFERENCE_COLUMN = {
  news: 'notifyNews',
  requests: 'notifyRequests',
  events: 'notifyEvents',
  live: 'notifyLive',
} as const satisfies Record<NotificationKind, keyof UserPoi>;

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(PushToken)
    private readonly tokenRepository: Repository<PushToken>,
    @InjectRepository(UserPoi)
    private readonly membershipRepository: Repository<UserPoi>,
    private readonly expoPush: ExpoPushClient,
  ) {}

  async registerToken(userId: string, token: string): Promise<void> {
    // Upsert on the token: a phone that changes hands moves to its new
    // owner instead of notifying both.
    await this.tokenRepository.upsert({ token, user: { id: userId } }, ['token']);
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

  /** Everyone in a place who kept this kind on, e.g. important news. */
  async notifyPoiMembers(poiId: string, kind: NotificationKind, notification: Notification): Promise<void> {
    const memberships = await this.membershipRepository.find({
      where: { poi: { id: poiId }, [PREFERENCE_COLUMN[kind]]: true },
      relations: { user: true },
    });
    await this.sendToUsers(
      memberships.map((m) => m.user.id),
      withPoi(poiId, notification),
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
    notification: Notification,
  ): Promise<void> {
    if (userIds.length === 0) return;
    const memberships = await this.membershipRepository.find({
      where: { poi: { id: poiId }, user: { id: In(userIds) }, [PREFERENCE_COLUMN[kind]]: true },
      relations: { user: true },
    });
    await this.sendToUsers(
      memberships.map((m) => m.user.id),
      withPoi(poiId, notification),
    );
  }

  private async sendToUsers(userIds: string[], notification: Notification): Promise<void> {
    if (userIds.length === 0 || !this.expoPush.enabled) return;
    const tokens = await this.tokenRepository.find({ where: { user: { id: In(userIds) } } });
    const messages: PushMessage[] = tokens.map((t) => ({ to: t.token, ...notification }));
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

// Every notification carries its place, so a tap opens the right one even
// when the person belongs to several.
function withPoi(poiId: string, notification: Notification): Notification {
  return { ...notification, data: { ...notification.data, poiId } };
}
