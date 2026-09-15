import { IsNotEmpty, IsString } from 'class-validator';

/**
 * Joins a user to a POI using the token encoded in the QR code
 * scanned from the flyer.
 */
export class JoinPoiDto {
  @IsString()
  @IsNotEmpty()
  qrCodeToken!: string;
}
