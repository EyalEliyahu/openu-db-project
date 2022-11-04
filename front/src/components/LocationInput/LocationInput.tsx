import * as React from 'react';
import { FC } from 'react';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';

interface Props {
  searchMode: string;
  onSubmit: (state: (number)[]) => void
}

export const LocationInput: FC<Props> = ({ onSubmit, searchMode }) => {
  const [values, setValues] = React.useState<(number)[]>([0, 0, 0]);
  const texts = searchMode.replace('Location (', '').replace(')', '').split('-');
  return (
    <div style={{
      display: 'flex',
      gap: 10,
      marginTop: 20
    }}>
      {values.map((value, index) => (
        <TextField
          value={value}
          onChange={(event) => {
            const newValue = event.target.value as unknown as number;
            const newValues = [...values];
            newValues[index] = newValue;
            setValues(newValues);
          }}
          sx={{ flex: 3 }}
          id="standard-basic"
          variant="standard"
          type='number'
          label={texts[index]}
        />
      ))}
      
      <Button onClick={() => onSubmit(values)} sx={{ flex: 1 }} variant="contained">Search</Button>
    </div>
  );
}
