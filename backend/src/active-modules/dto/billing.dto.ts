import { IsEnum, IsIn, Matches } from 'class-validator';
import { BillingInterval } from '../../common/enums/billing-interval.enum.js';

export class SetBillingIntervalDto {
  @IsEnum(BillingInterval)
  interval!: BillingInterval;
}

/**
 * Demo stage: only the kind and the last four figures are kept, never a
 * full IBAN or card number.
 */
export class SetPaymentMethodDto {
  @IsIn(['sepa', 'card'])
  kind!: 'sepa' | 'card';

  @Matches(/^\d{4}$/)
  last4!: string;
}
