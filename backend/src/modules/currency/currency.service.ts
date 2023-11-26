import { CurrencyRateSourceService } from '@/modules/currency-rate-source/currency-rate-source.service';
import { CheckCurrenciesDto } from '@/modules/currency/dto/check-currencies.dto';
import { CreateCurrencyDto } from '@/modules/currency/dto/create-currency.dto';
import { Currency } from '@/modules/currency/entity/currency.entity';
import { CurrencyStorageService } from '@/modules/storage/currency/currency.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CurrencyService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly currencyRateSourceService: CurrencyRateSourceService,
    private readonly currencyStorageService: CurrencyStorageService,
  ) {}

  public async getCurrencies(): Promise<Currency[]> {
    let currencies = await this.cacheManager.get<Currency[]>('currencies');

    if (currencies?.length) {
      return currencies;
    }

    currencies = await this.currencyStorageService.findAll();

    if (!currencies?.length) {
      currencies = await this.createCurrencies();
    }

    await this.cacheManager.set('currencies', currencies, 3600_000);

    return currencies;
  }

  public async checkCurrencies({
    selectedCurrencyIds,
    exchangeRateCurrencies,
    day,
  }: CheckCurrenciesDto): Promise<void> {
    const currencies = await this.getCurrencies();

    const currenciesCodes = currencies.map(({ code }) => code);

    const newCurrencies = exchangeRateCurrencies.filter(
      (code) => !currenciesCodes.includes(code),
    );

    const expiredCurrencyCodes = currenciesCodes.filter(
      (code) => !exchangeRateCurrencies.includes(code),
    );

    if (newCurrencies?.length || expiredCurrencyCodes?.length) {
      await this.cacheManager.del('currencies');
    }

    if (newCurrencies?.length) {
      const currenciesData = await this.updateCurrencies(
        newCurrencies.map((code) => ({ code })),
      );

      const newCurrencyId = currenciesData
        .filter(({ code }) => newCurrencies.includes(code))
        .map(({ id }) => id)?.[0];

      if (newCurrencyId) {
        const savedNewCurrencyId =
          await this.cacheManager.get<number>('newCurrencyId');

        if (!savedNewCurrencyId) {
          await this.cacheManager.set('newCurrencyId', newCurrencyId, 3600_000);
        }
      }
    }

    if (expiredCurrencyCodes?.length) {
      const expiredCurrencies = currencies.filter(({ code }) =>
        expiredCurrencyCodes.includes(code),
      );

      const expiredCurrenciesIds = expiredCurrencies.map(({ id }) => id);

      for (const id of selectedCurrencyIds) {
        if (!expiredCurrenciesIds.includes(id)) {
          continue;
        }

        const currency = await this.getCurrencyById(id);

        throw new NotFoundException(
          `We are sorry, selected currency ${currency.code} is not available for ${day}. Please select another currency.`,
        );
      }
    }
  }

  public async getCurrencyById(currencyId: number): Promise<Currency> {
    const currencies = await this.getCurrencies();

    const currency = currencies.find(({ id }) => id === currencyId);

    if (!currency) {
      throw new NotFoundException(`Currency with id ${currencyId} not found.`);
    }

    return currency;
  }

  public getCurrencyIdByCode(
    currencies: Currency[],
    currencyCode: string,
  ): number {
    const currency = currencies.find(({ code }) => code === currencyCode);

    if (!currency) {
      throw new NotFoundException(
        `Currency with code ${currencyCode} not found.`,
      );
    }

    return currency.id;
  }

  public getCurrencyCode(currencies: Currency[], currencyId: number): string {
    const currency = currencies.find(({ id }) => id === currencyId);

    if (!currency) {
      throw new NotFoundException(`Currency with id ${currencyId} not found.`);
    }

    return currency.code;
  }

  private async createCurrencies(): Promise<Currency[]> {
    const currenciesData = await this.currencyRateSourceService.getCurrencies();

    const newCurrencies: CreateCurrencyDto[] = currenciesData.map(
      ([code, name]) => ({ code, name }),
    );

    return await this.currencyStorageService.save(newCurrencies);
  }

  private async updateCurrencies(
    newCurrencies: CreateCurrencyDto[],
  ): Promise<Currency[]> {
    const currenciesData = await this.currencyRateSourceService.getCurrencies();

    newCurrencies = newCurrencies.map((newCurrency) => {
      const currencyName =
        currenciesData.find(([code]) => code === newCurrency.code)?.[1] || null;

      return {
        ...newCurrency,
        ...(currencyName && { name: currencyName }),
      };
    });

    return await this.currencyStorageService.save(newCurrencies);
  }
}
