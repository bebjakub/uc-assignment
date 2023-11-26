import { CurrencyRateSourceService } from '@/modules/currency-rate-source/currency-rate-source.service';
import { AddNewCurrencyRatesDto } from '@/modules/currency-rate/dto/add-new-currency-rates.dto';
import { AddNewCurrencyToCurrencyRatesDto } from '@/modules/currency-rate/dto/add-new-currency-to-currency-rates.dto';
import { CreateCurrencyRateDto } from '@/modules/currency-rate/dto/create-currency-rate.dto';
import { CreateDailyCurrencyRatesDto } from '@/modules/currency-rate/dto/create-daily-currency-rates.dto';
import { GetDailyCurrencyRatesDto } from '@/modules/currency-rate/dto/get-daily-currency-rates.dto';
import { CurrencyRateWithToCode } from '@/modules/currency-rate/entity/currency-rate-with-to-code.entity';
import { DailyCurrencyRates } from '@/modules/currency-rate/entity/daily-currency-rates.entity';
import { CurrencyRateQueueService } from '@/modules/currency-rate/service/currency-rate-queue.service';
import { CurrencyService } from '@/modules/currency/currency.service';
import { Currency } from '@/modules/currency/entity/currency.entity';
import { CurrencyRateStorageService } from '@/modules/storage/currency-rate/currency-rate.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import moment = require('moment');

