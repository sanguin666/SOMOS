import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { PageBlockType } from '../../common/enums/page-block-type.enum.js';

// Upper bound on a live block's entry count. More than this and the home
// page stops being a summary — the module's own screen is one tap away.
export const MAX_BLOCK_ITEM_COUNT = 10;

export class CreatePageBlockDto {
  @IsEnum(PageBlockType)
  type!: PageBlockType;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(MAX_BLOCK_ITEM_COUNT)
  itemCount?: number;
}
