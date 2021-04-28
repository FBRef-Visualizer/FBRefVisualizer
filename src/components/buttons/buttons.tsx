import * as React from 'react';
import { FC, useEffect, useState } from 'react';
import { Command, Message } from '../../types/message';
import Player from '../../types/player';
import CloseButton from './closeButton';
import CompareButton from './compareButton';
import DownloadButton from './downloadButton';

interface Props extends Player { }

const Buttons: FC<Props> = (props: Props) => {
    const [show, setShow] = useState(true);

    useEffect(() => {
        if (!show) {
            chrome.runtime.sendMessage({ command: Command.Download });
        }
    }, [show]);

    useEffect(() => {
        function handleNav(message: Message): void {
            const { command } = message;
            if (command === Command.DownloadDone) {
                setShow(true);
            }

        }
        chrome.runtime.onMessage.addListener(handleNav);
        return () => chrome.runtime.onMessage.removeListener(handleNav);
    }, []);

    function hide(): void {
        setShow(false);
    }

    if (!show) {
        return null;
    }

    return (
        <>
            <CloseButton />
            <DownloadButton hide={hide} />
            <CompareButton {...props} />
        </>
    );
}

export default Buttons;