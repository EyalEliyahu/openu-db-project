import { FC } from 'react';
import { WordWithRelatedFile } from 'types/Word';
import { styled } from '@mui/material';
import Button from '@mui/material/Button';

interface Props {
  selectedWord: string;
  dbWords: WordWithRelatedFile[];
  getPrevSentence: (wordId: number) => void;
  getNextSentence: (wordId: number) => void;
}

export const WordInfo: FC<Props> = ({ selectedWord, dbWords, getPrevSentence, getNextSentence }) => {
  const relevantWords = dbWords.filter((word) => word.text === selectedWord);
  if (relevantWords.length === 0) {
    return null;
  }
  
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
      {relevantWords.map((word) => (
        <StyledOccurrence>
          <StyledOccurrenceLeftSide>
				  	<p style={{ fontWeight: 'bold' }}>{`Text: ${word.text}`}</p>
				  	<p>{`Related File: ${word.relatedFile.fileName}`}</p>
				  	<p>{`Location (Page-Row-Index): ${word.page}-${word.row}-${word.pageRowStartIndex}`}</p>
				  	<p>{`Location (Paragraph-Sentence-Index): ${word.paragraph}-${word.sentence}-${word.paragraphSentenceStartIndex}`}</p>
          </StyledOccurrenceLeftSide>
          <StyledOccurrenceRightSide>
            <StyledOccurrenceRightSideParagraphs>
              {word.surroundingSentences.map((sentence) => (
                <>
                <span>{`${sentence.paragraph}.${sentence.sentence}.`} {buildHighlightText(sentence.text, word.text)}</span>
              </>
              ))}
            </StyledOccurrenceRightSideParagraphs>
            <StyledOccurrenceRightSideButtons>
            	<Button variant="contained" color="primary" size="small" style={{ width: 100 }} onClick={() => getPrevSentence(word.id)}>Prev</Button>
            	<Button variant="contained" color="primary" size="small" style={{ width: 100 }} onClick={() => getNextSentence(word.id)}>Next</Button>
            </StyledOccurrenceRightSideButtons>
          </StyledOccurrenceRightSide>
				</StyledOccurrence>
      ))}
		</div>
  );
}

const buildHighlightText = (text: string, highlightText: string) => {
  const highlightTextLower = highlightText.toLowerCase();
  const textLower = text.toLowerCase();
  const highlightTextIndex = textLower.indexOf(highlightTextLower);
  if (highlightTextIndex === -1) {
    return text;
  }
  const highlightTextLength = highlightText.length;
  const beforeHighlightText = text.slice(0, highlightTextIndex);
  const afterHighlightText = text.slice(highlightTextIndex + highlightTextLength);
  return (
    <>
      {beforeHighlightText}
      <span style={{ backgroundColor: 'yellow' }}>{highlightText}</span>
      {afterHighlightText}
    </>
  );
}
