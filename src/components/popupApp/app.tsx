import * as React from 'react';
import { FC, useEffect, useReducer } from 'react';
import { queryCurrentTab, sendCommandToTab, sendCommandToWorker } from '../../helpers/chromeHelpers';
import { testUrl } from '../../helpers/urlHelpers';
import useOptions from '../../hooks/useOptions';
import { Command, Message } from '../../types/message';
import Player from '../../types/player';
import "./app.scss";
import { AppContext, AppContextType } from './appContext';
import Layout from './layout';
import { Actions, reducer, StateDefaults } from './reducer';

const Popup: FC = () => {
    const { options, loaded } = useOptions();
    const [state, dispatch] = useReducer(reducer, { ...StateDefaults });
    const { refreshCompare } = state;

    useEffect(() => {
        // we need two actions.
        // one if the popup loads before inject has run
        // the other if the popup loads if inject has already run

        // this pulls the status if inject.js has already run
        sendCommandToTab({ command: Command.RequestLoadStatus }, (data: { status: boolean; name: string | null; }) => {
            console.log('done rc', data);
            dispatch({
                type: Actions.InitialLoad,
                hasData: data.status,
                currentPlayer: data.name
            });
        });

        // in case this component loads before inject.js finishes
        chrome.runtime.onMessage.addListener((message: Message) => {
            if (message.command === Command.InitialLoadComplete) {
                dispatch({
                    type: Actions.InitialLoad,
                    hasData: message.status,
                    currentPlayer: message.name
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

    useEffect(() => {
        queryCurrentTab(tab => {
            if (tab && tab.url) {
                if (!testUrl(tab.url)) {
                    dispatch({ type: Actions.SetNotOnFbRef });
                }
            }
        });
    }, []);

    const context: AppContextType = {
        state,
        dispatch,
        options
    };

    if (!loaded) {
        return null;
    }

    return (
        <AppContext.Provider value={context}>
            <Layout />
        </AppContext.Provider>
    );
};

export default Popup;