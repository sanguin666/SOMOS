import { IsOptional, IsString } from 'class-validator';

export class UpdatePoiProfileDto {
  @IsOptional()
  @IsString()
  description?: string;

  // Not strictly URL-validated — admins may clear it back to empty, and a
  // loose check is friendlier than rejecting an otherwise-valid image link.
  @IsOptional()
  @IsString()
  pictureUrl?: string;

  @IsOptional()
  @IsString()
  qrFlyerHeadline?: string;

  @IsOptional()
  @IsString()
  qrFlyerSubtext?: string;
}
