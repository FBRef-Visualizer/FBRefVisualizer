import * as React from 'react';
import { FC, useEffect, useReducer } from 'react';
import sendCommandToTab from '../../helpers/sendCommandToTab';
import { Command } from '../../types/message';
import "./app.scss";
import { AppContext, AppContextType } from './appContext';
import Loading from './loading';
import Options from './options';
import { Actions, reducer, StateDefaults } from './reducer';

const Popup: FC = () => {
    const [state, dispatch] = useReducer(reducer, { ...StateDefaults });

    useEffect(() => {
        sendCommandToTab({ command: Command.RequestLoadStatus }, (status: boolean) => {
            dispatch({ type: Actions.InitialLoad, hasData: status });
        });
    }, []);

    const context: AppContextType = { state, dispatch };

    return (
        <AppContext.Provider value={context}>
            <div className="popup">
                <Loading />
                <Options />
            </div>
        </AppContext.Provider>
    );
};

export default Popup;