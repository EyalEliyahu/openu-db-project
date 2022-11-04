import { TextFile } from 'types/TextFile';
import { WordWithRelatedFile } from 'types/Word';

export const MOCK_RELATED_FILE_1: TextFile = {
  id: 1,
  author: 'author',
  uploadedAt: 'uploadedAt',
  publishedAt: 'publishedAt',
  fileName: 'fileName',
}

export const MOCK_RELATED_FILE_2: TextFile = {
  id: 2,
  author: 'author2',
  uploadedAt: 'uploadedAt2',
  publishedAt: 'publishedAt2',
  fileName: 'fileName2',
}

export const MOCK_WORD_WITH_FILE: WordWithRelatedFile = {
  id: 1,
  text: 'Shalom',
  
  page: 1,
  row: 2,
  pageRowStartIndex: 3,
  
  paragraph: 1,
  sentence: 2,
  paragraphSentenceStartIndex: 3,
  
  fileId: 1,
  
  relatedFile: MOCK_RELATED_FILE_1,
  surroundingSentences: [
    { paragraph: 1, sentence: 1, text: "Some text Shalom World." },
    { paragraph: 1, sentence: 2, text: "He Said Shalom Everybody." },
    { paragraph: 1, sentence: 3, text: "End Of Sentence." },
  ],
};


export const MOCK_FILE_CONTENT = [
  [
    "First Line",
    "Second Line",
    "Third Line",
  ],
  [
    "First Line Second Page",
    "Second Line Second Page",
    "Third Line Second Page",
  ],
  [
    "First Line",
    "Second Line",
    "Third Line",
  ],
  [
    "First Line Second Page",
    "Second Line Second Page",
    "Third Line Second Page",
  ],
  [
    "First Line",
    "Second Line",
    "Third Line",
  ],
]
