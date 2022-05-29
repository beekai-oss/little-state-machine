import * as React from 'react';
import storeFactory from './logic/storeFactory';
import { StateMachineContextValue } from './types';

type PropsChildren = {
  children?: React.ReactNode;
};

const StateMachineContext = React.createContext<StateMachineContextValue>(
  undefined as any,
);

export const StateMachineProvider: React.FC<PropsChildren> = ({ children }) => {
  const [state, setState] = React.useState(storeFactory.state);

  React.useEffect(() => {
    if (storeFactory.options.persist === 'beforeUnload') {
      window.onbeforeunload = () => storeFactory.saveStore();
      storeFactory.options.storageType.removeItem(storeFactory.options.name);
    }
  }, []);

  return (
    <StateMachineContext.Provider value={{ state, setState }}>
      {children}
    </StateMachineContext.Provider>
  );
};

export const useStateMachineContext = () =>
  React.useContext<StateMachineContextValue>(StateMachineContext);
