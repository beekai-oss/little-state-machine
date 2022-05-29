import * as React from 'react';
import storeFactory from './logic/storeFactory';
import { StateMachineContextValue } from './types';
import { persistOption } from './stateMachine';

type PropsChildren = {
  children?: React.ReactNode;
};

const StateMachineContext = React.createContext<StateMachineContextValue>(
  undefined as any,
);

export const StateMachineProvider: React.FC<PropsChildren> = ({ children }) => {
  const [state, setState] = React.useState(storeFactory.state);

  React.useEffect(() => {
    debugger;
    if (persistOption === 'beforeUnload') {
      window.onbeforeunload = () => storeFactory.saveStore();
      storeFactory.storageType.removeItem(storeFactory.name);
    }
  }, [persistOption]);

  return (
    <StateMachineContext.Provider value={{ state, setState }}>
      {children}
    </StateMachineContext.Provider>
  );
};

export function useStateMachineContext() {
  const value = React.useContext<StateMachineContextValue>(StateMachineContext);

  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      console.error(`LSM context is undefined.`);
    }
  }

  return value;
}
