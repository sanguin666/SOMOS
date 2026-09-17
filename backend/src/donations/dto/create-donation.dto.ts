import { IsNumber, IsOptional, IsPositive, IsString, MaxLength } from 'class-validator';

export class CreateDonationDto {
  @IsNumber()
  @IsPositive()
  amount!: number;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  donorName?: string;
}
