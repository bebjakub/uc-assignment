import { CurrencyRateSourceModule } from '@/modules/currency-rate-source/currency-rate-source.module';
import { CurrencyRateProcessor } from '@/modules/currency-rate/currency-rate.processor';
import { CurrencyRateQueueService } from '@/modules/currency-rate/service/currency-rate-queue.service';
import { CurrencyRateRangeService } from '@/modules/currency-rate/service/currency-rate-range.service';
import { CurrencyRateService } from '@/modules/currency-rate/service/currency-rate.service';
import { CurrencyModule } from '@/modules/currency/currency.module';
import { CurrencyRateStorageModule } from '@/modules/storage/currency-rate/currency-rate.module';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'currencyRate',
      defaultJobOptions: {
        removeOnComplete: true,
      },
    }),
    CurrencyRateStorageModule,
    CurrencyRateSourceModule,
    CurrencyModule,
  ],
  providers: [
    CurrencyRateService,
    CurrencyRateRangeService,
    CurrencyRateQueueService,
    CurrencyRateProcessor,
  ],
  exports: [CurrencyRateService, CurrencyRateRangeService],
})
export class CurrencyRateModule {}
