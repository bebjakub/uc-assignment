import { ApiProperty } from '@nestjs/swagger';

export class Currency {
  @ApiProperty({ description: 'Currency ID' })
  id: number;

  @ApiProperty({ description: 'Currency Code' })
  code: string;

  @ApiProperty()
  name?: string;
}
