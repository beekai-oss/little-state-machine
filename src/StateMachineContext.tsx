import * as React from 'react';
import { Store } from './types';

export default React.createContext<{
  store: Store;
  updateStore: any;
}>({
  store: {},
  updateStore: () => {},
});
