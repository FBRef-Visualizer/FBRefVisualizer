import * as React from 'react';
import { FC } from 'react';
import Button from './button';
import './downloadButton.scss';

interface Props {
    hide: () => void;
}

const Download: FC<Props> = (props: Props) => {
    const { hide } = props;
    function onClick(): void {
        hide();
    }

    return (
        <Button label="Download" onClick={onClick} wrapperClass="download-radar">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                <path fill="var(--button-fg)" d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
            </svg>
        </Button>
    );
};

export default Download;