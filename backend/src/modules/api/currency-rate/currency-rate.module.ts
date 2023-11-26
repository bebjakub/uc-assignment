import { CurrencyRateApiController } from '@/modules/api/currency-rate/currency-rate.controller';
import { CurrencyRateApiService } from '@/modules/api/currency-rate/currency-rate.service';
import { CurrencyRateModule } from '@/modules/currency-rate/currency-rate.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [CurrencyRateModule],
  controllers: [CurrencyRateApiController],
  providers: [CurrencyRateApiService],
})
export class CurrencyRateApiModule {}
