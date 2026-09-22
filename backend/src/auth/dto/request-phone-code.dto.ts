import { IsString, Matches } from 'class-validator';

// Deliberately loose: people type their own number with spaces, dots,
// dashes or brackets, and an elderly audience is exactly the wrong one to
// reject over punctuation. The service normalizes it before doing anything
// with it — see normalizePhone in phone-auth.service.ts.
export const PHONE_INPUT_PATTERN = /^\+?[0-9][0-9 ().\-/]{5,24}$/;

export class RequestPhoneCodeDto {
  @IsString()
  @Matches(PHONE_INPUT_PATTERN, {
    message: 'Enter a phone number, digits only apart from an optional leading +',
  })
  phone!: string;
}
