import { ApiProperty } from '@nestjs/swagger';

export class DailyCurrencyRates {
  @ApiProperty({ description: 'YYYY-MM-DD' })
  day: string;

  @ApiProperty({ description: 'Currency Code' })
  from: string;

  @ApiProperty({ description: 'Currency Code' })
  to: string;

  @ApiProperty({ description: 'Exchange Rate' })
  rate: number;

  @ApiProperty({ description: 'Other Exchange Rates' })
  other: Record<string, number>;
}
