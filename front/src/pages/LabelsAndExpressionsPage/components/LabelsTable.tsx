import * as React from 'react';
import { useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { Chip, InputAdornment, Paper, TextField } from '@mui/material';
import { Label } from 'types/Label';


export default function LabelsTable() {
  const [labels, setLabels] = React.useState<Label[]>([]);
  
  const fetchLabels = () => fetch('http://localhost:8000/label').then(res => res.json()).then(data => setLabels(data));
  
  useEffect(() => {
    fetchLabels();
  }, [])
  
  const onLabelDelete = async (labelId: number) => {
    await fetch(`http://localhost:8000/label/${labelId}`, { method: 'DELETE' });
    await fetchLabels();
  }
  
  const onWordDelete = async (labelId: number, word: string) => {
    await fetch(`http://localhost:8000/label/${labelId}/word/${word}`, { method: 'DELETE' });
    await fetchLabels();
  }
  
  const addLabelWord = async (labelId: number, e: any) => {
    const newWord = e.target.parentElement?.parentElement.parentElement.firstChild.value as string;
    const isEmpty = newWord.trim() === '';
    if (isEmpty) {
      window.alert('Word is empty');
      return;
    }
    const label = labels?.find(label => label.id === labelId);
    if (!label || label.words.includes(newWord)) {
      window.alert('Word already exists');
      return;
    }
    // @ts-ignore
    e.target.parentElement.parentElement.parentElement.firstChild.value = ''
    
    // call api
    await fetch(`http://localhost:8000/label/${labelId}/word`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: newWord }),
    });
    await fetchLabels();
    
  }
  const addLabel = async (e: any) => {
    const newLabelName = e.target.parentElement?.parentElement.parentElement.firstChild.value as string;
    const isEmpty = newLabelName.trim() === '';
    if (isEmpty) {
      window.alert('Label is empty');
      return;
    }
    const alreadyExists = labels?.find(label => label.name === newLabelName);
    if (alreadyExists) {
      window.alert('Label already exists');
      return;
    }
    e.target.parentElement.parentElement.parentElement.firstChild.value = ''
    
    // call api
    await fetch('http://localhost:8000/label', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: newLabelName }),
    });
    await fetchLabels();
  }
  
  const Wrapper = ({ children }: any) => (
    <Paper sx={{ display: 'flex', flex: 1 }}>
      {children}
    </Paper>
  )
  
  return (
    <TableContainer component={Wrapper}>
      <Table sx={{ flex: 1 }} aria-label="simple table">
        <TableBody>
          {labels.map((label) => (
            <TableRow key={label.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                  <Chip color='primary' label={label.name} onDelete={() => onLabelDelete(label.id)}/>
              </TableCell>
              <TableCell align="right">
                <div style={{ display: 'flex', gap: 5, justifyContent: 'end', flexWrap: 'wrap' }}>
                  <>
                {label.words.map(word => <Chip label={word} onDelete={() => onWordDelete(label.id, word)}/>)}
                    </>
                </div>
            </TableCell>
              <TableCell align="right">
                  <TextField
                    variant='standard'
                    id="input-with-icon-textfield"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Chip label='+' size='small'
                                onClick={(e) => addLabelWord(label.id, e)}/>
                        </InputAdornment>
                      ),
                    }}
                  />
            </TableCell>
            </TableRow>
          ))}
  
          <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: '#ebebeb' }}>
              <TableCell colSpan={3}>
                  <TextField
                    sx={{ width: '100%' }}
                    variant='standard'
                    id="input-with-icon-textfield"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Chip label='Add Label' size='small' onClick={addLabel}/>
                        </InputAdornment>
                      ),
                    }}
                  />
            </TableCell>
            </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
