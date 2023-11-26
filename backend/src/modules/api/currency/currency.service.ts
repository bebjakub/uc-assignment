import { Currency } from '@/modules/api/currency/entity/currency.entity';
import { CurrencyService } from '@/modules/currency/currency.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CurrencyApiService {
  constructor(private readonly currencyService: CurrencyService) {}

  async getCurrencies(): Promise<Currency[]> {
    return this.currencyService.getCurrencies();
  }
}
