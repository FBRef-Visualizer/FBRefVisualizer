import * as React from 'react';
import { FC } from 'react';
import { Command } from '../../../types/message';
import Button from './button';
import './closeButton.scss';

const Close: FC = () => {
    function onClick(): void {
        chrome.runtime.sendMessage({
            command: Command.Close
        });
    }

    return (
        <Button label="Close" onClick={onClick} wrapperClass="close-radar">
            <svg xmlns="http://www.w3.org/2000/svg" height="18px" viewBox="0 0 24 24" width="18px" fill="var(--button-fg)">
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
            </svg>
        </Button>
    );
};

export default Close;