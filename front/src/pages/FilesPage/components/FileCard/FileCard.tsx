import { Box, Button, Card, CardActions, CardContent, IconButton, Typography } from '@mui/material';
import * as React from 'react';
import { FC } from 'react';
import { file } from 'types/File';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

interface Props {
  file: file;
  setOpenedViewFile: (fileId: string) => void;
  fetchFiles: () => void;
}

export const FileCard: FC<Props> = ({ file, setOpenedViewFile, fetchFiles }) => {
  
  const deleteFile = () => {
    fetch(`http://localhost:8000/file/${file.id}`, {
      method: 'DELETE',
    }).then(fetchFiles);
  }
  
  const card = (
    <React.Fragment>
    <CardContent sx={{
      width: 250,
      height: 200,
      alignItems: 'center',
      justifyContent: 'center',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
        {file.author}
      </Typography>
      <Typography variant="h5" component="div">
        {file.fileName}
      </Typography>
      <Typography variant="body2" style={{
        marginTop: 10,
      }}>
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
    <Box sx={{ minWidth: 275, position: 'relative' }}>
                        <IconButton onClick={deleteFile} style={{
                          position: 'absolute',
                          left: 0
                        }}>
                    <DeleteForeverIcon style={{ color: '#1876d2' }}/>
                  </IconButton>
      
      <Card>{card}</Card>
    </Box>
  );
};

