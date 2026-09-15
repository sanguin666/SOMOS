import { PartialType } from '@nestjs/mapped-types';
import { CreateLieuDeCulteDto } from './create-lieu-de-culte.dto.js';

export class UpdateLieuDeCulteDto extends PartialType(CreateLieuDeCulteDto) {}
