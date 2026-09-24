import { IsBoolean, IsEnum, IsISO8601, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { BadgeKind } from '../../common/enums/badge-kind.enum.js';
import { ModuleType } from '../../common/enums/module-type.enum.js';
import { MAX_BADGE_TEXT } from '../entities/poi-badge.entity.js';
import { EmptyStringToNull } from '../../common/transforms/empty-to-null.js';

export class CreateBadgeDto {
  @IsEnum(BadgeKind)
  kind!: BadgeKind;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsString()
  @EmptyStringToNull()
  @MaxLength(MAX_BADGE_TEXT)
  text?: string | null;

  @IsOptional()
  @IsBoolean()
  important?: boolean;

  @IsOptional()
  @EmptyStringToNull()
  @IsEnum(ModuleType)
  linkModule?: ModuleType | null;

  @IsOptional()
  @EmptyStringToNull()
  @IsUUID()
  campaignId?: string | null;

  @IsOptional()
  @EmptyStringToNull()
  @IsISO8601({ strict: true })
  showUntil?: string | null;
}
