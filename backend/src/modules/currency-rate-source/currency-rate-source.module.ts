import { AppConfigModule } from '@/modules/appConfig/appConfig.module';
import { CurrencyRateSourceService } from '@/modules/currency-rate-source/currency-rate-source.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [AppConfigModule],
  providers: [CurrencyRateSourceService],
  exports: [CurrencyRateSourceService],
})
export class CurrencyRateSourceModule {}
