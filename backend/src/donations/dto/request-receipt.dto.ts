import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { EmptyStringToNull } from '../../common/transforms/empty-to-null.js';

/** What a tax receipt needs, asked after the gift by a giver who wants one. */
export class RequestReceiptDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  donorName!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  donorAddress!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  donorPostalCode!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  donorCity!: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @EmptyStringToNull()
  donorTaxId?: string | null;
}
