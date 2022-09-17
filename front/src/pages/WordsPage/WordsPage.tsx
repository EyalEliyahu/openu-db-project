import { Search } from 'components/Search/Search';
import { useState } from 'react';
import { WordInfo } from 'pages/WordsPage/components/WordInfo';
import { MOCK_WORD_WITH_FILE } from 'mockData';


const MOCK_OPTIONS = [
	{ label: 'myWord1', },
	{ label: 'myWord2' },
	{ label: 'dudu' },
	{ label: 'Shalom' },
	{ label: 'nachon' },
	{ label: 'myWord3' },
];

export const WordsPage = () => {
	const [searchOptions, setSearchOptions] = useState<object[]>([]);
	const [selectedWord, setSelectedWord] = useState('');
	
	const onSearchChange = (newWord: string) => {
		// TODO: Fetch options based on newValue
		setSearchOptions(MOCK_OPTIONS);
	}
	const onSelectOption = (newWord: string) => {
		console.log('New Selected Option', newWord);
		
		setSelectedWord(newWord);
	}
	
	return (
		<div style={{ marginTop: 50, padding: '0px 20px' }}>
			<Search onSelectOption={onSelectOption} onSearchChange={onSearchChange} options={searchOptions} label='Search Words'/>
			{!!selectedWord && <WordInfo selectedWord={selectedWord} dbWords={[MOCK_WORD_WITH_FILE, { ...MOCK_WORD_WITH_FILE, page: 10 }]}/>}
		</div>
	);
};

{}
