import * as React from 'react';
import storeFactory from './logic/storeFactory';
import isUndefined from './utils/isUndefined';
import { setUpDevTools } from './logic/devTool';
import StateMachineContext from './StateMachineContext';
import getSyncStoreData from './logic/getSyncStoreData';
import { STORE_ACTION_NAME, STORE_DEFAULT_NAME } from './constants';
import {
  UpdateStore,
  GetStore,
  SetStore,
  GetStoreName,
  Store,
  Options,
  Action,
  Actions,
  StoreUpdateFunction,
  StateMachineOptions,
  UpdateStoreFunction,
} from './types';
import { useEffect } from 'react';

const isClient = typeof window !== 'undefined';
const isDevMode: boolean = process.env.NODE_ENV !== 'production';
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
let getStore: GetStore = () => ({} as Store);
let setStore: SetStore = () => {};
let getName: GetStoreName = () => '';
let middleWaresArray: Function[] | undefined = [];

export const middleWare = (data: string = '') => {
  if (data && isClient) {
    // @ts-ignore
    window[STORE_ACTION_NAME] = data;
  }
  return data;
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
  storeFactory<T>(storageType, storeName).then(methods => {
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
  });
}

export function StateMachineProvider<T>(props: T) {
  const [globalState, updateStore] = React.useState<Store>(getStore());

  useEffect(() => {
    updateStore(getStore());
  }, [getStore]);

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
  updateStore: UpdateStoreFunction;
}) => <T extends object>(payload: T): void => {
  let result;
  const debugName = callback ? callback.name : '';

  if (isDevMode) {
    middleWare(debugName);
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
    let pipeData = getStore();

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
          [key]: React.useCallback(
            actionTemplate({
              options,
              callback,
              updateStore,
            }),
            [],
          ),
        }),
        {},
      ),
      action: p => p,
      state: globalState as T,
    };
  }

  return {
    actions: {},
    action: React.useCallback(
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
