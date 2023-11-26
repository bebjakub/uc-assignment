import { atom, useRecoilState } from 'recoil';
import { Currency } from '../api/openapi';

export const currenciesState = atom({
  key: 'currencies',
  default: [] as Currency[],
});

export const useCurrencies = () => useRecoilState(currenciesState);
