import * as React from 'react';
import { FC, useEffect } from 'react';
import { loadOptions } from '../../helpers/chromeHelpers';
import { Options } from '../../types/options';
import '../defaults.scss';
import './app.scss';
import Layout from './layout';

const App: FC = () => {
	const [options, setOptions] = React.useState<Options | null>(null);

	useEffect(() => {
		loadOptions((loadedOptions) => {
			setOptions(loadedOptions);
		});
	}, []);

	return <Layout defaultOptions={options} />;
};

export default App;
