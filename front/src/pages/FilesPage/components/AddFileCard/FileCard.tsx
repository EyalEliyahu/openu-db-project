import { Box, Card, CardActionArea, CardContent } from '@mui/material';
import * as React from 'react';
import { FC } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';

interface Props {
  onClick: () => void;
}

export const AddFileCard: FC<Props> = ({ onClick }) => {
  
  return (
    <Box sx={{ minWidth: 275, alignSelf: 'stretch', height: 180 }} onClick={onClick}>
      <Card>
        <CardActionArea>
          <CardContent sx={{width: 250, height: 248, alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
            <AddCircleIcon sx={{ fontSize: 100, color: '#2076d1' }}/>
          </CardContent>
        </CardActionArea>

      </Card>
    </Box>
  );
};
