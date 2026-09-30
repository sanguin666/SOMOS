import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { EmptyStringToNull } from '../../common/transforms/empty-to-null.js';
import { READING_KINDS, type ReadingKind } from '../entities/daily-reading.entity.js';

export const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export class ReadingSectionDto {
  @IsIn(READING_KINDS)
  kind!: ReadingKind;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  @EmptyStringToNull()
  title?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  @EmptyStringToNull()
  reference?: string | null;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20000)
  text!: string;
}

export class SaveDailyReadingDto {
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  @EmptyStringToNull()
  word?: string | null;

  @IsArray()
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => ReadingSectionDto)
  sections!: ReadingSectionDto[];

  @IsBoolean()
  published!: boolean;

  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  @EmptyStringToNull()
  notifyAt?: string | null;
}

export class UpdateReadingsSettingsDto {
  // An official site for the day's readings. `{date}` becomes YYYY-MM-DD,
  // e.g. https://www.aelf.org/{date}/romain/messe
  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Matches(/^https:\/\/\S+$/)
  @EmptyStringToNull()
  linkUrl?: string | null;
}
