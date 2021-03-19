import * as React from 'react';
import { FC, useEffect, useState } from 'react';
import { Command } from '../types/message';
import './downloadButton.scss';

const Download: FC = () => {
    const [show, setShow] = useState(true);

    useEffect(() => {
        if (!show) {
            chrome.runtime.sendMessage({ command: Command.Download });
        }
    }, [show]);

    function onClick(): void {
        setShow(false);
    }

    if (!show) {
        return null;
    }

    return (
        <div className="download-radar">
            <button title="Download" onClick={onClick}>
                <span>
                    Download
                    </span>
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                    <path fill="var(--button-fg)" d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                </svg>
            </button>
        </div>
    );
};

export default Download;