import {
  Box,
  Chip,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import { DailyCurrencyRates, RangeCurrencyRateStats } from '../api/openapi';
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
import moment from 'moment';

interface Props {
  dailyRates: DailyCurrencyRates | null;
  rangeStats: RangeCurrencyRateStats | null;
}

export function RatesResults({ dailyRates, rangeStats }: Props) {
  if (!dailyRates) {
    return null;
  }

  return (
    <>
      <Typography mt={4}>
        {moment(dailyRates.day).format('DD.MM.YYYY')}
      </Typography>
      <Typography variant="h4" mb={4}>
        {dailyRates?.rate}
      </Typography>
      {rangeStats && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            columnGap: '1rem',
            rowGap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <Chip
            icon={<SouthIcon />}
            label={`${rangeStats.minRate.rate} (${moment(
              rangeStats.minRate.day,
            ).format('DD.MM.YYYY')})`}
            color="error"
            variant="outlined"
          />
          <Chip
            icon={<NorthIcon />}
            label={`${rangeStats.maxRate.rate} (${moment(
              rangeStats.maxRate.day,
            ).format('DD.MM.YYYY')})`}
            color="success"
            variant="outlined"
          />
        </Box>
      )}

      {dailyRates?.other && (
        <List
          sx={{
            margin: '2rem auto',
            maxWidth: '30rem',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '5px',
          }}
        >
          {Object.keys(dailyRates.other).map((countryCode: string) => (
            <ListItem key={countryCode}>
              <ListItemText
                primary={countryCode}
                secondary={
                  dailyRates.other[countryCode as keyof typeof dailyRates.other]
                }
              />
            </ListItem>
          ))}
        </List>
      )}
    </>
  );
}
