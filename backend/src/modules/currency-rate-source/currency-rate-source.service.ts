import { AppConfigService } from '@/modules/appConfig/service/appConfig.service';
import { ConflictException, Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class CurrencyRateSourceService {
  constructor(private readonly appConfigService: AppConfigService) {}

  private async getData(path: string): Promise<any> {
    const { data } = await axios
      .get(
        `https://v6.exchangerate-api.com/v6/${this.appConfigService.getRatesApiKey()}${path}`,
      )
      .catch((error) => {
        throw new ConflictException(error);
      });

    return data;
  }

  public async getLatestRates(): Promise<Record<string, number>> {
    return (await this.getData('/latest/USD'))?.conversion_rates || null;
  }

  public async getCurrencies(): Promise<[string, string][]> {
    return (await this.getData('/codes'))?.supported_codes || null;
  }

  public async getRatesByDay(date: string): Promise<Record<string, number>> {
    const [YEAR, MONTH, DAY] = date.slice(0, 10).split('-');

    return (
      (await this.getData(`/history/USD/${YEAR}/${MONTH}/${DAY}`))
        ?.conversion_rates || null
    );
  }
}
