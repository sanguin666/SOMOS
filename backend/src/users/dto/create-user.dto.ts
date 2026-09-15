import { IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @IsPhoneNumber()
  telephone!: string;

  @IsOptional()
  @IsString()
  prenom?: string;

  @IsOptional()
  @IsString()
  nom?: string;
}
