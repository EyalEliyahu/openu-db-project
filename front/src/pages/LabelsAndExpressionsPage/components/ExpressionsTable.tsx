import * as React from 'react';
import { useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { Chip, IconButton, InputAdornment, Paper, TextField } from '@mui/material';
import { Expression } from 'types/Expression';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';


export default function ExpressionsTable() {
  const [expressions, setExpressions] = React.useState<Expression[]>([]);
  
  const fetchExpressions = () => fetch('http://localhost:8000/expression').then(res => res.json()).then(data => setExpressions(data));
  
  useEffect(() => {
    fetchExpressions();
  }, [])
  
  const Wrapper = ({ children }: any) => (
    <Paper sx={{ display: 'flex', flex: 1 }}>
      {children}
    </Paper>
  )
  
  const onExpressionDelete = async (expressionId: number) => {
    await fetch(`http://localhost:8000/expression/${expressionId}`, { method: 'DELETE' });
    await fetchExpressions();
  }
  
  const addExpression = async (e: any) => {
    const newExpression = e.target.parentElement?.parentElement.parentElement.firstChild.value as string;
    const isEmpty = newExpression.trim() === '';
    if (isEmpty) {
      window.alert('Expression is empty');
      return;
    }
    const alreadyExists = expressions?.find(expression => expression.text === newExpression);
    if (alreadyExists) {
      window.alert('Expression already exists');
      return;
    }
    // @ts-ignore
    e.target.parentElement.parentElement.parentElement.firstChild.value = ''
    // call api
    await fetch('http://localhost:8000/expression', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: newExpression }),
    });
    await fetchExpressions();
  }
  
  return (
    <TableContainer component={Wrapper}>
      <Table sx={{ flex: 1 }} aria-label="simple table">
        <TableBody>
          {expressions.map((expression) => (
            <TableRow key={expression.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell component="th" scope="row">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ color: '#1876d2' }}>{expression.text}</p>
                  <IconButton onClick={() => onExpressionDelete(expression.id)}>
                    <DeleteForeverIcon style={{ color: '#1876d2' }}/>
                  </IconButton>
                </div>
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
                          <Chip label='Add Expression' size='small' onClick={(e) => addExpression(e)}/>
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
