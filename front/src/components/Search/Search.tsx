import * as React from 'react';
import { FC } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

interface Props {
	options: object[],
	label: string,
	onSearchChange: (value: any) => void,
	onSelectOption: (value: any) => void,
}

export const Search: FC<Props> = ({ options, label, onSearchChange, onSelectOption }) => {
	return (
		<Autocomplete
			onChange={(event: any) => onSelectOption(event.target.innerText || '')}
			disablePortal
			id="combo-box-demo"
			options={options}
			renderInput={(params) => <TextField onChange={(event: any) => onSearchChange(event.target.value || '')} {...params} label={label}/>}
		/>
	);
}
