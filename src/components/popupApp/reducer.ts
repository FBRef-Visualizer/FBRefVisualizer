import { sendCommandToTab } from "../../helpers/sendCommandToTab";
import { Command } from "../../types/message";
import Player from "../../types/player";

interface DefaultableState {
    loading: boolean;
    hasData: boolean;
    showRadar: boolean;
    compare: Player[];
}

export type State = Readonly<DefaultableState>;


export enum Actions {
    ToggleRadar,
    InitialLoad,
    UpdateCompare
}

interface BaseAction {
    type: Actions;
}

interface ToggleRadar extends BaseAction {
    type: Actions.ToggleRadar
    showRadar: boolean;
}

interface InitialLoad extends BaseAction {
    type: Actions.InitialLoad
    hasData: boolean;
}

interface UpdateCompare extends BaseAction {
    type: Actions.UpdateCompare
    players: Player[];
}

export type Action = ToggleRadar | InitialLoad | UpdateCompare;

export function reducer(state: State, action: Action): State {
    switch (action.type) {
        case Actions.ToggleRadar:
            if (action.showRadar) {
                sendCommandToTab({ command: Command.Launch });
            } else {
                sendCommandToTab({ command: Command.Close });
            }
            return { ...state, showRadar: action.showRadar };
        case Actions.InitialLoad:
            return { ...state, loading: false, hasData: action.hasData };
        case Actions.UpdateCompare:
            return { ...state, compare: action.players };
        default:
            return state;
    }
}

export const StateDefaults: DefaultableState = ({
    loading: true,
    hasData: false,
    showRadar: false,
    compare: []
});