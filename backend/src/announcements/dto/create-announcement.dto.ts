import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EmptyStringToNull } from '../../common/transforms/empty-to-null.js';

export class CreateAnnouncementDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  // Optional: an announcement may be voice-only (see AnnouncementsService.create).
  @IsOptional()
  @IsString()
  @EmptyStringToNull()
  body?: string | null;
}
