import * as React from 'react';
import { Store } from './types';

export const StateMachineContext = React.createContext<{
  store: Store;
  updateStore: any;
}>({
  store: {},
  updateStore: () => {},
});
