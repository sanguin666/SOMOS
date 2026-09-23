import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';
import { EventCategory, EventRecurrence } from '../entities/event-kinds.js';
import { EmptyStringToNull } from '../../common/transforms/empty-to-null.js';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsDateString()
  startsAt!: string;

  @IsOptional()
  @ValidateIf((_dto, value) => value !== null)
  @IsDateString()
  @EmptyStringToNull()
  endsAt?: string | null;

  @IsOptional()
  @IsString()
  @EmptyStringToNull()
  location?: string | null;

  @IsOptional()
  @IsString()
  @EmptyStringToNull()
  description?: string | null;

  @IsOptional()
  @IsEnum(EventCategory)
  category?: EventCategory;

  @IsOptional()
  @IsEnum(EventRecurrence)
  recurrence?: EventRecurrence;

  // null clears it: a summer timetable that turns back into the usual one.
  @IsOptional()
  @ValidateIf((_dto, value) => value !== null)
  @IsDateString()
  @EmptyStringToNull()
  repeatUntil?: string | null;
}
