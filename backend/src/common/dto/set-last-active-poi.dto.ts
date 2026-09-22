import { IsUUID } from 'class-validator';

export class SetLastActivePoiDto {
  @IsUUID()
  poiId!: string;
}
