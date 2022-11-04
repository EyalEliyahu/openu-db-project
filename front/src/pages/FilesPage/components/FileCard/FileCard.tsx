import { Box, Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import * as React from 'react';
import { FC } from 'react';
import { TextFile } from 'types/TextFile';

interface Props {
  file: TextFile;
  setOpenedViewFile: (fileId: string) => void;
}

export const FileCard: FC<Props> = ({ file, setOpenedViewFile }) => {
  const card = (
    <React.Fragment>
    <CardContent>
      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
        {file.author}
      </Typography>
      <Typography variant="h5" component="div">
        {file.fileName}
      </Typography>
      <Typography sx={{ mb: 1.5 }} color="text.secondary">
        adjective
      </Typography>
      <Typography variant="body2">
        {'Uploaded At: ' + file.uploadedAt}
        <br/>
        {'Published At: ' + file.publishedAt}
      </Typography>
    </CardContent>
    <CardActions sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <Button size="small" onClick={() => {setOpenedViewFile(file.id.toString())}}>View File</Button>
    </CardActions>
  </React.Fragment>
  );
  
  return (
    <Box sx={{ minWidth: 275 }}>
      <Card>{card}</Card>
    </Box>
  );
};

