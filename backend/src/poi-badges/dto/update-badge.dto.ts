import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateBadgeDto } from './create-badge.dto.js';

// `kind` stays as created: a message turned into "next Mass" would carry
// words nobody sees. Remove it and add the other kind instead.
export class UpdateBadgeDto extends PartialType(OmitType(CreateBadgeDto, ['kind'] as const)) {}
