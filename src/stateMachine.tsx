import * as React from 'react';
import storeFactory from './storeFactory';
import { STATE_MACHINE_DEBUG_NAME } from './constants';
import { CallbackFunction } from './types';
import { setUpDevTools } from './devTool';

let storageType =
  typeof window === 'undefined'
    ? { getItem: () => {}, setItem: () => {}, clear: () => {} }
    : window.sessionStorage;
let getStore;
let setStore;
let getName;
let setStorageName;
const isDevMode = process.env.NODE_ENV !== 'production';

export function setStorageType(type) {
  storageType = type;
}

export function createStore(data: any) {
  const methods = storeFactory(storageType);
  setStorageName = methods.setName;
  getName = methods.getName;
  getStore = methods.get;
  setStore = methods.set;
  const result = getStore();

  setUpDevTools(isDevMode, storageType, getName);

  if (result && Object.keys(result).length) return;
  setStore(data);
}

export const StateMachineContext = React.createContext({
  store: {},
  updateStore: () => {},
});

export function StateMachineProvider(props: any) {
  const [globalState, updateStore] = React.useState(getStore());
  const value = React.useMemo(() => {
    return {
      store: globalState,
      updateStore,
    };
  }, [globalState]);

  return <StateMachineContext.Provider value={value} {...props} />;
}

const actionTemplate = ({
  options,
  callback,
  key,
  updateStore,
}: {
  callback?: any;
  options: {
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
        `├─%c${key ? options.debugName[key] : options.debugName}`,
        'color: #bada55',
      );
      console.log('├─before:', storeCopy);
    }
  }

  setStore(callback && callback(getStore(), payload));
  storageType.setItem(getName(), JSON.stringify(getStore()));

  if (options.shouldReRenderApp !== false) {
    updateStore(getStore());
  }

  if (isDevMode) {
    if (isDebugOn) {
      const transform = require('lodash.transform');
      const isEqual = require('lodash.isequal');
      const isObject = require('lodash.isobject');
      const isEmpty = require('lodash.isempty');
      const diff = difference(getStore(), storeCopy);
      const noChange = isEmpty(diff);

      console.log(noChange ? '└─after' : '├─after:', getStore());
      function difference(object, base) {
        function changes(object, base) {
          return transform(object, function(result, value, key) {
            if (!isEqual(value, base[key])) {
              result[key] =
                isObject(value) && isObject(base[key])
                  ? changes(value, base[key])
                  : value;
            }
          });
        }
        return changes(object, base);
      }

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
  options: {
    debugName: string | { [key: string]: string };
    shouldReRenderApp?: boolean;
  } = {
    debugName: '',
    shouldReRenderApp: true,
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
