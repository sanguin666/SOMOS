import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EmptyStringToNull } from '../../common/transforms/empty-to-null.js';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsDateString()
  startsAt!: string;

  @IsOptional()
  @IsString()
  @EmptyStringToNull()
  location?: string | null;

  @IsOptional()
  @IsString()
  @EmptyStringToNull()
  description?: string | null;
}
