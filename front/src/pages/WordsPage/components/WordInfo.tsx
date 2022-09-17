import { FC } from 'react';
import { WordWithRelatedFile } from 'types/Word';
import { styled } from '@mui/material';

interface Props {
	selectedWord: string;
	dbWords: WordWithRelatedFile[];
}

export const WordInfo: FC<Props> = ({ selectedWord, dbWords }) => {
	const relevantWords = dbWords.filter((word) => word.text === selectedWord);
	console.log(relevantWords);
	if (relevantWords.length === 0) {
		return null;
	}
	
	const StyledOccurrence = styled('div')({
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
					<p>
						{`Page: ${word.page}`}
					</p>
				</StyledOccurrence>
			))}
		</div>
	);
}
