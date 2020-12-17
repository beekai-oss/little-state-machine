import * as React from 'react';
import storeFactory from './logic/storeFactory';
import { StateMachineContextValue } from './types';

const StateMachineContext = React.createContext<StateMachineContextValue>(undefined as any);

export const StateMachineProvider: React.FC = ({ children }) => {
  const [globalState, setGlobalState] = React.useState(storeFactory.state);

  return (
    <StateMachineContext.Provider
      value={{ globalState, setGlobalState }}
    >
      { children }
    </StateMachineContext.Provider>
  );
}

export function useStateMachineContext() {
  const value = React.useContext<StateMachineContextValue>(StateMachineContext);

  if (process.env.NODE_ENV !== 'production') {
    if (!!value) {
      console.error(`StateMachine context is undefined, please verify you are calling useStateMachineContext() as child of a <StateMachineProvider> component.`)
    }
  }

  return value;
}