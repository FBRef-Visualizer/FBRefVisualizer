import * as React from 'react';
import { FC, useEffect, useState } from 'react';
import sendCommandToTab from '../../helpers/sendCommandToTab';
import { Command } from '../../types/message';
import "./app.scss";
import Loading from './loading';
import Options from './options';

const Popup: FC = () => {

    const [loading, setLoading] = useState(true);
    const [hasData, setHasData] = useState(false);

    useEffect(() => {
        sendCommandToTab({ command: Command.RequestLoadStatus }, (status: boolean) => {
            setHasData(status);
            setLoading(false);
        });
    }, []);

    return (
        <div className="popup">
            <Loading loading={loading} />
            <Options hasData={hasData} />
        </div>
    );
};

export default Popup;