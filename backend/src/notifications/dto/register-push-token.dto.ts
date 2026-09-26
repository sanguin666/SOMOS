import { IsEnum, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { Language } from '../../common/enums/language.enum.js';

export class RegisterPushTokenDto {
  // Expo tokens look like ExponentPushToken[xxxxxxxx] (older ones
  // ExpoPushToken[...]). Anything else is not something Expo can deliver to.
  @IsString()
  @MaxLength(200)
  @Matches(/^Expo(nent)?PushToken\[[^\]]+\]$/)
  token!: string;

  @IsOptional()
  @IsEnum(Language)
  language?: Language;

  // An IANA name such as Europe/Madrid, used to write event times.
  @IsOptional()
  @IsString()
  @MaxLength(64)
  timeZone?: string;
}
