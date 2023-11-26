import { CurrencyRateApiService } from '@/modules/api/currency-rate/currency-rate.service';
import { GetDailyCurrencyRatesDto } from '@/modules/api/currency-rate/dto/get-daily-currency-rates.dto';
import { GetRangeCurrencyRatesDto } from '@/modules/api/currency-rate/dto/get-range-currency-rates.dto';
import { DailyCurrencyRates } from '@/modules/api/currency-rate/entity/daily-currency-rates.entity';
import { RangeCurrencyRateStats } from '@/modules/api/currency-rate/entity/range-currency-rate-stats.entity';
import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('rates')
export class CurrencyRateApiController {
  constructor(private readonly currencyRateService: CurrencyRateApiService) {}

  @ApiOkResponse({
    description: 'Daily currency rates',
    type: DailyCurrencyRates,
  })
  @Get()
  async getDailyRates(
    @Query() query: GetDailyCurrencyRatesDto,
  ): Promise<DailyCurrencyRates> {
    return await this.currencyRateService.getDailyRates(query);
  }

  @ApiOkResponse({
    description: 'Min and max exchange rates between two dates',
    type: RangeCurrencyRateStats,
  })
  @Get('range-stats')
  async getRangeRatesStats(
    @Query() query: GetRangeCurrencyRatesDto,
  ): Promise<RangeCurrencyRateStats> {
    return await this.currencyRateService.getRangeRatesStats(query);
  }
}
