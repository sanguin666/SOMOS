import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';
// Expo accepts at most 100 messages per request.
const BATCH_SIZE = 100;

export interface PushMessage {
  to: string;
  title: string;
  body: string;
  // Read by the app when the notification is tapped, to open the right
  // screen (e.g. { poiId, screen: 'announcement', id }).
  data?: Record<string, string>;
}

interface ExpoTicket {
  status: 'ok' | 'error';
  message?: string;
  details?: { error?: string };
}

/**
 * Sends notifications through Expo's push service, which forwards them to
 * Firebase (Android) and Apple. Needs no key of its own; EXPO_ACCESS_TOKEN
 * is only required if "enhanced push security" is turned on in the Expo
 * project. PUSH_NOTIFICATIONS=off stops every send (tests, local copies of
 * real data).
 */
@Injectable()
export class ExpoPushClient {
  private readonly logger = new Logger(ExpoPushClient.name);

  constructor(private readonly configService: ConfigService) {}

  get enabled(): boolean {
    return this.configService.get<string>('PUSH_NOTIFICATIONS', 'on') !== 'off';
  }

  /**
   * Sends every message and returns the tokens Expo says are dead (the app
   * was uninstalled or notifications were turned off), so the caller can
   * forget them. Never throws: a notification failing must not fail the
   * news post or reply that triggered it.
   */
  async send(messages: PushMessage[]): Promise<string[]> {
    if (!this.enabled || messages.length === 0) return [];
    const dead: string[] = [];
    const accessToken = this.configService.get<string>('EXPO_ACCESS_TOKEN');
    for (let i = 0; i < messages.length; i += BATCH_SIZE) {
      const batch = messages.slice(i, i + BATCH_SIZE).map((m) => ({ ...m, sound: 'default' }));
      try {
        const response = await fetch(EXPO_PUSH_URL, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
          body: JSON.stringify(batch),
        });
        if (!response.ok) {
          this.logger.warn(`Expo push refused a batch: HTTP ${response.status}`);
          continue;
        }
        const { data } = (await response.json()) as { data?: ExpoTicket[] };
        (data ?? []).forEach((ticket, index) => {
          if (ticket.status !== 'error') return;
          if (ticket.details?.error === 'DeviceNotRegistered') dead.push(batch[index].to);
          else this.logger.warn(`Expo push error: ${ticket.message ?? 'unknown'}`);
        });
      } catch (error) {
        this.logger.warn(`Expo push unreachable: ${(error as Error).message}`);
      }
    }
    return dead;
  }
}
