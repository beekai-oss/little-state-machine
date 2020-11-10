import * as React from 'react';
import StoreFactory from './logic/storeFactory';
import isUndefined from './utils/isUndefined';
import { setUpDevTools } from './logic/devTool';
import {
  UpdateStore,
  Options,
  Action,
  Actions,
  StoreUpdateFunction,
  StateMachineOptions,
} from './types';
import { STORE_ACTION_NAME, STORE_DEFAULT_NAME } from './constants';

const isClient = typeof window !== 'undefined';

let middleWaresArray: Function[] | undefined = [];

const storeFactory = new StoreFactory(STORE_DEFAULT_NAME, isClient);

export const middleWare = (data: string) => {
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

  middleWaresArray = options.middleWares;

  if (process.env.NODE_ENV !== 'production') {
    setUpDevTools(
      storeFactory.storageType,
      storeFactory.name,
      storeFactory.store,
    );
  }

  storeFactory.store = storeFactory.store || defaultStoreData;
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
  let storeResult = storeFactory.store;
  const debugName = callback ? callback.name : '';

  if (process.env.NODE_ENV !== 'production') {
    middleWare(debugName);
  }

  if (callback) {
    storeResult = callback(storeFactory.store as G, payload);
  }

  storeFactory.store = storeResult;
  storeFactory.storageType.setItem(
    storeFactory.name,
    JSON.stringify(storeFactory.store),
  );

  if (
    isUndefined(options) ||
    (options && options.shouldReRenderApp !== false)
  ) {
    let pipeData = storeFactory.store;

    if (Array.isArray(middleWaresArray) && middleWaresArray.length) {
      pipeData = middleWaresArray.reduce(
        (currentValue, currentFunction) =>
          currentFunction(currentValue) || currentValue,
        pipeData,
      );
    }

    updateStore(pipeData);
  }
};

export function useStateMachine<T>(
  updateStoreFunction?: UpdateStore<T>,
  options?: Options,
): {
  action: Action;
  actions: Actions;
  state: T;
} {
  const { store: globalState, updateStore } = React.useContext(
    StateMachineContext,
  );

  if (updateStoreFunction && Object.keys(updateStoreFunction).length) {
    return {
      actions: Object.entries(updateStoreFunction).reduce(
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
      ),
      action: (p) => p,
      state: globalState as T,
    };
  }

  return {
    actions: {},
    action: React.useCallback(
      updateStoreFunction
        ? actionTemplate<T>({
            options,
            callback: updateStoreFunction as StoreUpdateFunction<T>,
            updateStore,
          })
        : () => {},
      [],
    ),
    state: globalState as T,
  };
}
