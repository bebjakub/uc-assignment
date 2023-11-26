import { AddNewCurrencyRatesDto } from '@/modules/currency-rate/dto/add-new-currency-rates.dto';
import { AddNewCurrencyToCurrencyRatesDto } from '@/modules/currency-rate/dto/add-new-currency-to-currency-rates.dto';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class CurrencyRateQueueService {
  constructor(
    @InjectQueue('currencyRate') private readonly currencyRateQueue: Queue,
  ) {}

  async addNewCurrencyRates(data: AddNewCurrencyRatesDto) {
    return await this.currencyRateQueue.add('addNewCurrencyRates', data);
  }

  async addNewCurrencyToCurrencyRates(data: AddNewCurrencyToCurrencyRatesDto) {
    return await this.currencyRateQueue.add(
      'addNewCurrencyToCurrencyRates',
      data,
    );
  }
}
