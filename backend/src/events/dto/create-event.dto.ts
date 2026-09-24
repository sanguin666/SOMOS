import {
  ArrayMaxSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EventCategory, EventRecurrence } from '../entities/event-kinds.js';
import { EmptyStringToNull } from '../../common/transforms/empty-to-null.js';

export class EventExceptionDto {
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date!: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  @EmptyStringToNull()
  reason?: string | null;
}

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

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(7)
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  repeatDays?: number[];

  @IsOptional()
  @ValidateIf((_dto, value) => value !== null)
  @IsIn([1, 2, 3, 4, -1])
  monthlyWeek?: number | null;

  @IsOptional()
  @ValidateIf((_dto, value) => value !== null)
  @IsInt()
  @Min(0)
  @Max(6)
  monthlyWeekday?: number | null;

  @IsOptional()
  @ValidateIf((_dto, value) => value !== null)
  @IsInt()
  @Min(1)
  @Max(31)
  monthlyDay?: number | null;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(100)
  @ValidateNested({ each: true })
  @Type(() => EventExceptionDto)
  exceptions?: EventExceptionDto[];
}
