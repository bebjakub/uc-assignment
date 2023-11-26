import { Currency } from '@/modules/storage/currency/entity/currency.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class CurrencyStorageService {
  constructor(
    @InjectRepository(Currency)
    private currencyRepository: Repository<Currency>,
  ) {}

  async findAll(): Promise<Currency[]> {
    return await this.currencyRepository.find();
  }

  async save(currencies: DeepPartial<Currency>[]): Promise<Currency[]> {
    const currencyEntities = this.currencyRepository.create(currencies);

    await this.currencyRepository.insert(currencyEntities);

    return currencyEntities;
  }
}
