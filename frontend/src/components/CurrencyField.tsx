import { Currency } from '../api/openapi';
import { Autocomplete, CircularProgress, TextField } from '@mui/material';

interface Props {
  label: string;
  currencies: Currency[];
  setCurrency: (currency: Currency | null) => void;
}

export default function CurrencyField({
  label,
  currencies,
  setCurrency,
}: Props) {
  return (
    <Autocomplete
      className="m1"
      sx={{ width: 284 }}
      isOptionEqualToValue={(option, value) => option.name === value.name}
      getOptionLabel={(option) =>
        option?.name ? `${option.code} - ${option.name}` : option.code
      }
      options={currencies}
      loading={!currencies.length}
      onChange={(event, value) => {
        setCurrency(value || null);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {!currencies.length ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}
