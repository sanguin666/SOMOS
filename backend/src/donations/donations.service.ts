import { Injectable, Logger, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import type Stripe from 'stripe';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { Donation, DonationStatus } from './entities/donation.entity.js';
import { PoisService } from '../pois/pois.service.js';
import { CreateDonationDto } from './dto/create-donation.dto.js';
import { StripeService } from './stripe.service.js';

export type PeriodTotal = { total: number; count: number };

export type DailyTotal = { date: string; total: number; count: number };

/**
 * What the app should do next after asking to donate. 'demo' means no Stripe
 * key is configured, so the gift was recorded without a payment and the app
 * can go straight to its thank-you screen.
 */
export type CheckoutResult =
  | { mode: 'demo'; donationId: string }
  | { mode: 'stripe'; donationId: string; checkoutUrl: string };

export type DonationStats = {
  dailyTotals: DailyTotal[];
  thisWeek: PeriodTotal;
  lastWeek: PeriodTotal;
  thisMonth: PeriodTotal;
  lastMonth: PeriodTotal;
};

const CHART_WINDOW_DAYS = 30;

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Monday-start week, matching how most parishes think about "this week"
// (Sunday service closes the week rather than opening it).
function startOfWeek(date: Date): Date {
  const d = startOfDay(date);
  const day = d.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diffToMonday);
  return d;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function addMonths(date: Date, months: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + months, 1);
}

