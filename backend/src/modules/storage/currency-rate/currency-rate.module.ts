import { CurrencyRateStorageService } from '@/modules/storage/currency-rate/currency-rate.service';
import { CurrencyRate } from '@/modules/storage/currency-rate/entity/currency-rate.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CurrencyRate])],
  providers: [CurrencyRateStorageService],
  exports: [CurrencyRateStorageService],
})
export class CurrencyRateStorageModule {}
