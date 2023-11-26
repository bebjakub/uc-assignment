import { CurrencyRateService } from '@/modules/currency-rate/service/currency-rate.service';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('currencyRate')
export class CurrencyRateProcessor {
  constructor(private readonly currencyRateService: CurrencyRateService) {}

  @Process('addNewCurrencyRates')
  async handleAddNewCurrencyRates({ data }: Job) {
    await this.currencyRateService.addNewCurrencyRates(data);
  }

  @Process('addNewCurrencyToCurrencyRates')
  async handleAddNewCurrencyToCurrencyRates({ data }: Job) {
    await this.currencyRateService.addNewCurrencyToCurrencyRates(data);
  }
}
