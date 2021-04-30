import { sendCommandToTab, sendCommandToWorker } from "../../helpers/sendCommandToTab";
import { Command } from "../../types/message";
import Player from "../../types/player";

export enum Tab {
    Player = "Player",
    Compare = "Compare"
}

interface DefaultableState {
    tab: Tab;
    loading: boolean;
    hasData: boolean;
    showRadar: boolean;
    compare: Player[];
    selectedCompare: string[];
}

export type State = Readonly<DefaultableState>;

export enum Actions {
    ChangeTab,
    ToggleRadar,
    InitialLoad,
    UpdateCompare,
    ToggleSelected,
    ClearSelected,
    RemovePlayer
}

interface BaseAction {
    type: Actions;
}

interface ChangeTab extends BaseAction {
    type: Actions.ChangeTab
    tab: Tab;
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

interface ToggleSelected extends BaseAction {
    type: Actions.ToggleSelected
    action: 'add' | 'remove';
    id: string;
}

interface ClearSelected extends BaseAction {
    type: Actions.ClearSelected;
}

interface RemovePlayer extends BaseAction {
    type: Actions.RemovePlayer;
    id: string;
}

export type Action = ChangeTab | ToggleRadar | InitialLoad | ToggleSelected | ClearSelected | UpdateCompare | RemovePlayer;

export function reducer(state: State, action: Action): State {
    switch (action.type) {
        case Actions.ChangeTab:
            return { ...state, tab: action.tab };
        case Actions.ToggleRadar:
            if (action.showRadar) {
                sendCommandToTab({ command: Command.Launch });
            } else {
                sendCommandToTab({ command: Command.Close });
            }
            return { ...state, showRadar: action.showRadar };
        case Actions.InitialLoad:
            return { ...state, loading: false, hasData: action.hasData };
        case Actions.ToggleSelected:
            if (action.action === 'add') {
                const addArray = [action.id];
                const addPosition = state.compare.filter(p => p.id === action.id)[0].info.position;
                for (let id of state.selectedCompare) {
                    const existingPosition = state.compare.filter(p => p.id === id)[0].info.position;
                    if (existingPosition === addPosition) {
                        addArray.push(id);
                    }
                }
                return { ...state, selectedCompare: addArray };
            } else { // remove
                return { ...state, selectedCompare: state.selectedCompare.filter(id => id !== action.id) };
            }
        case Actions.ClearSelected:
            return { ...state, selectedCompare: [] };
        case Actions.UpdateCompare:
            return { ...state, compare: action.players };
        case Actions.RemovePlayer:
            sendCommandToWorker({ command: Command.RemoveFromCompare, id: action.id });
            return {
                ...state,
                selectedCompare: state.selectedCompare.filter(id => id !== action.id),
                compare: state.compare.filter(player => player.id !== action.id)
            };
        default:
            return state;
    }
}

export const StateDefaults: DefaultableState = ({
    tab: Tab.Compare,
    loading: true,
    hasData: false,
    showRadar: false,
    compare: [],
    selectedCompare: []
});