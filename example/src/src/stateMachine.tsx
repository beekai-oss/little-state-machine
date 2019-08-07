import * as React from 'react';
import storeFactory from './storeFactory';
import { STATE_MACHINE_DEBUG_NAME } from './constants';
import { CallbackFunction } from './types';
import { setUpDevTools } from './devTool';
import difference from "./difference";

let options: any;

export const middleWare = (data?: any) => {
  if (data) options = data;
  return options;
};

let storageType =
  typeof window === 'undefined'
    ? { getItem: () => {}, setItem: () => {}, clear: () => {} }
    : window.sessionStorage;
let getStore: any;
let setStore: any;
let getName: any;
let setStorageName;
const isDevMode = process.env.NODE_ENV !== 'production';

export const setStorageType = (type: any) => (storageType = type);

export function createStore(data: any) {
  const methods = storeFactory(storageType);
  setStorageName = methods.setName;
  getName = methods.getName;
  getStore = methods.get;
  setStore = methods.set;
  const result = getStore();

  setUpDevTools(isDevMode, storageType, getName, getStore);

  if (result && Object.keys(result).length) return;
  setStore(data);
}

export const StateMachineContext = React.createContext({
  store: {},
  updateStore: () => {},
});

export function StateMachineProvider(props: any) {
  const [globalState, updateStore] = React.useState(getStore());
  const value = React.useMemo(
    () => ({
      store: globalState,
      updateStore,
    }),
    [globalState],
  );
  return <StateMachineContext.Provider value={value} {...props} />;
}

const actionTemplate = ({
  options,
  callback,
  key,
  updateStore,
}: {
  callback?: any;
  options?: {
    debugName: string | { [key: string]: string };
    shouldReRenderApp?: boolean;
  };
  key?: string;
  updateStore: Function;
}) => (payload: any) => {
  let isDebugOn;
  let storeCopy;

  if (isDevMode) {
    const cloneDeep = require('lodash.clonedeep');
    storeCopy = cloneDeep(getStore());
    isDebugOn = storageType.getItem(STATE_MACHINE_DEBUG_NAME) === 'true';

    if (isDebugOn) {
      console.log('┌───────────────────────────────────────>');
      console.log(
          // @ts-ignore
        `├─%c${key ? options.debugName[key] : options.debugName}`,
        'color: #bada55',
      );
      console.log('├─before:', storeCopy);
    }
  }

  middleWare(options);

  setStore(callback && callback(getStore(), payload));
  storageType.setItem(getName(), JSON.stringify(getStore()));

  // @ts-ignore
  if (options.shouldReRenderApp !== false) {
    updateStore(getStore());
  }

  if (isDevMode) {
    if (isDebugOn) {
      const isEmpty = require('lodash.isempty');
      const diff = difference(getStore(), storeCopy);
      const noChange = isEmpty(diff);

      console.log(noChange ? '└─after' : '├─after:', getStore());

      if (!noChange) {
        console.log(
          '└─diff:',
          difference(storeCopy, getStore()),
          ' → ',
          difference(getStore(), storeCopy),
        );
      }
    }
  }
};

export function useStateMachine(
  updateStoreFunction?: CallbackFunction,
  options?: {
    debugName: string | { [key: string]: string };
    shouldReRenderApp?: boolean;
  },
): {
  action: Function;
  actions: { [key: string]: Function };
  state: Object;
} {
  const { store: globalState, updateStore } = React.useContext(
    StateMachineContext,
  );

  if (updateStoreFunction && Object.keys(updateStoreFunction).length) {
    return {
      actions: updateStoreFunction
        ? Object.entries(updateStoreFunction).reduce(
            (previous, [key, callback]) => {
              // @ts-ignore
              previous[key] = actionTemplate({
                options,
                callback,
                updateStore,
                key,
              });
              return previous;
            },
            {},
          )
        : {},
      action: () => {},
      state: globalState,
    };
  }

  return {
    actions: {},
    action: updateStoreFunction
      ? actionTemplate({
          options,
          callback: updateStoreFunction,
          updateStore,
        })
      : () => {},
    state: globalState,
  };
}

export { setStorageName };
