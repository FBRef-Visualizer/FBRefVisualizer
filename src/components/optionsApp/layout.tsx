import * as React from 'react';
import { FC } from 'react';
import { Options } from '../../types/options';
import TimeFormatOption from './timeFormatOption';

interface Props {
  defaultOptions: Options | null;
}

const App: FC<Props> = ({ defaultOptions }: Props) => (
	<main className="options">
		<h1>Options</h1>
		<div className="options-selections">
			<TimeFormatOption defaultOptions={defaultOptions} />
		</div>
	</main>
);

export default App;
