import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PoiType } from '../../common/enums/poi-type.enum.js';

export class CreatePoiDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsEnum(PoiType)
  type?: PoiType;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  postalCode?: string;
}
