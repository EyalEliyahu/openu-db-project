import { file } from 'types/File';

export interface Word {
  id: number;
  text: string;
  
  page: number;
  row: number;
  pageRowStartIndex: number;
  
  paragraph: number;
  sentence: number;
  paragraphSentenceStartIndex: number;
  
  fileId: number;
}

export interface WordWithRelatedFile extends Word {
  relatedFile: file;
  surroundingRows: row[];
  reachTop: boolean;
  reachBottom: boolean;
}

interface row {
  page: number;
  row: number;
  text: string;
}

