import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateLieuDeCulteDto {
  @IsString()
  @IsNotEmpty()
  nom!: string;

  @IsOptional()
  @IsString()
  adresse?: string;

  @IsOptional()
  @IsString()
  ville?: string;

  @IsOptional()
  @IsString()
  codePostal?: string;
}
