import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCommunityPostDto {
  @IsOptional()
  @IsString()
  @MaxLength(80)
  authorName?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  message!: string;
}
