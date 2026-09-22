import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { PHONE_INPUT_PATTERN } from './request-phone-code.dto.js';

export class VerifyPhoneCodeDto {
  @IsString()
  @Matches(PHONE_INPUT_PATTERN, {
    message: 'Enter a phone number, digits only apart from an optional leading +',
  })
  phone!: string;

  @IsString()
  @Matches(/^[0-9]{6}$/, { message: 'The code is 6 digits' })
  code!: string;

  // Sent the first time a number signs in, so the account has something to
  // show next to what that person posts. Optional: someone who skips it
  // just stays anonymous, as they are today.
  @IsOptional()
  @IsString()
  @MaxLength(80)
  firstName?: string;
}
