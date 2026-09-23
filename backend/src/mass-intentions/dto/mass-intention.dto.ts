import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';
import { EmptyStringToNull } from '../../common/transforms/empty-to-null.js';
import { MassIntentionStatus } from '../entities/mass-intention.entity.js';

export class CreateMassIntentionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  intention!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  requesterName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  @EmptyStringToNull()
  requesterContact?: string | null;

  // Left out for "whenever the community can".
  @IsOptional()
  @ValidateIf((_dto, value) => value !== null)
  @IsDateString()
  celebrationAt?: string | null;

  @IsOptional()
  @ValidateIf((_dto, value) => value !== null)
  @IsUUID()
  eventId?: string | null;

  // Only looked at where the community has not set an offering: then the
  // person chooses, and 0 means none.
  @IsOptional()
  @IsNumber()
  @Min(0)
  offeringAmount?: number;
}

/** Written in at the office, for someone who asked at the desk. */
export class CreateOfficeMassIntentionDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  intention!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  requesterName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  @EmptyStringToNull()
  requesterContact?: string | null;

  @IsOptional()
  @ValidateIf((_dto, value) => value !== null)
  @IsDateString()
  celebrationAt?: string | null;

  @IsOptional()
  @ValidateIf((_dto, value) => value !== null)
  @IsString()
  @MaxLength(120)
  @EmptyStringToNull()
  celebrationTitle?: string | null;

  @IsOptional()
  @ValidateIf((_dto, value) => value !== null)
  @IsNumber()
  @Min(0)
  offeringAmount?: number | null;
}

export class UpdateMassIntentionDto {
  @IsOptional()
  @IsEnum(MassIntentionStatus)
  status?: MassIntentionStatus;

  // Moving an intention to another Mass.
  @IsOptional()
  @ValidateIf((_dto, value) => value !== null)
  @IsDateString()
  celebrationAt?: string | null;

  @IsOptional()
  @ValidateIf((_dto, value) => value !== null)
  @IsString()
  @MaxLength(120)
  @EmptyStringToNull()
  celebrationTitle?: string | null;
}

export class UpdateMassIntentionSettingsDto {
  // null: no set offering, the person asking chooses.
  @ValidateIf((_dto, value) => value !== null)
  @IsNumber()
  @Min(0)
  offeringAmount!: number | null;
}
