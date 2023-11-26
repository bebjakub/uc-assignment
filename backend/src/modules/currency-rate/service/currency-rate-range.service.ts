import { GetRangeCurrencyRatesDto } from '@/modules/currency-rate/dto/get-range-currency-rates.dto';
import { RangeCurrencyRateStats } from '@/modules/currency-rate/entity/range-currency-rate-stats.entity';
import { CurrencyRateQueueService } from '@/modules/currency-rate/service/currency-rate-queue.service';
import { CurrencyRateService } from '@/modules/currency-rate/service/currency-rate.service';
import { CurrencyService } from '@/modules/currency/currency.service';
import { CurrencyRateStorageService } from '@/modules/storage/currency-rate/currency-rate.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import moment = require('moment');
import { Between } from 'typeorm';

@Injectable()
export class CurrencyRateRangeService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly currencyRateService: CurrencyRateService,
    private readonly currencyRateStorageService: CurrencyRateStorageService,
    private readonly currencyService: CurrencyService,
    private readonly currencyRateQueueService: CurrencyRateQueueService,
  ) {}

  async getRangeRatesStats({
    dayFrom,
    dayTo,
    currencyFrom,
    currencyTo,
  }: GetRangeCurrencyRatesDto): Promise<RangeCurrencyRateStats> {
    const daysInDatabase = await this.currencyRateService.getDaysInDatabase(
      currencyFrom,
      currencyTo,
    );

    const days = this.getDaysBetween(dayFrom, dayTo);
    const databaseDays = daysInDatabase.map((day) =>
      moment(day).format('YYYY-MM-DD'),
    );

    const missingDays = days.filter((day) => !databaseDays.includes(day));

    if (missingDays.length > 0) {
      await Promise.all(
        missingDays.map(
          async (day) =>
            await this.currencyRateService.createDailyCurrencyRates({
              day,
              from: currencyFrom,
              to: currencyTo,
            }),
        ),
      );
    }

    const newCurrencyId = await this.cacheManager.get<number>('newCurrencyId');

    if (newCurrencyId) {
      await this.currencyRateQueueService.addNewCurrencyRates({
        newCurrencyId,
        populatedDays: missingDays,
      });

      await this.cacheManager.del('newCurrencyId');
    }

    const minRates = await Promise.all([
      await this.getRangeLimit(dayFrom, dayTo, currencyFrom, currencyTo, 'ASC'),
      await this.getRangeLimit(
        dayFrom,
        dayTo,
        currencyTo,
        currencyFrom,
        'DESC',
        true,
      ),
    ]);

    const maxRates = await Promise.all([
      await this.getRangeLimit(
        dayFrom,
        dayTo,
        currencyFrom,
        currencyTo,
        'DESC',
      ),
      await this.getRangeLimit(
        dayFrom,
        dayTo,
        currencyTo,
        currencyFrom,
        'ASC',
        true,
      ),
    ]);

    const minRate = minRates
      ?.filter((i) => i?.rate)
      ?.sort((a, b) => a.rate - b.rate)?.[0];

    const maxRate = maxRates
      ?.filter((i) => i?.rate)
      ?.sort((a, b) => b.rate - a.rate)?.[0];

    const currencies = await this.currencyService.getCurrencies();

    const stats = {
      dayFrom,
      dayTo,
      currencyFrom: this.currencyService.getCurrencyCode(
        currencies,
        currencyFrom,
      ),
      currencyTo: this.currencyService.getCurrencyCode(currencies, currencyTo),
      minRate,
      maxRate,
    };

    return stats;
  }

  private async getRangeLimit(
    dayFrom: string,
    dayTo: string,
    from: number,
    to: number,
    order: 'ASC' | 'DESC',
    reverse: boolean = false,
  ): Promise<{ rate: number; day: string } | null> {
    const data = await this.currencyRateStorageService.find({
      where: {
        from,
        to,
        day: Between(new Date(dayFrom), new Date(dayTo)),
      },
      order: {
        rate: order,
      },
      select: ['rate', 'day'],
      take: 1,
    });

    if (data.length === 0) {
      return null;
    }

    return {
      rate: reverse
        ? this.currencyRateService.fixRate(1 / data[0].rate)
        : data[0].rate,
      day: moment(data[0].day).format('YYYY-MM-DD'),
    };
  }

  private getDaysBetween(dayFrom: string, dayTo: string): string[] {
    const dates = [];

    const fromDate = moment(dayFrom).subtract(1, 'day').startOf('day');
    const toDate = moment(dayTo).startOf('day');

    while (fromDate.add(1, 'day').diff(toDate) <= 0) {
      dates.push(fromDate.clone().format('YYYY-MM-DD'));
    }

    return dates;
  }
}
