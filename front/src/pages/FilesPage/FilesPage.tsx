import * as React from 'react';
import { useEffect } from 'react';
import { TextFile } from 'types/TextFile';
import { MOCK_FILE_CONTENT, MOCK_RELATED_FILE_1, MOCK_RELATED_FILE_2 } from 'mockData';
import { FileCard } from 'pages/FilesPage/components/FileCard/FileCard';
import { AddFileCard } from 'pages/FilesPage/components/AddFileCard/FileCard';
import { Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Button from '@mui/material/Button';


const MOCK_FILES = [MOCK_RELATED_FILE_1, MOCK_RELATED_FILE_2];

const EMPTY_FILE = {
  author: '',
  publishedAt: new Date(),
  fileName: '',
  uploadedFileName: '',
  fileContent: '',
}

export const FilesPage = () => {
  const [filterFileName, setFilterFileName] = React.useState('');
  const [files, setFiles] = React.useState<TextFile[]>([]);
  const [isNewFileDialogOpen, setIsNewFileDialogOpen] = React.useState(false);
  const [newFileDetails, setNewFileDetails] = React.useState(EMPTY_FILE);
  
  const filesToDisplay = files.filter(file => file.fileName.toLowerCase().includes(filterFileName.toLowerCase()));
  
  
  const [openedViewFileId, setOpenedViewFileId] = React.useState('');
  const openedFile = files.find(file => file.id.toString() === openedViewFileId);
  const [openedViewFileContent, setOpenedViewFileContent] = React.useState<string[][]>([]);
  
  
  useEffect(() => {
    // Fetch Files
    setFiles(MOCK_FILES)
  }, []);
  
  useEffect(() => {
    if (!openedViewFileId) {
      // Fetch File Content by id
      setOpenedViewFileContent(MOCK_FILE_CONTENT)
    }
  }, [openedViewFileId])
  
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event?.target?.files?.[0];
    setNewFileDetails((currentNewFileDetails) => ({ ...currentNewFileDetails, uploadedFileName: selectedFile?.name || '' }))
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
  
  const onSubmitNewFile = () => {
    // TODO: Send request to server
    setNewFileDetails(EMPTY_FILE);
    setIsNewFileDialogOpen(false);
  }
  
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <div>
      <div style={{
        padding: 20,
      }}>
      <TextField
        value={filterFileName}
        onChange={(e) => setFilterFileName(e.target.value)}
        sx={{ width: '80%' }}
        id="standard-basic"
        variant="standard"
        label='Filter by file name'
      />
      </div>
      
      <div style={{ marginTop: 10, padding: 30, display: 'flex', gap: 20 }}>
      {filesToDisplay.map((file) => (
        <FileCard setOpenedViewFile={setOpenedViewFileId} file={file}/>
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
                     onChange={(e) => setNewFileDetails({ ...newFileDetails, fileName: e.target.value })}/>
          
          <TextField id="standard-basic" label="Author" variant="standard"
                     onChange={(e) => setNewFileDetails({ ...newFileDetails, author: e.target.value })}/>
          
          <DesktopDatePicker
            label="Publised At"
            inputFormat="DD/MM/YYYY"
            value={newFileDetails.publishedAt}
            onChange={(e) => console.log(e)}
            renderInput={(params) => <TextField {...params} />}
          />
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Button variant="contained" component="label" style={{ width: '100%' }}>
                Upload File
                <input type="file" hidden onChange={handleInputChange} accept=".txt"/>
              </Button>
  
            {newFileDetails.uploadedFileName &&
              <p style={{ fontSize: 12, margin: 3 }}>File name: {newFileDetails.uploadedFileName}</p>
            }
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
            <span>Published At: {openedFile?.publishedAt}</span>
            {openedViewFileContent.map((page, index) => (
              <>
                <p style={{ fontWeight: 'bold' }}>Page {index + 1}</p>
                {page.map((line, lineIndex) => (
                  <>
                    <span style={{ marginBottom: 4 }}>
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



