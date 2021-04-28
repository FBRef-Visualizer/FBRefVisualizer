import { Context, createContext, Dispatch } from "react";
import { Action, State, StateDefaults } from "./reducer";

export interface AppContextType {
    dispatch: Dispatch<Action>;
    state: State;
}

export const AppContext: Context<AppContextType> = createContext<AppContextType>({
    dispatch: () => { },
    state: { ...StateDefaults }
});