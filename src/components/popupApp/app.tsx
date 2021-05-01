import * as React from 'react';
import { FC, useEffect, useReducer } from 'react';
import { sendCommandToTab, sendCommandToWorker } from '../../helpers/sendCommandToTab';
import { Command, Message } from '../../types/message';
import Player from '../../types/player';
import "./app.scss";
import { AppContext, AppContextType } from './appContext';
import Layout from './layout';
import { Actions, reducer, StateDefaults } from './reducer';

const Popup: FC = () => {
    const [state, dispatch] = useReducer(reducer, { ...StateDefaults });
    const { refreshCompare } = state;

    useEffect(() => {
        // this pulls the status if inject.js has already run
        sendCommandToTab({ command: Command.RequestLoadStatus }, (data: { status: boolean; id: string; name: string; }) => {
            console.log('done rc', data);
            dispatch({
                type: Actions.InitialLoad,
                hasData: data.status,
                currentPlayer: {
                    id: data.id,
                    name: data.name
                }
            });
        });

        // in case this component loads before inject.js finishes
        chrome.runtime.onMessage.addListener((message: Message) => {
            if (message.command === Command.InitialLoadComplete) {
                dispatch({
                    type: Actions.InitialLoad,
                    hasData: message.status,
                    currentPlayer: {
                        id: message.id,
                        name: message.name
                    }
                });
            }
        });

    }, []);

    useEffect(() => {
        if (refreshCompare) {
            console.log('refreshing compare');
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