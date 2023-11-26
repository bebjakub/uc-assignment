/* tslint:disable */
/* eslint-disable */
/**
 * Exchange Rates
 * Exchange Rates API proxy for https://exchangerate-api.com
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import type {
  Currency,
  DailyCurrencyRates,
  RangeCurrencyRateStats,
} from '../models/index';
import {
    CurrencyFromJSON,
    CurrencyToJSON,
    DailyCurrencyRatesFromJSON,
    DailyCurrencyRatesToJSON,
    RangeCurrencyRateStatsFromJSON,
    RangeCurrencyRateStatsToJSON,
} from '../models/index';

export interface CurrencyRateApiControllerGetDailyRatesRequest {
    day: string;
    from: number;
    to: number;
}

export interface CurrencyRateApiControllerGetRangeRatesStatsRequest {
    dayFrom: string;
    dayTo: string;
    currencyFrom: number;
    currencyTo: number;
}

/**
 * 
 */
export class DefaultApi extends runtime.BaseAPI {

    /**
     */
    async currencyApiControllerGetCurrenciesRaw(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<Currency>>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/currencies`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(CurrencyFromJSON));
    }

    /**
     */
    async currencyApiControllerGetCurrencies(initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<Currency>> {
        const response = await this.currencyApiControllerGetCurrenciesRaw(initOverrides);
        return await response.value();
    }

    /**
     */
    async currencyRateApiControllerGetDailyRatesRaw(requestParameters: CurrencyRateApiControllerGetDailyRatesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<DailyCurrencyRates>> {
        if (requestParameters.day === null || requestParameters.day === undefined) {
            throw new runtime.RequiredError('day','Required parameter requestParameters.day was null or undefined when calling currencyRateApiControllerGetDailyRates.');
        }

        if (requestParameters.from === null || requestParameters.from === undefined) {
            throw new runtime.RequiredError('from','Required parameter requestParameters.from was null or undefined when calling currencyRateApiControllerGetDailyRates.');
        }

        if (requestParameters.to === null || requestParameters.to === undefined) {
            throw new runtime.RequiredError('to','Required parameter requestParameters.to was null or undefined when calling currencyRateApiControllerGetDailyRates.');
        }

        const queryParameters: any = {};

        if (requestParameters.day !== undefined) {
            queryParameters['day'] = requestParameters.day;
        }

        if (requestParameters.from !== undefined) {
            queryParameters['from'] = requestParameters.from;
        }

        if (requestParameters.to !== undefined) {
            queryParameters['to'] = requestParameters.to;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/rates`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => DailyCurrencyRatesFromJSON(jsonValue));
    }

    /**
     */
    async currencyRateApiControllerGetDailyRates(requestParameters: CurrencyRateApiControllerGetDailyRatesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<DailyCurrencyRates> {
        const response = await this.currencyRateApiControllerGetDailyRatesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     */
    async currencyRateApiControllerGetRangeRatesStatsRaw(requestParameters: CurrencyRateApiControllerGetRangeRatesStatsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<RangeCurrencyRateStats>> {
        if (requestParameters.dayFrom === null || requestParameters.dayFrom === undefined) {
            throw new runtime.RequiredError('dayFrom','Required parameter requestParameters.dayFrom was null or undefined when calling currencyRateApiControllerGetRangeRatesStats.');
        }

        if (requestParameters.dayTo === null || requestParameters.dayTo === undefined) {
            throw new runtime.RequiredError('dayTo','Required parameter requestParameters.dayTo was null or undefined when calling currencyRateApiControllerGetRangeRatesStats.');
        }

        if (requestParameters.currencyFrom === null || requestParameters.currencyFrom === undefined) {
            throw new runtime.RequiredError('currencyFrom','Required parameter requestParameters.currencyFrom was null or undefined when calling currencyRateApiControllerGetRangeRatesStats.');
        }

        if (requestParameters.currencyTo === null || requestParameters.currencyTo === undefined) {
            throw new runtime.RequiredError('currencyTo','Required parameter requestParameters.currencyTo was null or undefined when calling currencyRateApiControllerGetRangeRatesStats.');
        }

        const queryParameters: any = {};

        if (requestParameters.dayFrom !== undefined) {
            queryParameters['dayFrom'] = requestParameters.dayFrom;
        }

        if (requestParameters.dayTo !== undefined) {
            queryParameters['dayTo'] = requestParameters.dayTo;
        }

        if (requestParameters.currencyFrom !== undefined) {
            queryParameters['currencyFrom'] = requestParameters.currencyFrom;
        }

        if (requestParameters.currencyTo !== undefined) {
            queryParameters['currencyTo'] = requestParameters.currencyTo;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/rates/range-stats`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => RangeCurrencyRateStatsFromJSON(jsonValue));
    }

    /**
     */
    async currencyRateApiControllerGetRangeRatesStats(requestParameters: CurrencyRateApiControllerGetRangeRatesStatsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<RangeCurrencyRateStats> {
        const response = await this.currencyRateApiControllerGetRangeRatesStatsRaw(requestParameters, initOverrides);
        return await response.value();
    }

}