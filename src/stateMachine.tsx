import * as React from 'react';
import StoreFactory from './logic/storeFactory';
import { setUpDevTools } from './logic/devTool';
import {
  UpdateStore,
  Options,
  Actions,
  StoreUpdateFunction,
  StateMachineOptions,
} from './types';
import { STORE_ACTION_NAME, STORE_DEFAULT_NAME } from './constants';

const isClient = typeof window !== 'undefined';
const storeFactory = new StoreFactory(STORE_DEFAULT_NAME, isClient);

export const middleWare = <T extends unknown>(data: T): T => {
  if (data && isClient) {
    window[STORE_ACTION_NAME] = data;
  }
  return data;
};

export function createStore<T>(
  defaultStoreData: T,
  options: StateMachineOptions = {
    name: STORE_DEFAULT_NAME,
  },
) {
  options.name && (storeFactory.name = options.name);
  options.storageType && (storeFactory.storageType = options.storageType);

  if (process.env.NODE_ENV !== 'production' && isClient) {
    window[STORE_DEFAULT_NAME] = storeFactory.name;
  }

  if (options.middleWares) {
    storeFactory.middleWares = options.middleWares;
  }

  if (process.env.NODE_ENV !== 'production') {
    setUpDevTools(
      storeFactory.storageType,
      storeFactory.name,
      storeFactory.store,
    );
  }

  storeFactory.updateStore(defaultStoreData);
}

const StateMachineContext = React.createContext({
  store: storeFactory.store,
  updateStore: (payload: unknown) => payload,
});

export function StateMachineProvider<T>(props: T) {
  const [globalState, updateStore] = React.useState(storeFactory.store);
  const value = React.useMemo(
    () => ({
      store: globalState,
      updateStore,
    }),
    [globalState],
  );

  return <StateMachineContext.Provider value={value} {...props} />;
}

const actionTemplate = <G extends unknown>({
  options,
  callback,
  updateStore,
}: {
  callback?: StoreUpdateFunction<G>;
  options?: Options;
  updateStore: React.Dispatch<unknown>;
}) => <K extends unknown>(payload: K): void => {
  if (process.env.NODE_ENV !== 'production') {
    const debugName = callback ? callback.name : '';
    middleWare(debugName);
  }

  if (callback) {
    storeFactory.store = callback(storeFactory.store as G, payload);
  }

  storeFactory.storageType.setItem(
    storeFactory.name,
    JSON.stringify(storeFactory.store),
  );

  if (storeFactory.middleWares.length) {
    storeFactory.store = storeFactory.middleWares.reduce(
      (currentValue, currentFunction) =>
        currentFunction(currentValue) || currentValue,
      storeFactory.store,
    );
  }

  !options && updateStore(storeFactory.store);
};

export function useStateMachine<T>(
  updateStoreFunction?: UpdateStore<T>,
  options?: Options,
): {
  actions: Actions;
  state: T;
} {
  const { store: globalState, updateStore } = React.useContext(
    StateMachineContext,
  );

  return {
    actions: updateStoreFunction
      ? Object.entries(updateStoreFunction).reduce(
          (previous, [key, callback]) => ({
            ...previous,
            [key]: React.useCallback(
              actionTemplate<T>({
                options,
                callback,
                updateStore,
              }),
              [],
            ),
          }),
          {},
        )
      : {},
    state: globalState as T,
  };
}
