import * as React from 'react';
import storeFactory from './logic/storeFactory';
import isUndefined from './utils/isUndefined';
import { STATE_MACHINE_DEBUG_NAME, STORE_DEFAULT_NAME } from './constants';
import { setUpDevTools } from './logic/devTool';
import StateMachineContext from './StateMachineContext';
import { logEndAction, logStartAction } from './logic/devToolLogger';
import getSyncStoreData from './logic/getSyncStoreData';
import {
  UpdateStore,
  ActionName,
  GetStore,
  SetStore,
  GetStoreName,
  Store,
  Options,
  Action,
  Actions,
  UpdateStoreFunction,
  StoreUpdateFunction,
  StateMachineOptions,
} from './types';

const { useCallback } = React;
const isClient = typeof window !== 'undefined';
const isDevMode: boolean = process.env.NODE_ENV !== 'production';
let action: ActionName;
let storageType: Storage = isClient
  ? window.sessionStorage
  : {
      getItem: payload => payload,
      setItem: (payload: string) => payload,
      clear: () => {},
      length: 0,
      key: (payload: number) => payload.toString(),
      removeItem: () => {},
    };
let getStore: GetStore;
let setStore: SetStore;
let getName: GetStoreName;
let middleWaresArray: Function[] | undefined = [];

export const middleWare = (data?: ActionName): ActionName => {
  if (data) action = data;
  return action;
};

export function setStorageType(type: Storage): void {
  storageType = type;
}

export function createStore<T extends Store = Store>(
  defaultStoreData: T,
  options: StateMachineOptions = {
    name: STORE_DEFAULT_NAME,
    middleWares: [],
    syncStores: undefined,
  },
) {
  const storeName = options ? options.name : STORE_DEFAULT_NAME;
  const methods = storeFactory<T>(storageType, storeName);

  if (isDevMode && isClient) {
    // @ts-ignore
    window['STATE_MACHINE_NAME'] = storeName;
  }

  getName = methods.getName;
  getStore = methods.get;
  setStore = methods.set;
  middleWaresArray = options.middleWares;

  setUpDevTools(isDevMode, storageType, getName, getStore);

  setStore(
    getSyncStoreData(getStore() || defaultStoreData, options, storageType),
  );
}

export function StateMachineProvider<T>(props: T) {
  const [globalState, updateStore] = React.useState<Store>(getStore());
  const value = React.useMemo(
    () => ({
      store: globalState,
      updateStore,
    }),
    [globalState],
  );
  // @ts-ignore
  return <StateMachineContext.Provider value={value} {...props} />;
}

const actionTemplate = ({
  options,
  callback,
  updateStore,
}: {
  callback?: StoreUpdateFunction;
  options?: Options;
  key?: string;
  updateStore: UpdateStoreFunction;
}) => (payload: any) => {
  let isDebugOn;
  let storeCopy;
  let result;
  const debugName = callback ? callback.name : '';

  if (isDevMode) {
    isDebugOn = storageType.getItem(STATE_MACHINE_DEBUG_NAME) === 'true';
    if (isDebugOn) {
      storeCopy = logStartAction({ debugName, getStore });
    }
    middleWare({ debugName });
  }

  if (callback) {
    result = callback(getStore(), payload);
  }

  setStore(isUndefined(result) ? getStore() : result);
  storageType.setItem(getName(), JSON.stringify(getStore()));

  if (
    isUndefined(options) ||
    (options && options.shouldReRenderApp !== false)
  ) {
    const storeData = getStore();
    let pipeData;
    if (Array.isArray(middleWaresArray) && middleWaresArray.length) {
      pipeData = middleWaresArray.reduce((currentValue, currentFunction) => {
        return currentFunction(currentValue);
      }, storeData);
    }
    updateStore(pipeData);
  }

  if (isDevMode && isDebugOn) {
    logEndAction({
      getStore,
      storeCopy,
    });
  }
};

export function useStateMachine<T extends Store = Store>(
  updateStoreFunction?: UpdateStore,
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
          [key]: useCallback(
            actionTemplate({
              options,
              callback,
              updateStore,
              key,
            }),
            [],
          ),
        }),
        {},
      ),
      action: () => {},
      state: globalState as T,
    };
  }

  return {
    actions: {},
    action: useCallback(
      updateStoreFunction
        ? actionTemplate({
            options,
            callback: updateStoreFunction as StoreUpdateFunction,
            updateStore,
          })
        : () => {},
      [],
    ),
    state: globalState as T,
  };
}
