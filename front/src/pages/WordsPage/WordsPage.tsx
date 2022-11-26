import * as React from 'react';
import { useState } from 'react';
import { WordInfo } from 'pages/WordsPage/components/WordInfo';
import { WordWithRelatedFile } from 'types/Word';
import { Search } from 'components/Search/Search';
import { BasicSelect } from 'components/BasicSelect/BasicSelect';
import { LocationInput } from 'components/LocationInput/LocationInput';
import { TextField } from '@mui/material';


export const WordsPage = () => {
  const [searchMode, setSearchMode] = useState<string>('');
  const [searchedFileName, setSearchedFileName] = useState('');
  const [selectedWordOccurrences, setSelectedWordOccurrences] = useState<WordWithRelatedFile[]>([]);
  
  const onSelectOption = (searchValue: string) => {
    const params = new URLSearchParams({
      word: searchMode === 'Word' ? searchValue : '',
      label: searchMode === 'Label' ? searchValue : '',
      expression: searchMode === 'Expression' ? searchValue : '',
      page_based_location: searchMode === 'Location (Page-Row-Index)' ? searchValue : '',
      paragraph_based_location: searchMode === 'Location (Paragraph-Sentence-Index)' ? searchValue : '',
      file_name: searchedFileName,
    });
    fetch(`http://localhost:8000/words?` + params).then(res => res.json()).then(setSelectedWordOccurrences);
  }
  
  const getPrevRow = (word: WordWithRelatedFile) => {
    const fileId = word.fileId;
    const pageNumber = word.surroundingRows?.[0].page;
    const rowNumber = word.surroundingRows?.[0].row;
    fetch(`http://localhost:8000/surroundingRows/${fileId}/${pageNumber}/${rowNumber}`).then(res => res.json()).then(res => {
      const updatedWord = {
        ...word,
        ...res,
      }
      const updatedSelectedWordOccurrences = selectedWordOccurrences?.map(word => word.id === updatedWord.id ? updatedWord : word);
      setSelectedWordOccurrences(updatedSelectedWordOccurrences);
    });
  }
  
  const getNextRow = (word: WordWithRelatedFile) => {
    const fileId = word.fileId;
    const pageNumber = word.surroundingRows?.[2].page;
    const rowNumber = word.surroundingRows?.[2].row;
    console.log('fileId', fileId);
    fetch(`http://localhost:8000/surroundingRows/${fileId}/${pageNumber}/${rowNumber}`).then(res => res.json()).then(res => {
      const updatedWord = {
        ...word,
        ...res,
      }
      const updatedSelectedWordOccurrences = selectedWordOccurrences?.map(word => word.id === updatedWord.id ? updatedWord : word);
      setSelectedWordOccurrences(updatedSelectedWordOccurrences);
    });
  }
  
  return (
    <div style={{ marginTop: 50, padding: '0px 20px' }}>
      <div style={{
        display: 'flex',
        gap: 10,
      }}>
			  <BasicSelect onChange={setSearchMode}
                     options={['Word', 'Label', 'Expression', 'Location (Page-Row-Index)', 'Location (Paragraph-Sentence-Index)']}
      
        />
        <TextField value={searchedFileName}
                   onChange={(e) => setSearchedFileName(e.target.value)}
                   sx={{ flex: 1 }} id="standard-basic"
                   variant="standard"
                   label={'File Name (Optional)'}
        />
      </div>
      
      {['Word', 'Label', 'Expression',].includes(searchMode) && (
        <Search onSearch={onSelectOption}/>
      )}
      {['Location (Page-Row-Index)', 'Location (Paragraph-Sentence-Index)'].includes(searchMode) && (
        <LocationInput onSubmit={(numbers: number[]) => onSelectOption(numbers.join('-'))} searchMode={searchMode}/>
      )}
      
      {!!selectedWordOccurrences.length &&
        <WordInfo dbWords={selectedWordOccurrences} getPrevRow={getPrevRow}
                  getNextRow={getNextRow}/>}
		</div>
  );
};

