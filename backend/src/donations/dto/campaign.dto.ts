import { PartialType } from '@nestjs/mapped-types';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { EmptyStringToNull } from '../../common/transforms/empty-to-null.js';

export class CreateCampaignDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @EmptyStringToNull()
  description?: string | null;

  @IsOptional()
  @ValidateIf((_dto, value) => value !== null)
  @IsNumber()
  @IsPositive()
  goalAmount?: number | null;

  @IsOptional()
  @ValidateIf((_dto, value) => value !== null)
  @IsDateString()
  @EmptyStringToNull()
  endsAt?: string | null;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class UpdateCampaignDto extends PartialType(CreateCampaignDto) {}
