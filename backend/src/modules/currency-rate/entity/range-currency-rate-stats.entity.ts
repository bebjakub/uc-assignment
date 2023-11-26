export class RangeCurrencyRateStats {
  dayFrom: string;
  dayTo: string;
  currencyFrom: string;
  currencyTo: string;
  minRate: RateStats;
  maxRate: RateStats;
}

export class RateStats {
  day: string;
  rate: number;
}
