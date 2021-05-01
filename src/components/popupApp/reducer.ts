import { sendCommandToTab, sendCommandToWorker } from "../../helpers/chromeHelpers";
import { Command } from "../../types/message";
import Player from "../../types/player";

export enum Tab {
    Player = "Player",
    Compare = "Compare"
}

interface DefaultableState {
    isOnFbRef: boolean;
    tab: Tab;
    loading: boolean;
    hasData: boolean;
    canCompare: boolean;
    currentPlayer: string | null;
    showRadar: boolean;
    compare: Player[];
    selectedCompare: string[];
    refreshCompare: boolean;
}

export type State = Readonly<DefaultableState>;

export enum Actions {
    SetNotOnFbRef,
    ChangeTab,
    ToggleRadar,
    InitialLoad,
    UpdateCompare,
    ToggleSelected,
    ClearSelected,
    RemovePlayer,
    AddCurrentPlayerToCompare
}

interface BaseAction {
    type: Actions;
}

interface SetNotOnFbRef extends BaseAction {
    type: Actions.SetNotOnFbRef
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
    currentPlayer: string | null;
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

interface AddCurrentPlayerToCompare extends BaseAction {
    type: Actions.AddCurrentPlayerToCompare;
}

export type Action = SetNotOnFbRef |
    ChangeTab |
    ToggleRadar |
    InitialLoad |
    ToggleSelected |
    ClearSelected |
    UpdateCompare |
    RemovePlayer |
    AddCurrentPlayerToCompare;

export function reducer(state: State, action: Action): State {
    console.log('action', action);
    switch (action.type) {
        case Actions.SetNotOnFbRef:
            return { ...state, isOnFbRef: false };
        case Actions.ChangeTab:
            if (action.tab === Tab.Compare) {
            }
            return { ...state, tab: action.tab, refreshCompare: action.tab === Tab.Compare ? true : state.refreshCompare };
        case Actions.ToggleRadar:
            if (action.showRadar) {
                sendCommandToTab({ command: Command.Launch });
            } else {
                sendCommandToTab({ command: Command.Close });
            }
            return { ...state, showRadar: action.showRadar };
        case Actions.InitialLoad:
            return {
                ...state,
                loading: false,
                hasData: action.hasData,
                canCompare: action.hasData,
                currentPlayer: action.currentPlayer,
                tab: action.hasData ? Tab.Player : Tab.Compare
            };
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
            return { ...state, compare: action.players, refreshCompare: false };
        case Actions.RemovePlayer:
            sendCommandToWorker({ command: Command.RemoveFromCompare, id: action.id });
            return {
                ...state,
                selectedCompare: state.selectedCompare.filter(id => id !== action.id),
                compare: state.compare.filter(player => player.id !== action.id)
            };
        case Actions.AddCurrentPlayerToCompare:
            sendCommandToTab({ command: Command.ScrapeDataForCompare });
            return { ...state, canCompare: false };
        default:
            return state;
    }
}

export const StateDefaults: DefaultableState = ({
    isOnFbRef: true,
    tab: Tab.Player,
    loading: true,
    hasData: false,
    canCompare: false,
    currentPlayer: null,
    showRadar: false,
    compare: [],
    selectedCompare: [],
    refreshCompare: true
});