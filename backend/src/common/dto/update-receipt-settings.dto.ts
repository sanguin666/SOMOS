import { IsOptional, IsString, MaxLength } from 'class-validator';
import { EmptyStringToNull } from '../transforms/empty-to-null.js';

/** Who issues the place's tax receipts — see Poi.legalName. */
export class UpdateReceiptSettingsDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  @EmptyStringToNull()
  legalName?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  @EmptyStringToNull()
  legalTaxId?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(400)
  @EmptyStringToNull()
  legalAddress?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  @EmptyStringToNull()
  receiptSignatory?: string | null;
}
