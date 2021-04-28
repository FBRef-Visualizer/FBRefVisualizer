import * as React from 'react';
import { FC, useContext } from 'react';
import { Command } from '../../types/message';
import { AppContext } from './appContext';
import "./options.scss";
import { Actions } from './reducer';

const Options: FC = () => {
    const {
        dispatch,
        state: {
            showRadar,
            hasData
        }
    } = useContext(AppContext);

    if (!hasData) {
        return <p>No data</p>;
    }

    function launchChart(): void {
        dispatch({ type: Actions.ToggleRadar, showRadar: true });
    }

    function addCompare(): void {
        chrome.runtime.sendMessage({ command: Command.AddToCompare });
    }

    return (
        <div className="options">
            <button onClick={launchChart} disabled={showRadar}>

                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12 6c3.79 0 7.17 2.13 8.82 5.5C19.17 14.87 15.79 17 12 17s-7.17-2.13-8.82-5.5C4.83 8.13 8.21 6 12 6m0-2C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 5c1.38 0 2.5 1.12 2.5 2.5S13.38 14 12 14s-2.5-1.12-2.5-2.5S10.62 9 12 9m0-2c-2.48 0-4.5 2.02-4.5 4.5S9.52 16 12 16s4.5-2.02 4.5-4.5S14.48 7 12 7z" />
                </svg>
                <span className="label">
                    View Radar
                </span>
            </button>
            <button onClick={addCompare}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M10 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h5v2h2V1h-2v2zm0 15H5l5-6v6zm9-15h-5v2h5v13l-5-6v9h5c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
                </svg>
                <span className="label">
                    Add Compare
                </span>
            </button>
        </div>
    );
};

export default Options;