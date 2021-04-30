import * as React from 'react';
import { FC, useEffect, useReducer } from 'react';
import { sendCommandToTab, sendCommandToWorker } from '../../helpers/sendCommandToTab';
import { Command } from '../../types/message';
import Player from '../../types/player';
import "./app.scss";
import { AppContext, AppContextType } from './appContext';
import Layout from './layout';
import { Actions, reducer, StateDefaults } from './reducer';

const Popup: FC = () => {
    const [state, dispatch] = useReducer(reducer, { ...StateDefaults });
    const { refreshCompare } = state;
    useEffect(() => {
        if (refreshCompare) {
            console.log('refreshing compare');
            sendCommandToTab({ command: Command.RequestLoadStatus }, (data: { status: boolean; id: string; name: string; }) => {
                dispatch({
                    type: Actions.InitialLoad,
                    hasData: data.status,
                    currentPlayer: {
                        id: data.id,
                        name: data.name
                    }
                });
            });
            sendCommandToWorker({ command: Command.RequestCompare }, (players: Player[]) => {
                dispatch({ type: Actions.UpdateCompare, players });
            });
        }
    }, [refreshCompare]);

    const context: AppContextType = { state, dispatch };

    return (
        <AppContext.Provider value={context}>
            <Layout />
        </AppContext.Provider>
    );
};

export default Popup;