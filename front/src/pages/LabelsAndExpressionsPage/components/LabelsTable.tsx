import * as React from 'react';
import { useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { Chip, InputAdornment, Paper, TextField } from '@mui/material';
import { Label } from 'types/Label';

const MOCK_LABELS: Label[] = [
  {
    id: 1,
    name: 'label1',
    words: ['word1', 'word2', 'word3'],
  },
  {
    id: 2,
    name: 'label2',
    words: ['word4', 'word5', 'word6', 'word7', 'word6', 'word7', 'word6'],
  }
]
export default function LabelsTable() {
  const [lables, setLabels] = React.useState<Label[]>([]);
  
  useEffect(() => {
    // TODO: Fetch Labels
    setLabels(MOCK_LABELS);
  }, [])
  
  const onLabelDelete = (labelId: number) => {
    const newLabels = lables.filter(label => label.id !== labelId);
    setLabels(newLabels);
    // TODO: Call APIs
  }
  
  const onWordDelete = (labelId: number, word: string) => {
    const updatedLabels = lables.map(label => {
      if (label.id === labelId) {
        return {
          ...label,
          words: label.words.filter(w => w !== word),
        }
      }
      return label;
    });
    setLabels(updatedLabels);
    // TODO: Call API to update label
  }
  
  const addLabelWord = (labelId: number, e: any) => {
    const newWord = e.target.parentElement?.parentElement.parentElement.firstChild.value as string;
    // @ts-ignore
    e.target.parentElement.parentElement.parentElement.firstChild.value = ''
    const updatedLabels = lables.map(label => {
      if (label.id === labelId) {
        return {
          ...label,
          words: [...label.words, newWord],
        }
      }
      return label;
    });
    setLabels(updatedLabels);
    // TODO: call API to update label
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
          {lables.map((label) => (
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
                    // label="Add Word"
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
                          <Chip label='Add Label' size='small' onClick={(e) => {}}/>
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
