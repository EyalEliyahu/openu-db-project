import { FC } from 'react';
import {  WordWithRelatedFile } from 'types/Word';
import {  styled } from '@mui/material';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

interface Props {
  dbWords: WordWithRelatedFile[];
  getPrevRow: (word: WordWithRelatedFile) => void;
  getNextRow: (word: WordWithRelatedFile) => void;
}

export const WordInfo: FC<Props> = ({ dbWords, getPrevRow, getNextRow }) => {
  
  
  const StyledOccurrence = styled('div')({
    display: 'flex',
    alignItems: 'space-between',
    backgroundColor: 'rgb(43 127 209)',
    color: 'white',
    fontSize: 16,
    textAlign: 'left',
    padding: 8,
    borderRadius: 8,
    "&:hover": {
      backgroundColor: "rgb(72 142 210)",
    },
  });
  
  const StyledOccurrenceLeftSide = styled('div')({
    flex: 1,
  });
  
  const StyledOccurrenceRightSide = styled('div')({
    flex: 1,
    display: 'flex',
    gap: 10,
    height: 160,
    justifyContent: 'space-between',
  });
  
  const StyledOccurrenceRightSideButtons = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
  });
  
  const StyledOccurrenceRightSideParagraphs = styled('div')({
    color: 'black',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 16,
    flex: 1,
  });
  
  return (
    <div style={{
      width: '80%',
      margin: '50px auto 0px auto',
      backgroundColor: '#1976d2',
      borderRadius: 8,
      padding: 20,
      display: 'flex',
      gap: 4,
      flexDirection: 'column',
    }}>
		<p style={{ color: 'white', fontSize: 20, fontWeight: 'bold', textAlign: 'left' }}>Occurrences:</p>
      {dbWords.map((word) => (
        <StyledOccurrence>
          <StyledOccurrenceLeftSide>
				  	<p style={{ fontWeight: 'bold' }}>{`Text: ${word.text}`}</p>
            <Link to={`/files/${word.relatedFile.id}`} style={{color:'white'}}>
				  	<p>
              {`Related File: ${word.relatedFile.fileName}`}
            </p>
            </Link>
				  	<p>{`Location (Page-Row-Index): ${word.page}-${word.row}-${word.pageRowStartIndex}`}</p>
				  	<p>{`Location (Paragraph-Sentence-Index): ${word.paragraph}-${word.sentence}-${word.paragraphSentenceStartIndex}`}</p>
          </StyledOccurrenceLeftSide>
          <StyledOccurrenceRightSide>
            <StyledOccurrenceRightSideParagraphs>
              {word.surroundingRows.map((row, rowIndex) => (
                <>
                <span>{`${row.page}.${row.row}.`} {buildHighlightText(row.text, rowIndex, word)}</span>
              </>
              ))}
            </StyledOccurrenceRightSideParagraphs>
            <StyledOccurrenceRightSideButtons>
            	<Button disabled={word.reachBottom} variant="contained" color="primary" size="small" style={{ width: 100 }}
                      onClick={() => getPrevRow(word)}>Prev</Button>
            	<Button disabled={word.reachTop} variant="contained" color="primary" size="small" style={{ width: 100 }}
                      onClick={() => getNextRow(word)}>Next</Button>
            </StyledOccurrenceRightSideButtons>
          </StyledOccurrenceRightSide>
				</StyledOccurrence>
      ))}
		</div>
  );
}

const buildHighlightText = (rowText: string, rowIndex: number, word: WordWithRelatedFile) => {
  const normalizedWordSelectedRowIndex = word.surroundingRows.findIndex((row) => row.row === word.row && row.page === word.page);
  if (rowIndex !== normalizedWordSelectedRowIndex) {
    return rowText;
  } else {
    const { pageRowStartIndex } = word;
    // Find the word char index by pageRowStartIndex
    const splittedWords = rowText.split(' ');
    const isFirstWord = pageRowStartIndex === 0;
    const highlightWordCharIndex = splittedWords.slice(0, pageRowStartIndex).join(' ').length + (isFirstWord ? 0 : 1);
    const highlightWordEndCharIndex = highlightWordCharIndex + word.text.length;
    
    const beforeHighlightText = rowText.slice(0, highlightWordCharIndex);
    const highlightText = rowText.slice(highlightWordCharIndex, highlightWordEndCharIndex);
    const afterHighlightText = rowText.slice(highlightWordEndCharIndex, rowText.length);
    return (
      <>
      {beforeHighlightText}
        <span style={{ backgroundColor: 'yellow' }}>{highlightText}</span>
        {afterHighlightText}
    </>
    );
  }
}


//   const highlightTextLower = highlightText.toLowerCase();
//   const textLower = sentenceText.toLowerCase();
//   // const highlightTextSubstrings = getAllSubstrings(highlightTextLower).filter(
//   //   (substring) => substring.length > 1
//   // )
//   const highlightTextIndex = textLower.indexOf(' ' + highlightTextLower + ' ');
//   if (highlightTextIndex === -1) {
//     return sentenceText;
//   }
// }
