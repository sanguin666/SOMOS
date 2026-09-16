import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { LivestreamStatus } from '../../common/enums/livestream-status.enum.js';

export class CreateLivestreamDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsUrl({ require_tld: false })
  url!: string;

  @IsDateString()
  scheduledAt!: string;

  @IsOptional()
  @IsEnum(LivestreamStatus)
  status?: LivestreamStatus;
}
