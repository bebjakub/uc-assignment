import {
  Configuration,
  Currency,
  CurrencyRateApiControllerGetDailyRatesRequest,
  CurrencyRateApiControllerGetRangeRatesStatsRequest,
  DefaultApi,
  Middleware,
  ResponseContext,
} from './openapi';

class ErrorsMiddleware implements Middleware {
  public async post?(context: ResponseContext): Promise<Response | void> {
    if (context.response.status > 299) {
      const body = await context.response.json();

      throw new Error(body.message);
    }
  }
}

const configuration = new Configuration({
  basePath: 'http://localhost:3000',
  middleware: [new ErrorsMiddleware()],
});

const api = new DefaultApi(configuration);

export async function getCurrencies(): Promise<Currency[]> {
  return await api.currencyApiControllerGetCurrencies();
}

export async function getDailyRates(
  input: CurrencyRateApiControllerGetDailyRatesRequest,
) {
  return await api.currencyRateApiControllerGetDailyRates(input);
}

export async function getRangeRatesStats(
  input: CurrencyRateApiControllerGetRangeRatesStatsRequest,
) {
  return await api.currencyRateApiControllerGetRangeRatesStats(input);
}
