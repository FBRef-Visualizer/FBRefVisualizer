import * as React from 'react';
import { FC, useContext } from 'react';
import { Command } from '../../types/message';
import { AppContext } from './appContext';
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
            <button onClick={launchChart} disabled={showRadar}>View Radar</button>
            <button onClick={addCompare}>Add Compare</button>
        </div>
    );
};

export default Options;