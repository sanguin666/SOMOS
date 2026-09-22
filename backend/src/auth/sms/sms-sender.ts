import { Injectable, Logger } from '@nestjs/common';

/**
 * How a login code reaches a phone. Only the console implementation below
 * exists today — there's no SMS account wired up — but every caller goes
 * through this interface, so adding Twilio (or any other provider) later is
 * a new class and one line in auth.module.ts, not a change to the login
 * flow itself.
 */
export abstract class SmsSender {
  abstract send(phone: string, message: string): Promise<void>;

  /**
   * Whether codes actually leave the machine. When they don't, the login
   * endpoint hands the code back in its own response so the app can be used
   * without an SMS account — see phone-auth.service.ts.
   */
  abstract readonly delivers: boolean;
}

/**
 * Development sender: writes the code to the backend's log instead of
 * sending it. Paired with the `devCode` field the login endpoint returns,
 * this is what makes the phone login usable on a laptop with no Twilio
 * account and no real phone number.
 */
@Injectable()
export class ConsoleSmsSender extends SmsSender {
  readonly delivers = false;

  private readonly logger = new Logger('SMS');

  send(phone: string, message: string): Promise<void> {
    this.logger.log(`(not actually sent) to ${phone}: ${message}`);
    return Promise.resolve();
  }
}
