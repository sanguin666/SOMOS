import { describe, expect, it } from 'vitest';
import type { Event } from '../api/types';
import { formatDays, formatWhen, occurrencesOf, upcomingOccurrences, weeklyTimetable } from './schedule';

// Local wall-clock dates, so the tests read the same in any time zone.
const at = (y: number, m: number, d: number, h = 0, min = 0) => new Date(y, m - 1, d, h, min);

function event(overrides: Partial<Event> & { startsAt: string }): Event {
  return {
    id: overrides.title ?? 'e',
    title: 'Mass',
    endsAt: null,
    location: null,
    description: null,
    category: 'mass',
    recurrence: 'weekly',
    repeatUntil: null,
    ...overrides,
  };
}

// 7 September 2026 is a Monday.
const MONDAY = at(2026, 9, 7);

describe('occurrencesOf', () => {
  it('finds the next weeks of a weekly event from its first one', () => {
    const sundayMass = event({ startsAt: at(2026, 1, 4, 10).toISOString() });
    const next = occurrencesOf(sundayMass, MONDAY, 2);
    expect(next.map((o) => o.startsAt)).toEqual([at(2026, 9, 13, 10), at(2026, 9, 20, 10)]);
  });

  it('keeps the wall clock time across a change of the clocks', () => {
    const sundayMass = event({ startsAt: at(2026, 3, 1, 10).toISOString() });
    for (const o of occurrencesOf(sundayMass, at(2026, 3, 1), 12)) {
      expect([o.startsAt.getDay(), o.startsAt.getHours(), o.startsAt.getMinutes()]).toEqual([0, 10, 0]);
    }
  });

  it('counts one that is happening right now', () => {
    const office = event({
      category: 'office_hours',
      startsAt: at(2026, 9, 7, 10).toISOString(),
      endsAt: at(2026, 9, 7, 12).toISOString(),
    });
    const [now] = occurrencesOf(office, at(2026, 9, 7, 11), 1);
    expect(now.startsAt).toEqual(at(2026, 9, 7, 10));
    expect(now.endsAt).toEqual(at(2026, 9, 7, 12));
  });

  it('stops after the last day it repeats on', () => {
    const lent = event({
      startsAt: at(2026, 9, 4, 19).toISOString(),
      repeatUntil: at(2026, 9, 18).toISOString(),
    });
    expect(occurrencesOf(lent, MONDAY, 5).map((o) => o.startsAt)).toEqual([
      at(2026, 9, 11, 19),
      at(2026, 9, 18, 19),
    ]);
  });

  it('waits for a weekly event that starts later', () => {
    const later = event({ startsAt: at(2026, 10, 4, 10).toISOString() });
    expect(occurrencesOf(later, MONDAY, 1)[0].startsAt).toEqual(at(2026, 10, 4, 10));
  });

  it('gives a one-off event once, and not once it is over', () => {
    const concert = event({ recurrence: 'none', category: 'other', startsAt: at(2026, 9, 12, 20).toISOString() });
    expect(occurrencesOf(concert, MONDAY, 3)).toHaveLength(1);
    expect(occurrencesOf(concert, at(2026, 9, 13), 3)).toHaveLength(0);
  });
});

describe('upcomingOccurrences', () => {
  it('interleaves events, soonest first', () => {
    const events = [
      event({ title: 'Sunday', startsAt: at(2026, 9, 6, 10).toISOString() }),
      event({ title: 'Tuesday', startsAt: at(2026, 9, 1, 8, 30).toISOString() }),
      event({ title: 'Confession', category: 'confession', startsAt: at(2026, 9, 5, 17).toISOString() }),
    ];
    const next = upcomingOccurrences(events, MONDAY, 4, (e) => e.category === 'mass');
    expect(next.map((o) => o.event.title)).toEqual(['Tuesday', 'Sunday', 'Tuesday', 'Sunday']);
  });
});

describe('weeklyTimetable', () => {
  it('groups days that share their times, week starting on Monday', () => {
    const weekdays = [7, 8, 9, 10, 11].map((d) =>
      event({ title: `wd${d}`, startsAt: at(2026, 9, d, 8, 30).toISOString() }),
    );
    const events = [
      ...weekdays,
      event({ title: 'sat', startsAt: at(2026, 9, 12, 18, 30).toISOString() }),
      event({ title: 'sun1', startsAt: at(2026, 9, 13, 18, 30).toISOString() }),
      event({ title: 'sun2', startsAt: at(2026, 9, 13, 10).toISOString() }),
      event({ title: 'conf', category: 'confession', startsAt: at(2026, 9, 12, 17).toISOString() }),
      event({ title: 'once', recurrence: 'none', startsAt: at(2026, 9, 20, 11).toISOString() }),
    ];
    expect(weeklyTimetable(events, MONDAY)).toEqual([
      {
        category: 'mass',
        rows: [
          { days: [1, 2, 3, 4, 5], times: ['08:30'] },
          { days: [6], times: ['18:30'] },
          { days: [0], times: ['10:00', '18:30'] },
        ],
      },
      { category: 'confession', rows: [{ days: [6], times: ['17:00'] }] },
    ]);
  });

  it('shows when an open office closes, but not when a Mass ends', () => {
    const events = [
      event({ startsAt: at(2026, 9, 13, 10).toISOString(), endsAt: at(2026, 9, 13, 11).toISOString() }),
      event({
        category: 'office_hours',
        startsAt: at(2026, 9, 8, 10).toISOString(),
        endsAt: at(2026, 9, 8, 12).toISOString(),
      }),
    ];
    expect(weeklyTimetable(events, MONDAY).map((s) => s.rows[0].times)).toEqual([['10:00'], ['10:00–12:00']]);
  });

  it('leaves out a weekly event that has ended', () => {
    const ended = event({ startsAt: at(2026, 3, 1, 10).toISOString(), repeatUntil: at(2026, 4, 5).toISOString() });
    expect(weeklyTimetable([ended], MONDAY)).toEqual([]);
  });

  it('can start the week on Sunday', () => {
    const events = [
      event({ title: 'sat', startsAt: at(2026, 9, 12, 18).toISOString() }),
      event({ title: 'sun', startsAt: at(2026, 9, 13, 18).toISOString() }),
    ];
    expect(weeklyTimetable(events, MONDAY, 0)[0].rows).toEqual([{ days: [0], times: ['18:00'] }, { days: [6], times: ['18:00'] }]);
  });
});

describe('formatDays', () => {
  it('names one or two days in full and a run of days short', () => {
    expect(formatDays([0], 'en')).toBe('Sunday');
    expect(formatDays([6, 0], 'fr')).toBe('Samedi, dimanche');
    expect(formatDays([1, 2, 3, 4, 5], 'es')).toMatch(/^Lun\.?–vie\.?$/);
  });
});

describe('formatWhen', () => {
  const words = { today: 'Today', tomorrow: 'Tomorrow' };
  it('says today, tomorrow, the weekday, then the date', () => {
    expect(formatWhen(at(2026, 9, 7, 18, 30), MONDAY, 'en', words)).toBe('Today · 18:30');
    expect(formatWhen(at(2026, 9, 8, 8, 30), MONDAY, 'en', words)).toBe('Tomorrow · 08:30');
    expect(formatWhen(at(2026, 9, 12, 10), MONDAY, 'en', words)).toBe('Saturday · 10:00');
    expect(formatWhen(at(2026, 9, 20, 10), MONDAY, 'fr', words)).toBe('Dimanche 20 septembre · 10:00');
    expect(formatWhen(at(2026, 8, 20, 9, 15), MONDAY, 'en', words)).toBe('20 August · 09:15');
  });
});
