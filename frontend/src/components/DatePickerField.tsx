import { DatePicker } from '@mui/x-date-pickers';
import moment, { Moment } from 'moment';

interface Props {
  label: string;
  value: Moment | null;
  setValue: (newValue: Moment | null) => void;
}

export function DatePickerField({ label, value, setValue }: Props) {
  return (
    <div className="m1">
      <DatePicker
        label={label}
        value={value}
        format="DD.MM.YYYY"
        disableFuture
        onChange={(newValue) => {
          setValue(newValue ? moment(newValue).hours(12) : null);
        }}
      />
    </div>
  );
}
