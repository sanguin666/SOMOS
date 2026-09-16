import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAnnouncementDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  // Optional: an announcement may be voice-only (see AnnouncementsService.create).
  @IsOptional()
  @IsString()
  body?: string;
}
