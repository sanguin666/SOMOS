import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { Donation } from './entities/donation.entity.js';
import { PoisService } from '../pois/pois.service.js';
import { CreateDonationDto } from './dto/create-donation.dto.js';

export type PeriodTotal = { total: number; count: number };

export type DailyTotal = { date: string; total: number; count: number };

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
  constructor(
    @InjectRepository(Donation)
    private readonly donationsRepository: Repository<Donation>,
    private readonly poisService: PoisService,
  ) {}

  async create(poiId: string, dto: CreateDonationDto): Promise<Donation> {
    const poi = await this.poisService.findOne(poiId);
    const donation = this.donationsRepository.create({ ...dto, poi });
    return this.donationsRepository.save(donation);
  }

  findForPoi(poiId: string, limit = 20): Promise<Donation[]> {
    return this.donationsRepository.find({
      where: { poi: { id: poiId } },
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
    const donations = await this.donationsRepository.find({
      where: { poi: { id: poiId }, createdAt: MoreThanOrEqual(rangeStart) },
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
