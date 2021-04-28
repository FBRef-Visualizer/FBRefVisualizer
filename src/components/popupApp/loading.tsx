import * as React from 'react';
import { FC, useContext } from 'react';
import { AppContext } from './appContext';
import "./loading.scss";

const Loading: FC = () => {
    const {
        state: {
            loading
        }
    } = useContext(AppContext);

    if (!loading) {
        return null;
    }

    return (
        <div className="loading">
            <span className="sr">Loading</span>
        </div>
    );
};

export default Loading;