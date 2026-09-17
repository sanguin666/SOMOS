import { IsEnum } from 'class-validator';
import { Language } from '../enums/language.enum.js';

export class UpdateLanguageDto {
  @IsEnum(Language)
  language!: Language;
}
