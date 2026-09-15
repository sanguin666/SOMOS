import { PartialType } from '@nestjs/mapped-types';
import { CreatePoiDto } from './create-poi.dto.js';

export class UpdatePoiDto extends PartialType(CreatePoiDto) {}
