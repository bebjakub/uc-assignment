import { CurrencyStorageService } from '@/modules/storage/currency/currency.service';
import { Currency } from '@/modules/storage/currency/entity/currency.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Currency])],
  providers: [CurrencyStorageService],
  exports: [CurrencyStorageService],
})
export class CurrencyStorageModule {}