function toDateKey(date: Date): string {
  const d = startOfDay(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

@Injectable()
export class DonationsService {
  private readonly logger = new Logger(DonationsService.name);

  constructor(
    @InjectRepository(Donation)
    private readonly donationsRepository: Repository<Donation>,
    private readonly poisService: PoisService,
    private readonly stripeService: StripeService,
  ) {}

  async create(poiId: string, dto: CreateDonationDto): Promise<Donation> {
    const poi = await this.poisService.findOne(poiId);
    const donation = this.donationsRepository.create({ ...dto, poi });
    return this.donationsRepository.save(donation);
  }

  /**
   * Starts a gift. With Stripe configured the row is created PENDING and the
   * caller is sent to Stripe's hosted checkout page; without it the gift is
   * recorded straight away so the demo still works on a machine with no keys.
   */
  async startCheckout(
    poiId: string,
    dto: CreateDonationDto,
    returnUrlBase: string,
  ): Promise<CheckoutResult> {
    const poi = await this.poisService.findOne(poiId);

    if (!this.stripeService.isConfigured) {
      const donation = await this.donationsRepository.save(
        this.donationsRepository.create({ ...dto, poi, status: DonationStatus.COMPLETED }),
      );
      return { mode: 'demo', donationId: donation.id };
    }

    const donation = await this.donationsRepository.save(
      this.donationsRepository.create({
        ...dto,
        poi,
        currency: this.stripeService.currency,
        status: DonationStatus.PENDING,
      }),
    );

    let session: Stripe.Checkout.Session;
    try {
      session = await this.stripeService.createCheckoutSession({
        amount: dto.amount,
        poiName: poi.name,
        donationId: donation.id,
        poiId: poi.id,
        successUrl: `${returnUrlBase}/donations/return?status=success`,
        cancelUrl: `${returnUrlBase}/donations/return?status=cancelled`,
      });
    } catch (error) {
      // A bad key or an unreachable Stripe shouldn't read as "the app is
      // broken" in the logs — the pending row is simply never promoted.
      this.logger.error(`Stripe checkout failed: ${(error as Error).message}`);
      throw new ServiceUnavailableException('Could not start the payment');
    }

    donation.stripeSessionId = session.id;
    await this.donationsRepository.save(donation);

    if (!session.url) {
      throw new ServiceUnavailableException('Stripe did not return a checkout URL');
    }
    return { mode: 'stripe', donationId: donation.id, checkoutUrl: session.url };
  }

  /**
   * The app polls this after sending someone to Stripe. A still-pending gift
   * is re-checked against Stripe itself rather than waiting on the webhook,
   * so payments confirm even on a laptop Stripe can't reach.
   */
  async getStatus(poiId: string, donationId: string): Promise<{ status: DonationStatus; amount: number }> {
    const donation = await this.donationsRepository.findOne({
      where: { id: donationId, poi: { id: poiId } },
    });
    if (!donation) throw new NotFoundException('Donation not found');

    if (donation.status === DonationStatus.PENDING && donation.stripeSessionId) {
      const session = await this.stripeService.retrieveSession(donation.stripeSessionId);
      await this.applySessionOutcome(donation, session.payment_status, session.status, session.payment_intent);
    }

    return { status: donation.status, amount: donation.amount };
  }

  /** Promotes (or fails) a pending gift from a Stripe session, webhook or poll. */
  async applySessionOutcome(
    donation: Donation,
    paymentStatus: string | null | undefined,
    sessionStatus: string | null | undefined,
    paymentIntent: unknown,
  ): Promise<void> {
    if (donation.status !== DonationStatus.PENDING) return;

    if (paymentStatus === 'paid') {
      donation.status = DonationStatus.COMPLETED;
      donation.stripePaymentIntentId =
        typeof paymentIntent === 'string' ? paymentIntent : donation.stripePaymentIntentId;
    } else if (sessionStatus === 'expired') {
      donation.status = DonationStatus.FAILED;
    } else {
      // Still open — the payer hasn't finished yet, so leave it pending.
      return;
    }
    await this.donationsRepository.save(donation);
  }

  async findBySessionId(sessionId: string): Promise<Donation | null> {
    return this.donationsRepository.findOne({ where: { stripeSessionId: sessionId } });
  }

  findForPoi(poiId: string, limit = 20): Promise<Donation[]> {
    return this.donationsRepository.find({
      where: { poi: { id: poiId }, status: DonationStatus.COMPLETED },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getStats(poiId: string): Promise<DonationStats> {
    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const lastMonthStart = addMonths(thisMonthStart, -1);
    const thisWeekStart = startOfWeek(now);
    const lastWeekStart = addDays(thisWeekStart, -7);

    // One query covers every window below: it's the earliest boundary we
    // need (last month, which always starts before last week).
    const rangeStart = lastMonthStart < lastWeekStart ? lastMonthStart : lastWeekStart;
    // Abandoned checkouts stay PENDING forever, so the parish's totals only
    // ever count gifts that actually went through.
    const donations = await this.donationsRepository.find({
      where: {
        poi: { id: poiId },
        status: DonationStatus.COMPLETED,
        createdAt: MoreThanOrEqual(rangeStart),
      },
    });

    const sumInRange = (from: Date, to: Date): PeriodTotal => {
      let total = 0;
      let count = 0;
      for (const donation of donations) {
        if (donation.createdAt >= from && donation.createdAt < to) {
          total += donation.amount;
          count += 1;
        }
      }
      return { total: round2(total), count };
    };

    const dailyMap = new Map<string, PeriodTotal>();
    for (const donation of donations) {
      const key = toDateKey(donation.createdAt);
      const entry = dailyMap.get(key) ?? { total: 0, count: 0 };
      entry.total += donation.amount;
      entry.count += 1;
      dailyMap.set(key, entry);
    }
    const today = startOfDay(now);
    const dailyTotals: DailyTotal[] = [];
    for (let i = CHART_WINDOW_DAYS - 1; i >= 0; i--) {
      const day = addDays(today, -i);
      const key = toDateKey(day);
      const entry = dailyMap.get(key) ?? { total: 0, count: 0 };
      dailyTotals.push({ date: key, total: round2(entry.total), count: entry.count });
    }

    // "Last week"/"last month" are cut off at the same elapsed time as the
    // current, still-in-progress period — comparing a few days of this week
    // against all 7 of last week (or a partial month against a full one)
    // would always read as a decline regardless of the real trend.
    const lastWeekComparableEnd = new Date(lastWeekStart.getTime() + (now.getTime() - thisWeekStart.getTime()));
    const lastMonthComparableEnd = new Date(lastMonthStart.getTime() + (now.getTime() - thisMonthStart.getTime()));

    return {
      dailyTotals,
      thisWeek: sumInRange(thisWeekStart, now),
      lastWeek: sumInRange(lastWeekStart, lastWeekComparableEnd),
      thisMonth: sumInRange(thisMonthStart, now),
      lastMonth: sumInRange(lastMonthStart, lastMonthComparableEnd),
    };
  }
}
