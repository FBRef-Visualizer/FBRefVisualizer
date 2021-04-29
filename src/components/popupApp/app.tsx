import * as React from 'react';
import { FC, useEffect, useReducer } from 'react';
import { sendCommandToTab, sendCommandToWorker } from '../../helpers/sendCommandToTab';
import { Command } from '../../types/message';
import Player from '../../types/player';
import "./app.scss";
import { AppContext, AppContextType } from './appContext';
import Compare from './compare';
import Loading from './loading';
import Options from './options';
import { Actions, reducer, StateDefaults } from './reducer';

const Popup: FC = () => {
    const [state, dispatch] = useReducer(reducer, { ...StateDefaults });

    useEffect(() => {
        sendCommandToTab({ command: Command.RequestLoadStatus }, (status: boolean) => {
            dispatch({ type: Actions.InitialLoad, hasData: status });
        });
        sendCommandToWorker({ command: Command.RequestCompare }, (players: Player[]) => {
            dispatch({ type: Actions.UpdateCompare, players });
        });
    }, []);

    const context: AppContextType = { state, dispatch };

    return (
        <AppContext.Provider value={context}>
            <div className="popup">
                <Loading />
                <Options />
                <Compare />
            </div>
        </AppContext.Provider>
    );
};

export default Popup;