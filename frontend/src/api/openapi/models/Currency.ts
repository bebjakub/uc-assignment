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

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface Currency
 */
export interface Currency {
    /**
     * Currency ID
     * @type {number}
     * @memberof Currency
     */
    id: number;
    /**
     * Currency Code
     * @type {string}
     * @memberof Currency
     */
    code: string;
    /**
     * 
     * @type {string}
     * @memberof Currency
     */
    name: string;
}

/**
 * Check if a given object implements the Currency interface.
 */
export function instanceOfCurrency(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "id" in value;
    isInstance = isInstance && "code" in value;
    isInstance = isInstance && "name" in value;

    return isInstance;
}

export function CurrencyFromJSON(json: any): Currency {
    return CurrencyFromJSONTyped(json, false);
}

export function CurrencyFromJSONTyped(json: any, ignoreDiscriminator: boolean): Currency {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'code': json['code'],
        'name': json['name'],
    };
}

export function CurrencyToJSON(value?: Currency | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'code': value.code,
        'name': value.name,
    };
}

