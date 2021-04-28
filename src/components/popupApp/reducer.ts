import sendCommandToTab from "../../helpers/sendCommandToTab";
import { Command } from "../../types/message";

interface DefaultableState {
    loading: boolean;
    hasData: boolean;
    showRadar: boolean;
}

export type State = Readonly<DefaultableState>;

export enum Actions {
    ToggleRadar,
    InitialLoad
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

export type Action = ToggleRadar | InitialLoad;

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
            return { ...state, loading: false, hasData: action.hasData }
        default:
            return state;
    }
}

export const StateDefaults: DefaultableState = ({
    loading: true,
    hasData: false,
    showRadar: false
});