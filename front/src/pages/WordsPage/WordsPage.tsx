import * as React from 'react';
import { useState } from 'react';
import { WordInfo } from 'pages/WordsPage/components/WordInfo';
import { WordWithRelatedFile } from 'types/Word';
import { Search } from 'components/Search/Search';
import { BasicSelect } from 'components/BasicSelect/BasicSelect';
import { MOCK_RELATED_FILE_2, MOCK_WORD_WITH_FILE } from 'mockData';
import { LocationInput } from 'components/LocationInput/LocationInput';
import { TextField } from '@mui/material';


export const WordsPage = () => {
  const [searchMode, setSearchMode] = useState<string>('');
  const [searchedFileName, setSearchedFileName] = useState('');
  const [selectedWordOccurrences, setSelectedWordOccurrences] = useState<WordWithRelatedFile[]>();
  
  const onSelectOption = (searchValue: string) => {
    console.log('New Selected Option', searchValue);
    // TODO: Fetch word info based on searchValue & searchMode
    if (searchValue === 'Shalom') {
      setSelectedWordOccurrences([MOCK_WORD_WITH_FILE, { ...MOCK_WORD_WITH_FILE, page: 10, relatedFile: MOCK_RELATED_FILE_2, id: 5, }]);
    } else {
      setSelectedWordOccurrences(undefined);
    }
  }
  
  const onLocationSearch = (location: (number)[]) => {
    console.log('New Location', location);
    // TODO: Fetch word info based on searchValue & searchMode
    
  }
  
  const getPrevSentence = (wordId: number) => {
    // TODO: Fetch prev 'sentence' object based on related word ID and update the `selectedWordOccurrences` state.
    const dbWord = selectedWordOccurrences?.find(word => word.id === wordId);
    if (dbWord) {
      const prevSentence = {  // TODO: change it based on Server
        paragraph: dbWord.surroundingSentences?.[0].paragraph,
        sentence: dbWord.surroundingSentences?.[0].sentence - 1,
        text: "This is the previous sentence - " + Math.floor(Math.random() * 100),
      };
      const updatedDBWord = {
        ...dbWord,
        surroundingSentences: [prevSentence, ...dbWord.surroundingSentences?.slice(0, 2)],
      }
      const updatedSelectedWordOccurrences = selectedWordOccurrences?.map(word => word.id === wordId ? updatedDBWord : word);
      setSelectedWordOccurrences(updatedSelectedWordOccurrences);
    }
  }
  
  const getNextSentence = (wordId: number) => {
    // TODO: Fetch next 'sentence' object based on related word ID and update the `selectedWordOccurrences` state
    const dbWord = selectedWordOccurrences?.find(word => word.id === wordId);
    if (dbWord) {
      const nextSentence = {  // TODO: change it based on Server
        paragraph: dbWord.surroundingSentences?.[2].paragraph,
        sentence: dbWord.surroundingSentences?.[2].sentence + 1,
        text: "This is the next sentence - " + Math.floor(Math.random() * 100),
      };
      const updatedDBWord = {
        ...dbWord,
        surroundingSentences: [...dbWord.surroundingSentences?.slice(1, 3), nextSentence],
      }
      const updatedSelectedWordOccurrences = selectedWordOccurrences?.map(word => word.id === wordId ? updatedDBWord : word);
      setSelectedWordOccurrences(updatedSelectedWordOccurrences);
    }
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
        <LocationInput onSubmit={onLocationSearch} searchMode={searchMode}/>
      )}
      
      {!!selectedWordOccurrences &&
        <WordInfo selectedWord={selectedWordOccurrences[0].text} dbWords={selectedWordOccurrences} getPrevSentence={getPrevSentence}
                  getNextSentence={getNextSentence}/>}
		</div>
  );
};

