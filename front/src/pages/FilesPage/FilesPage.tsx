import * as React from 'react';
import { useEffect } from 'react';
import { file } from 'types/File';
import { FileCard } from 'pages/FilesPage/components/FileCard/FileCard';
import { AddFileCard } from 'pages/FilesPage/components/AddFileCard/FileCard';
import { Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Button from '@mui/material/Button';
import { useParams } from 'react-router-dom';


const EMPTY_FILE = {
  author: '',
  publishedAt: new Date(),
  uploadedAt: new Date(),
  fileName: '',
  fileContent: '',
}

export const FilesPage = () => {
  const [filterFileName, setFilterFileName] = React.useState('');
  const [filterAuthorName, setFilterAuthorName] = React.useState('');
  const [filterDate, setFilterDate] = React.useState('');
  const [files, setFiles] = React.useState<file[]>([]);
  const [isNewFileDialogOpen, setIsNewFileDialogOpen] = React.useState(false);
  const [newFileDetails, setNewFileDetails] = React.useState(EMPTY_FILE);
  
  
  
  const filesToDisplay = files
    .filter(file => file.fileName.toLowerCase().includes(filterFileName.toLowerCase()))
    .filter(file => file.author.toLowerCase().includes(filterAuthorName.toLowerCase()))
    .filter(file => file.publishedAt.includes(filterDate) || file.uploadedAt.includes(filterDate));
  
  // @ts-ignore
  const urlFileId = window.location.pathname.split('/')?.[2];
  const [openedViewFileId, setOpenedViewFileId] = React.useState(urlFileId || '');
  const openedFile = files.find(file => file.id.toString() === openedViewFileId);
  const [openedViewFileContent, setOpenedViewFileContent] = React.useState<string[][]>([]);
  
  const fetchFiles = () => fetch('http://localhost:8000/files').then(res => res.json()).then(setFiles);
  
  useEffect(() => {
    fetchFiles();
  }, []);
  
  useEffect(() => {
    if (openedViewFileId) {
      // Fetch File Content by id
      fetch(`http://localhost:8000/file/${openedViewFileId}/content`).then(res => res.json()).then(setOpenedViewFileContent);
    }
  }, [openedViewFileId])
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event?.target?.files?.[0];
    setNewFileDetails((currentNewFileDetails) => ({ ...currentNewFileDetails, fileName: selectedFile?.name || '' }))
    if (selectedFile) {
      const reader = new FileReader();
      reader.readAsText(selectedFile, "UTF-8");
      reader.onload = function (evt) {
        setNewFileDetails((currentNewFileDetails) => ({
          ...currentNewFileDetails, fileContent: evt?.target?.result as string || ''
        }))
      }
    }
  }
  
  const onSubmitNewFile = async () => {
    setNewFileDetails(EMPTY_FILE);
    setIsNewFileDialogOpen(false);
    
    await fetch('http://localhost:8000/file', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newFileDetails),
    });
    
    fetchFiles();
  }
  
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <div>
      <div style={{
        padding: '20px 300px',
        display: 'flex',
        gap: 30,
      }}>
      <TextField
        value={filterFileName}
        onChange={(e) => setFilterFileName(e.target.value)}
        sx={{ flex: 1 }}
        id="standard-basic"
        variant="standard"
        label='Filter by file name'
      />
      <TextField
        value={filterAuthorName}
        onChange={(e) => setFilterAuthorName(e.target.value)}
        sx={{ flex: 1 }}
        id="standard-basic"
        variant="standard"
        label='Filter by author name'
      />
      <TextField
        value={filterDate}
        onChange={(e) => setFilterDate(e.target.value)}
        sx={{ flex: 1 }}
        id="standard-basic"
        variant="standard"
        label='Filter by date'
      />
      </div>
      
      <div style={{ marginTop: 10, padding: 30, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
      {filesToDisplay.map((file) => (
        <FileCard setOpenedViewFile={setOpenedViewFileId} file={file} fetchFiles={fetchFiles}/>
      ))}
        <AddFileCard onClick={() => setIsNewFileDialogOpen(true)}/>
		  </div>
      
      <Dialog onClose={() => setIsNewFileDialogOpen(false)} open={isNewFileDialogOpen}>
        <DialogTitle>Add New File</DialogTitle>
        <DialogContent>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20
          }}>
          <TextField id="standard-basic" label="File name" variant="standard"
                     value={newFileDetails.fileName}
                     onChange={(e) => setNewFileDetails({ ...newFileDetails, fileName: e.target.value })}/>
          
          <TextField id="standard-basic" label="Author" variant="standard"
                     onChange={(e) => setNewFileDetails({ ...newFileDetails, author: e.target.value })}/>
          
          <DesktopDatePicker
            label="Publised At"
            inputFormat="DD/MM/YYYY"
            value={newFileDetails.publishedAt}
            onChange={(e) => setNewFileDetails({ ...newFileDetails, publishedAt: e as Date })}
            renderInput={(params) => <TextField {...params} />}
          />
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Button variant="contained" component="label" style={{ width: '100%' }}>
                Upload File
                <input type="file" hidden onChange={handleInputChange} accept=".txt"/>
              </Button>
  
            {/*{newFileDetails.fileName &&*/}
            {/*  <p style={{ fontSize: 12, margin: 3 }}>File name: {newFileDetails.fileName}</p>*/}
            {/*}*/}
          </div>
            <div>
              <TextField
                sx={{ width: '100%' }}
                id="outlined-multiline-flexible"
                label="File Content"
                multiline
                // maxRows={4}
                value={newFileDetails.fileContent}
                onChange={(e) => {
                  setNewFileDetails((currentNewFileDetails) => ({
                    ...currentNewFileDetails, fileContent: e?.target?.value as string || ''
                  }))
                }}
              />
            </div>
  
            <Button disabled={!newFileDetails.fileContent} onClick={onSubmitNewFile} sx={{ flex: 1 }} variant="contained">Submit</Button>
          </div>
        </DialogContent>
     
      </Dialog>
      
      
      <Dialog onClose={() => setOpenedViewFileId('')} open={!!openedViewFileId}>
        <DialogTitle>{openedFile?.fileName}</DialogTitle>
        <DialogContent>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
          }}>
            <span>Author: {openedFile?.author}</span>
            <span style={{ marginBottom: 10 }}>Published At: {openedFile?.publishedAt}</span>
            {openedViewFileContent.map((page, index) => (
              <>
                <p style={{ fontWeight: 'bold', marginTop: 10, }}>Paragraph {index + 1}</p>
                {page.map((line, lineIndex) => (
                  <>
                    <span style={{ marginBottom: 8 }}>
                      <b>{lineIndex + 1}.</b> {line}
                    </span>
                  </>
                ))}
              </>
            ))}
          </div>
        </DialogContent>
      </Dialog>
      
      
      
    </div>
    </LocalizationProvider>
  
  );
};



