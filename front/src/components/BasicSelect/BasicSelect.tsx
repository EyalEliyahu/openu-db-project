import * as React from 'react';
import { FC } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface Props {
  options: string[];
  onChange: (value: string) => void;
}

export const BasicSelect: FC<Props> = ({ options, onChange }) => {
  const [selectedOption, setSelectedOption] = React.useState('');
  
  const handleChange = (event: SelectChangeEvent) => {
    setSelectedOption(event.target.value as string);
    onChange(event.target.value as string);
  };
  
  return (
    <Box sx={{ minWidth: 120, flex: 2, }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Search Mode</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={selectedOption}
          label="Search Mode"
          onChange={handleChange}
        >
          {options.map(option => (
            <MenuItem value={option}>{option}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
