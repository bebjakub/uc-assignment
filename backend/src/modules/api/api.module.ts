import { CurrencyRateApiModule } from '@/modules/api/currency-rate/currency-rate.module';
import { CurrencyApiModule } from '@/modules/api/currency/currency.module';
import { Module } from '@nestjs/common';

@Module({ imports: [CurrencyApiModule, CurrencyRateApiModule] })
export class ApiModule {}
