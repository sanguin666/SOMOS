import { ArrayNotEmpty, IsArray, IsUUID } from 'class-validator';

export class ReorderBadgesDto {
  // Every badge of the place, in the order they should appear.
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  ids!: string[];
}
