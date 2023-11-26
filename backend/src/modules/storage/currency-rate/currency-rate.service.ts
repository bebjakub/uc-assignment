import { CurrencyRate } from '@/modules/storage/currency-rate/entity/currency-rate.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class CurrencyRateStorageService {
  constructor(
    @InjectRepository(CurrencyRate)
    private ratesRepository: Repository<CurrencyRate>,
  ) {}

  async find(options?: FindManyOptions<CurrencyRate>): Promise<CurrencyRate[]> {
    return await this.ratesRepository.find(options);
  }

  async getDays(): Promise<Date[]> {
    const daysData = await this.ratesRepository
      .createQueryBuilder('rate')
      .select('day')
      .distinct(true)
      .getRawMany();

    return daysData.map(({ day }) => day);
  }

  async getDaysWithCurrency(
    currencyFrom: number,
    currencyTo: number,
  ): Promise<Date[]> {
    const daysData = await this.ratesRepository
      .createQueryBuilder('rate')
      .select('day')
      .where(
        '(rate.from = :currencyFrom AND rate.to = :currencyTo) OR (rate.from = :currencyTo AND rate.to = :currencyFrom)',
        { currencyFrom, currencyTo },
      )
      .distinct(true)
      .getRawMany();

    return daysData.map(({ day }) => day);
  }

  async save(rates: DeepPartial<CurrencyRate>[]): Promise<CurrencyRate[]> {
    const rateEntities = this.ratesRepository.create(rates);

    await this.ratesRepository.insert(rateEntities);

    return rateEntities;
  }
}
