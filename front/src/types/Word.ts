import { TextFile } from './TextFile';

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
	relatedFile: TextFile;
}
