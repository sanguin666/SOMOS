import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { PageBlockType } from '../../common/enums/page-block-type.enum.js';
import { EmptyStringToNull } from '../../common/transforms/empty-to-null.js';

// Upper bound on a live block's entry count. More than this and the home
// page stops being a summary — the module's own screen is one tap away.
export const MAX_BLOCK_ITEM_COUNT = 10;

export class CreatePageBlockDto {
  @IsEnum(PageBlockType)
  type!: PageBlockType;

  @IsOptional()
  @IsString()
  @EmptyStringToNull()
  title?: string | null;

  @IsOptional()
  @IsString()
  @EmptyStringToNull()
  body?: string | null;

  @IsOptional()
  @IsString()
  @EmptyStringToNull()
  imageUrl?: string | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(MAX_BLOCK_ITEM_COUNT)
  itemCount?: number;
}
