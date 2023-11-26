import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString } from 'class-validator';

export class GetDailyCurrencyRatesDto {
  @ApiProperty({ description: 'YYYY-MM-DD' })
  @IsDateString()
  @Transform(({ value }) => value.slice(0, 10))
  day: string;

  @ApiProperty({ description: 'Currency ID' })
  @Transform(({ value }) => parseInt(value))
  from: number;

  @ApiProperty({ description: 'Currency ID' })
  @Transform(({ value }) => parseInt(value))
  to: number;
}
