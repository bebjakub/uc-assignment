import { CurrencyRateSourceModule } from '@/modules/currency-rate-source/currency-rate-source.module';
import { CurrencyService } from '@/modules/currency/currency.service';
import { CurrencyStorageModule } from '@/modules/storage/currency/currency.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [CurrencyStorageModule, CurrencyRateSourceModule],
  providers: [CurrencyService],
  exports: [CurrencyService],
})
export class CurrencyModule {}
