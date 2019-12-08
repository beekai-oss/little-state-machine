import * as React from 'react';
import storeFactory from './logic/storeFactory';
import { STATE_MACHINE_DEBUG_NAME, STORE_DEFAULT_NAME } from './constants';
import { setUpDevTools } from './logic/devTool';
import StateMachineContext from './StateMachineContext';
import { logEndAction, logStartAction } from './logic/devToolLogger';
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
} from './types';

let action: ActionName;
let storageType: Storage =
  typeof window === 'undefined'
    ? {
        getItem: payload => payload,
        setItem: (payload: string) => payload,
        clear: () => {},
        length: 0,
        key: (payload: number) => payload.toString(),
        removeItem: () => {},
      }
    : window.sessionStorage;
let getStore: GetStore;
let setStore: SetStore;
let getName: GetStoreName;
let middleWaresBucket: Function[] = [];
const isDevMode: boolean = process.env.NODE_ENV !== 'production';

export const middleWare = (data?: ActionName): ActionName => {
  if (data) action = data;
  return action;
};

export function setStorageType(type: Storage): void {
  storageType = type;
}

export function createStore<T extends Store = Store>(
  data: T,
  options: { name: string; middleWares: Function[] } = {
    name: STORE_DEFAULT_NAME,
    middleWares: [],
  },
) {
  const storeName = options ? options.name : STORE_DEFAULT_NAME;
  const methods = storeFactory<T>(storageType, storeName);

  if (isDevMode) {
    // @ts-ignore
    window['STATE_MACHINE_NAME'] = storeName;
  }

  getName = methods.getName;
  getStore = methods.get;
  setStore = methods.set;
  middleWaresBucket = options.middleWares;
  const result: T = getStore();

  setUpDevTools(isDevMode, storageType, getName, getStore);

  if (result && Object.keys(result).length) return;
  setStore(data);
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
  key,
  updateStore,
}: {
  callback?: StoreUpdateFunction;
  options?: Options;
  key?: string;
  updateStore: UpdateStoreFunction;
}) => (payload: any) => {
  let isDebugOn;
  let storeCopy;
  const debugName: string | undefined =
    options && (options.debugName || options.debugNames)
      ? key && options.debugNames
        ? options.debugNames[key]
        : options.debugName
      : '';

  if (isDevMode) {
    isDebugOn = storageType.getItem(STATE_MACHINE_DEBUG_NAME) === 'true';
    if (isDebugOn) {
      storeCopy = logStartAction({ debugName: debugName || '', getStore });
    }
    middleWare({ debugName: debugName || '' });
  }

  setStore(callback && callback(getStore(), payload));
  storageType.setItem(getName(), JSON.stringify(getStore()));

  if (
    options === undefined ||
    (options && options.shouldReRenderApp !== false)
  ) {
    updateStore(
      middleWaresBucket.length
        ? middleWaresBucket.forEach(callback => {
            callback(getStore());
          })
        : getStore(),
    );
  }

  if (isDevMode && isDebugOn) {
    logEndAction({
      getStore,
      storeCopy,
    });
  }
};

export function useStateMachine<T>(
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
      actions: updateStoreFunction
        ? Object.entries(updateStoreFunction).reduce(
            (previous, [key, callback]) => ({
              ...previous,
              [key]: actionTemplate({
                options,
                callback,
                updateStore,
                key,
              }),
            }),
            {},
          )
        : {},
      action: () => {},
      state: globalState as T,
    };
  }

  return {
    actions: {},
    action: updateStoreFunction
      ? actionTemplate({
          options,
          callback: updateStoreFunction as StoreUpdateFunction,
          updateStore,
        })
      : () => {},
    state: globalState as T,
  };
}
