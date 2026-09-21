import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

export class ReorderPageBlocksDto {
  // Every block of the POI, in the order they should appear.
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  ids!: string[];
}
