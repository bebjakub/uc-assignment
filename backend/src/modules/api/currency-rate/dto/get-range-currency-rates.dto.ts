import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString } from 'class-validator';

export class GetRangeCurrencyRatesDto {
  @ApiProperty({ description: 'YYYY-MM-DD' })
  @IsDateString()
  @Transform(({ value }) => value.slice(0, 10))
  dayFrom: string;

  @ApiProperty({ description: 'YYYY-MM-DD' })
  @IsDateString()
  @Transform(({ value }) => value.slice(0, 10))
  dayTo: string;

  @ApiProperty({ description: 'Currency ID' })
  @Transform(({ value }) => parseInt(value))
  currencyFrom: number;

  @ApiProperty({ description: 'Currency ID' })
  @Transform(({ value }) => parseInt(value))
  currencyTo: number;
}
