import { Currency } from '@/modules/api/currency/entity/currency.entity';
import { CurrencyApiService } from '@/modules/api/currency/currency.service';
import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('currencies')
export class CurrencyApiController {
  constructor(private readonly currencyService: CurrencyApiService) {}

  @ApiOkResponse({
    description: 'List of currencies',
    type: Currency,
    isArray: true,
  })
  @Get()
  async getCurrencies(): Promise<Currency[]> {
    return await this.currencyService.getCurrencies();
  }
}
