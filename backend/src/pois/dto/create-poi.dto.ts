import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PoiType } from '../../common/enums/poi-type.enum.js';
import { Language } from '../../common/enums/language.enum.js';

export class CreatePoiDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsEnum(PoiType)
  type?: PoiType;

  @IsOptional()
  @IsEnum(Language)
  language?: Language;

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
