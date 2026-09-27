import { IsOptional, Matches } from 'class-validator';

export class SetEventReminderDto {
  // For a repeating event: remind only on this day (YYYY-MM-DD, the
  // place's local date). Left out, the bell rings before every time.
  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  onlyDate?: string;
}
