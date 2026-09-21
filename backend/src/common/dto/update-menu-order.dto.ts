import { ArrayUnique, IsArray, IsEnum } from 'class-validator';
import { ModuleType } from '../enums/module-type.enum.js';

export class UpdateMenuOrderDto {
  @IsArray()
  @ArrayUnique()
  @IsEnum(ModuleType, { each: true })
  menuOrder!: ModuleType[];
}
