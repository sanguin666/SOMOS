import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { MAX_BLOCK_ITEM_COUNT } from './create-page-block.dto.js';

// `type` is deliberately not updatable: changing it would reinterpret the
// other columns. Delete the block and add the one you wanted instead.
export class UpdatePageBlockDto {
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
