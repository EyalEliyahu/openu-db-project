import * as React from 'react';
import { FC } from 'react';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';

interface Props {
  onSearch: (searchText: string) => void;
}

export const Search: FC<Props> = ({ onSearch }) => {
  const [searchText, setSearchText] = React.useState('');
  const onChanges = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  }
  return (
    <div style={{
      display: 'flex',
      gap: 10,
      marginTop: 20
    }}>
      <TextField value={searchText} onChange={onChanges} sx={{ flex: 10 }} id="standard-basic" variant="standard"/>
      <Button onClick={() => onSearch(searchText)} sx={{ flex: 1 }} variant="contained">Search</Button>
    </div>
  );
}
