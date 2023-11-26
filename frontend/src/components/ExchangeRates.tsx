import { useEffect, useState } from 'react';
import { getCurrencies, getDailyRates, getRangeRatesStats } from '../api';
import {
  Currency,
  DailyCurrencyRates,
  RangeCurrencyRateStats,
} from '../api/openapi';
import CurrencyField from './CurrencyField';
import { useCurrencies } from '../state/currencies';
import { DatePickerField } from './DatePickerField';
import moment, { Moment } from 'moment';
import { Box, LinearProgress } from '@mui/material';
import { useNotification } from '../state/notification';
import { RatesResults } from './RatesResults';

export function ExchangeRates() {
  const [currencies, setCurrencies] = useCurrencies();
  const [currencyFrom, setCurrencyFrom] = useState<Currency | null>(null);
  const [currencyTo, setCurrencyTo] = useState<Currency | null>(null);
  const [dayFrom, setDayFrom] = useState<Moment | null>(null);
  const [dayTo, setDayTo] = useState<Moment | null>(null);
  const [notification, setNotification] = useNotification();
  const [dailyRates, setDailyRates] = useState<DailyCurrencyRates | null>(null);
  const [rangeStats, setRangeStats] = useState<RangeCurrencyRateStats | null>(
    null,
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const currencies = await getCurrencies();

      setCurrencies(currencies);
    })();
  }, [setCurrencies]);

  useEffect(() => {
    (async () => {
      if (currencyFrom && currencyTo && dayFrom) {
        const tomorrow = moment().add(1, 'day').hours(11);
        if (dayFrom.isAfter(tomorrow) || dayTo?.isAfter(tomorrow)) {
          setNotification({
            type: 'error',
            message: 'To Date should be before tomorrow',
          });

          return;
        }

        setLoading(true);
        const dailyRatesResponse = await getDailyRates({
          from: currencyFrom.id,
          to: currencyTo.id,
          day: dayFrom.toISOString(),
        }).catch((error) => {
          setNotification({
            type: 'error',
            message: error.message,
          });

          return;
        });

        setDailyRates(dailyRatesResponse || null);
        setLoading(false);

        if (dayTo) {
          if (dayTo > dayFrom) {
            setLoading(true);
            const rangeStatsResponse = await getRangeRatesStats({
              currencyFrom: currencyFrom.id,
              currencyTo: currencyTo.id,
              dayFrom: dayFrom.toISOString(),
              dayTo: dayTo.toISOString(),
            }).catch((error) => {
              setNotification({
                type: 'error',
                message: error.message,
              });
            });

            setRangeStats(rangeStatsResponse || null);
            setLoading(false);
          } else {
            setNotification({
              type: 'error',
              message: 'To Date should be after From Date',
            });
          }
        } else {
          setRangeStats(null);
        }
      } else {
        setDailyRates(null);
        setRangeStats(null);
      }
    })();
  }, [currencyFrom, currencyTo, dayFrom, dayTo, setNotification]);

  return (
    <div>
      <h1>Exchange Rates</h1>
      <Box className="row">
        <CurrencyField
          label="From Currency"
          currencies={currencies?.filter((c) => c.id !== currencyTo?.id)}
          setCurrency={setCurrencyFrom}
        />
        <CurrencyField
          label="To Currency"
          currencies={currencies?.filter((c) => c.id !== currencyFrom?.id)}
          setCurrency={setCurrencyTo}
        />
      </Box>
      <Box className="row">
        <DatePickerField
          label="From Date"
          value={dayFrom}
          setValue={setDayFrom}
        />
        <DatePickerField label="To Date" value={dayTo} setValue={setDayTo} />
      </Box>

      <Box sx={{ width: '100%', height: '1rem', padding: '0 0.6rem' }}>
        {loading && <LinearProgress />}
      </Box>

      <RatesResults dailyRates={dailyRates} rangeStats={rangeStats} />
    </div>
  );
}
