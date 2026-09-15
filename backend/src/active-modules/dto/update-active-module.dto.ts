import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { ModuleStatus } from '../../common/enums/module-status.enum.js';

export class UpdateActiveModuleDto {
  @IsOptional()
  @IsEnum(ModuleStatus)
  status?: ModuleStatus;

  @IsOptional()
  @IsDateString()
  expirationDate?: string;
}
