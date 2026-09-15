import { IsNotEmpty, IsString } from 'class-validator';

/**
 * Rattachement d'un utilisateur à un lieu de culte via le jeton
 * encodé dans le QR code scanné sur le flyer.
 */
export class RattacherLieuDeCulteDto {
  @IsString()
  @IsNotEmpty()
  qrCodeToken!: string;
}
