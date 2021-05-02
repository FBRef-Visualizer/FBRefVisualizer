import { Context, createContext, Dispatch } from 'react';
import { defaultOptions, Options } from '../../types/options';
import { Action, State, StateDefaults } from './reducer';

export interface AppContextType {
  dispatch: Dispatch<Action>;
  state: State;
  options: Options;
}

export const AppContext: Context<AppContextType> = createContext<AppContextType>({
  dispatch: () => { },
  state: { ...StateDefaults },
  options: defaultOptions
});
