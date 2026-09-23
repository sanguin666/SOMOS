import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { EmptyStringToNull } from '../../common/transforms/empty-to-null.js';
import { ServiceRequestStatus, ServiceRequestType } from '../entities/service-request.entity.js';

export class CreateServiceRequestDto {
  @IsEnum(ServiceRequestType)
  type!: ServiceRequestType;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  contactName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  @EmptyStringToNull()
  contactPhone?: string | null;

  @IsString()
  @IsNotEmpty()
  @MaxLength(4000)
  details!: string;

  @IsOptional()
  @ValidateIf((_dto, value) => value !== null)
  @IsString()
  @MaxLength(120)
  @EmptyStringToNull()
  preferredDate?: string | null;
}

/** What staff change on a request from the dashboard. */
export class UpdateServiceRequestDto {
  @IsOptional()
  @IsEnum(ServiceRequestStatus)
  status?: ServiceRequestStatus;

  // null takes the appointment off again.
  @IsOptional()
  @ValidateIf((_dto, value) => value !== null)
  @IsDateString()
  @EmptyStringToNull()
  appointmentAt?: string | null;

  @IsOptional()
  @ValidateIf((_dto, value) => value !== null)
  @IsString()
  @MaxLength(200)
  @EmptyStringToNull()
  appointmentPlace?: string | null;
}

/** Sent as multipart form data, with an optional `file` part beside it. */
export class CreateServiceRequestMessageDto {
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  @EmptyStringToNull()
  body?: string | null;
}

export class CreateServiceRequestDocumentDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(160)
  label!: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  @EmptyStringToNull()
  note?: string | null;
}

export class UpdateServiceRequestDocumentDto {
  // Staff ticking a paper off because it was handed in at the office, or
  // un-ticking one that turned out to be the wrong paper.
  @IsBoolean()
  received!: boolean;
}
