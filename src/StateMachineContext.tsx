import * as React from 'react';
import { Store, UpdateStoreFunction } from './types';

export default React.createContext<{
  store: Store;
  updateStore: UpdateStoreFunction;
}>({
  store: {},
  updateStore: (payload) => payload,
});
