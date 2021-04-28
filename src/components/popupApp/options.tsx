import * as React from 'react';
import { FC } from 'react';
import sendCommandToTab from '../../helpers/sendCommandToTab';
import { Command } from '../../types/message';

interface Props {
    hasData: boolean;
}

const Options: FC<Props> = (props: Props) => {
    const { hasData } = props;

    if (!hasData) {
        return <p>No data</p>;
    }

    function launchChart(): void {
        sendCommandToTab({ command: Command.Launch });
    }

    function addCompare(): void {
        chrome.runtime.sendMessage({ command: Command.AddToCompare });
    }

    return (
        <div className="options">
            <button onClick={launchChart}>View Radar</button>
            <button onClick={addCompare}>Add Compare</button>
        </div>
    );
};

export default Options;