@Injectable()
export class CurrencyRateService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly currencyRateStorage: CurrencyRateStorageService,
    private readonly currencyRateSourceService: CurrencyRateSourceService,
    private readonly currencyService: CurrencyService,
    private readonly currencyRateQueueService: CurrencyRateQueueService,
  ) {}

  async createDailyCurrencyRates({
    day,
    from,
    to,
  }: CreateDailyCurrencyRatesDto): Promise<any> {
    const rates = await this.currencyRateSourceService.getRatesByDay(day);

    const ratesCodes = Object.keys(rates);

    await this.currencyService.checkCurrencies({
      selectedCurrencyIds: [from, to],
      exchangeRateCurrencies: ratesCodes,
      day,
    });

    const currencies = await this.currencyService.getCurrencies();

    const usedCurrencies = currencies.filter(({ code }) =>
      ratesCodes.includes(code),
    );

    const dailyRates = await this.prepareCreateDailyRates(
      usedCurrencies,
      rates,
      day,
    );

    await this.currencyRateStorage.save(dailyRates);
  }

  public async addNewCurrencyRates({
    newCurrencyId,
    populatedDays,
  }: AddNewCurrencyRatesDto) {
    const daysInDatabase = await this.getDaysInDatabase();

    const databaseDays = daysInDatabase.map((day) =>
      moment(day).format('YYYY-MM-DD'),
    );

    const missingDays = databaseDays.filter(
      (day) => !populatedDays.includes(day),
    );

    if (!missingDays?.length) {
      return;
    }

    await Promise.all(
      missingDays.map(
        async (day) =>
          await this.currencyRateQueueService.addNewCurrencyToCurrencyRates({
            day,
            currencyId: newCurrencyId,
          }),
      ),
    );
  }

  async addNewCurrencyToCurrencyRates({
    day,
    currencyId,
  }: AddNewCurrencyToCurrencyRatesDto): Promise<any> {
    const currencies = await this.currencyService.getCurrencies();
    const newCurrency = currencies.find(({ id }) => id === currencyId);

    if (!newCurrency) {
      return;
    }

    const rates = await this.currencyRateSourceService.getRatesByDay(day);
    const ratesCodes = Object.keys(rates);

    const ratesCurrencies = currencies.filter(({ code }) =>
      ratesCodes.includes(code),
    );

    const dayRatesCurrencyIds = await this.getDayRatesCurrencyIds(day);

    if (!dayRatesCurrencyIds?.length) {
      return;
    }

    if (dayRatesCurrencyIds.includes(newCurrency.id)) {
      return;
    }

    const newCurrencies = ratesCurrencies.filter(
      ({ id }) => !dayRatesCurrencyIds.includes(id),
    );

    if (!newCurrencies?.length) {
      return;
    }

    const newDailyRates = await this.prepareNewCurrenciesToDailyRates(
      ratesCurrencies,
      newCurrencies,
      rates,
      day,
    );

    await this.currencyRateStorage.save(newDailyRates);
  }

  async getDailyRates({
    day,
    from,
    to,
  }: GetDailyCurrencyRatesDto): Promise<DailyCurrencyRates> {
    if (!(await this.checkDayInDatabase(day))) {
      await this.createDailyCurrencyRates({
        day,
        from,
        to,
      });

      const newCurrencyId =
        await this.cacheManager.get<number>('newCurrencyId');

      if (newCurrencyId) {
        await this.currencyRateQueueService.addNewCurrencyRates({
          newCurrencyId,
          populatedDays: [day],
        });

        await this.cacheManager.del('newCurrencyId');
      }
    }

    const currencies = await this.currencyService.getCurrencies();

    let currencyRates =
      (await this.currencyRateStorage.find({
        where: {
          from,
          day: new Date(day),
        },
      })) || [];

    const reversedCurrencyRates = await this.currencyRateStorage.find({
      where: {
        to: from,
        day: new Date(day),
      },
    });

    if (reversedCurrencyRates?.length) {
      currencyRates = [
        ...currencyRates,
        ...reversedCurrencyRates.map((item) => ({
          ...item,
          from: item.to,
          to: item.from,
          rate: this.fixRate(1 / item.rate),
        })),
      ];
    }

    let sortedCurrencyRates: CurrencyRateWithToCode[] = currencyRates.map(
      (item) => ({
        ...item,
        toCode: this.currencyService.getCurrencyCode(currencies, item.to),
      }),
    );

    sortedCurrencyRates = sortedCurrencyRates.sort((a, b) =>
      a.toCode > b.toCode ? 1 : b.toCode > a.toCode ? -1 : 0,
    );

    let rate: number;
    const other = {};
    sortedCurrencyRates.forEach((item) => {
      if (item.to === to) {
        rate = item.rate;
      } else {
        other[item.toCode] = item.rate;
      }
    });

    return {
      day,
      from: this.currencyService.getCurrencyCode(currencies, from),
      to: this.currencyService.getCurrencyCode(currencies, to),
      rate,
      other,
    };
  }

  private async getDayRatesCurrencyIds(day: string): Promise<number[]> {
    const currencyRates =
      (await this.currencyRateStorage.find({
        where: {
          from: 1,
          day: new Date(day),
        },
      })) || [];

    const reversedCurrencyRates =
      (await this.currencyRateStorage.find({
        where: {
          to: 1,
          day: new Date(day),
        },
      })) || [];

    const ids = currencyRates?.map(({ to }) => to);
    const reversedIds = reversedCurrencyRates?.map(({ from }) => from);

    const currencyIds = [...new Set([1, ...ids, ...reversedIds])];

    return currencyIds;
  }

  private async checkDayInDatabase(day: string) {
    const rates = await this.currencyRateStorage.find({
      where: {
        day: new Date(day),
      },
      take: 1,
    });

    return !!rates.length;
  }

  public async getDaysInDatabase(
    currencyFrom?: number,
    currencyTo?: number,
  ): Promise<Date[]> {
    let days: Date[];

    if (currencyFrom && currencyTo) {
      days = await this.currencyRateStorage.getDaysWithCurrency(
        currencyFrom,
        currencyTo,
      );
    } else {
      days = await this.currencyRateStorage.getDays();
    }

    const sortedDays = days.sort((a, b) => a.getTime() - b.getTime());

    return sortedDays;
  }

  private async prepareCreateDailyRates(
    currencies: Currency[],
    rates: Record<string, number>,
    dateString: string,
  ): Promise<CreateCurrencyRateDto[]> {
    const day = new Date(dateString);
    const pairs = [];
    const l = currencies.length;
    const currencyCodes = currencies.map(({ code }) => code);

    for (let i = 0; i < l; ++i) {
      const fromCode = currencyCodes[i];
      const from = this.currencyService.getCurrencyIdByCode(
        currencies,
        fromCode,
      );
      for (let j = i + 1; j < l; ++j) {
        const toCode = currencyCodes[j];
        const to = this.currencyService.getCurrencyIdByCode(currencies, toCode);
        const rate = this.fixRate(rates[toCode] / rates[fromCode]);

        pairs.push({ day, from, to, rate });
      }
    }

    return pairs;
  }

  private async prepareNewCurrenciesToDailyRates(
    currencies: Currency[],
    newCurrencies: Currency[],
    rates: Record<string, number>,
    dateString: string,
  ): Promise<CreateCurrencyRateDto[]> {
    const day = new Date(dateString);
    const pairs = [];
    const l = currencies.length;
    const currencyCodes = currencies.map(({ code }) => code);
    const newCurrenciesIds = newCurrencies.map(({ id }) => id);

    for (let i = 0; i < l; ++i) {
      const fromCode = currencyCodes[i];
      const from = this.currencyService.getCurrencyIdByCode(
        currencies,
        fromCode,
      );
      for (let j = i + 1; j < l; ++j) {
        const toCode = currencyCodes[j];
        const to = this.currencyService.getCurrencyIdByCode(currencies, toCode);

        if (
          !(newCurrenciesIds.includes(from) || newCurrenciesIds.includes(to))
        ) {
          continue;
        }

        const rate = this.fixRate(rates[toCode] / rates[fromCode]);

        pairs.push({ day, from, to, rate });
      }
    }

    return pairs;
  }

  public fixRate(rate: number) {
    return parseFloat(rate.toFixed(8));
  }
}
