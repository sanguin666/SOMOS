import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
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

  // The app's compose screen posts multipart, where a boolean arrives as
  // the string "true"; the admin posts JSON.
  @IsOptional()
  @Transform(({ value }) => (value === undefined ? undefined : value === true || value === 'true'))
  @IsBoolean()
  important?: boolean;
}
