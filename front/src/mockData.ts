import { TextFile } from 'types/TextFile';
import { WordWithRelatedFile } from 'types/Word';

export const MOCK_RELATED_FILE: TextFile = {
	id: 1,
	author: 'author',
	createdAt: 'createdAt',
	uploadedAt: 'uploadedAt',
	publishedAt: 'publishedAt',
	fileName: 'fileName',
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
	
	relatedFile: MOCK_RELATED_FILE,
};
