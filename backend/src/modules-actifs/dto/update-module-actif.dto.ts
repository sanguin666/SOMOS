import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { StatutModule } from '../../common/enums/statut-module.enum.js';

export class UpdateModuleActifDto {
  @IsOptional()
  @IsEnum(StatutModule)
  statut?: StatutModule;

  @IsOptional()
  @IsDateString()
  dateExpiration?: string;
}
