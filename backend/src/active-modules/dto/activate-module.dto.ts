import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { ModuleType } from '../../common/enums/module-type.enum.js';
import { ModuleStatus } from '../../common/enums/module-status.enum.js';

export class ActivateModuleDto {
  @IsEnum(ModuleType)
  moduleType!: ModuleType;

  @IsOptional()
  @IsEnum(ModuleStatus)
  status?: ModuleStatus;

  @IsOptional()
  @IsDateString()
  expirationDate?: string;
}
