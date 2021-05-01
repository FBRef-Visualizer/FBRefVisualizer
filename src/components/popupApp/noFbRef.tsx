import * as React from 'react';
import { FC, useContext } from 'react';
import { navigateCurrentTab } from '../../helpers/chromeHelpers';
import { AppContext } from './appContext';
import './noFbRef.scss';

const fbRefUrl = 'https://fbref.com/';

const NoFbRef: FC = () => {
    const { state: { isOnFbRef } } = useContext(AppContext);

    if (isOnFbRef) {
        return null;
    }

    function onLinkClick(): void {
        navigateCurrentTab(fbRefUrl, () => window.close());
    }

    return (
        <div className="no-fb-ref">
            <p>
                This extension only works on <a href={fbRefUrl} onClick={onLinkClick}>FBRef.com</a>
            </p>
        </div>
    );
}

export default NoFbRef;