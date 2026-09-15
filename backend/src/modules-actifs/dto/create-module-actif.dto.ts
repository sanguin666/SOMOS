import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { TypeModule } from '../../common/enums/type-module.enum.js';
import { StatutModule } from '../../common/enums/statut-module.enum.js';

export class CreateModuleActifDto {
  @IsEnum(TypeModule)
  typeModule!: TypeModule;

  @IsOptional()
  @IsEnum(StatutModule)
  statut?: StatutModule;

  @IsOptional()
  @IsDateString()
  dateExpiration?: string;
}
