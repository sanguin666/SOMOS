import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreatePrayerRequestDto {
  @IsOptional()
  @IsString()
  @MaxLength(80)
  authorName?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  message!: string;
}
