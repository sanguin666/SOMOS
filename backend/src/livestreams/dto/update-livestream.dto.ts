import { PartialType } from '@nestjs/mapped-types';
import { CreateLivestreamDto } from './create-livestream.dto.js';

export class UpdateLivestreamDto extends PartialType(CreateLivestreamDto) {}
