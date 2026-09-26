import { IsString, Matches, MaxLength } from 'class-validator';

export class RegisterPushTokenDto {
  // Expo tokens look like ExponentPushToken[xxxxxxxx] (older ones
  // ExpoPushToken[...]). Anything else is not something Expo can deliver to.
  @IsString()
  @MaxLength(200)
  @Matches(/^Expo(nent)?PushToken\[[^\]]+\]$/)
  token!: string;
}
