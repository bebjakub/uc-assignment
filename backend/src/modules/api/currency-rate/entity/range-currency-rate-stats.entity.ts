import { ApiProperty } from '@nestjs/swagger';

export class RateStats {
  @ApiProperty({ description: 'YYYY-MM-DD' })
  day: string;

  @ApiProperty({ description: 'Exchange Rate' })
  rate: number;
}

export class RangeCurrencyRateStats {
  @ApiProperty({ description: 'YYYY-MM-DD' })
  dayFrom: string;

  @ApiProperty({ description: 'YYYY-MM-DD' })
  dayTo: string;

  @ApiProperty({ description: 'Currency Code' })
  currencyFrom: string;

  @ApiProperty({ description: 'Currency Code' })
  currencyTo: string;

  @ApiProperty({ description: 'Min Exchange Rate Data' })
  minRate: RateStats;

  @ApiProperty({ description: 'Max Exchange Rate Data' })
  maxRate: RateStats;
}
