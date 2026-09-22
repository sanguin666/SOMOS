import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

/**
 * What someone can change about themselves from the app's settings menu.
 * Both names are optional: the settings screen sends only the field that
 * was edited, and an omitted field is left alone rather than cleared.
 */
export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  lastName?: string;
}
