import { GetDailyCurrencyRatesDto } from '@/modules/api/currency-rate/dto/get-daily-currency-rates.dto';
import { GetRangeCurrencyRatesDto } from '@/modules/api/currency-rate/dto/get-range-currency-rates.dto';
import { DailyCurrencyRates } from '@/modules/api/currency-rate/entity/daily-currency-rates.entity';
import { RangeCurrencyRateStats } from '@/modules/api/currency-rate/entity/range-currency-rate-stats.entity';
import { CurrencyRateRangeService } from '@/modules/currency-rate/service/currency-rate-range.service';
import { CurrencyRateService } from '@/modules/currency-rate/service/currency-rate.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CurrencyRateApiService {
  constructor(
    private readonly currencyRateService: CurrencyRateService,
    private readonly currencyRateRangeService: CurrencyRateRangeService,
  ) {}

  async getDailyRates(
    query: GetDailyCurrencyRatesDto,
  ): Promise<DailyCurrencyRates> {
    return this.currencyRateService.getDailyRates(query);
  }

  async getRangeRatesStats(
    query: GetRangeCurrencyRatesDto,
  ): Promise<RangeCurrencyRateStats> {
    return await this.currencyRateRangeService.getRangeRatesStats(query);
  }
}
