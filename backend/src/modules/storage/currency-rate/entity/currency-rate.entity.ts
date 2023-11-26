import { Column, Entity, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['day', 'from', 'to'])
export class CurrencyRate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  day: Date;

  @Column()
  from: number;

  @Column()
  to: number;

  @Column({ type: 'float' })
  @Index()
  rate: number;
}
