import { CurrencyApiController } from '@/modules/api/currency/currency.controller';
import { CurrencyApiService } from '@/modules/api/currency/currency.service';
import { CurrencyModule } from '@/modules/currency/currency.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [CurrencyModule],
  controllers: [CurrencyApiController],
  providers: [CurrencyApiService],
})
export class CurrencyApiModule {}
