import { CurrencyRate } from '@/modules/currency-rate/entity/currency-rate.entity';

export class CurrencyRateWithToCode extends CurrencyRate {
  toCode: string;
}
