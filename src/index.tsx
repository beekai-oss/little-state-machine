// @flow
import * as React from 'react';

let storageType =
  typeof window === 'undefined'
    ? { getItem: () => {}, setItem: () => {}, clear: () => {} }
    : window.sessionStorage;
let get;
let set;
let getName;
let setStorageName;

const STATE_MACHINE_DEBUG_NAME = '__STATE_MACHINE_DEBUG__';

export function setStorageType(type) {
  storageType = type;
}

function storeFactory() {
  let storeName = '__LITTLE_STATE_MACHINE__';
  const sessionStorageData = storageType.getItem(storeName);
  let store = sessionStorageData ? JSON.parse(sessionStorageData) : {};

  const getName = () => storeName;

  const setName = name => {
    const data = storageType.getItem(name);
    storeName = name;
    store = data ? JSON.parse(data) : {};
  };

  const set = value => {
    store = value;
  };

  const get = () => store;

  return {
    set,
    get,
    getName,
    setName,
  };
}

export function createStore(data: any) {
  const factoryResult = storeFactory();
  setStorageName = factoryResult.setName;
  getName = factoryResult.getName;
  get = factoryResult.get;
  set = factoryResult.set;

  const result = get();
  if (result && Object.keys(result).length) return;
  set(data);
}

export { setStorageName };

export const StateMachineContext = React.createContext({
  store: {},
  updateStore: () => {},
});

export function StateMachineProvider(props) {
  const [globalState, updateStore] = React.useState(get());
  const value = React.useMemo(() => {
    return {
      store: globalState,
      updateStore,
    };
  }, [globalState]);

  return <StateMachineContext.Provider value={value} {...props} />;
}

const actionTemplate = ({ options, callback, key, updateStore }: any) => (
  payload: any,
) => {
  let debug;
  let copy;

  if (process.env.NODE_ENV !== 'production') {
    const cloneDeep = require('lodash.clonedeep');
    copy = cloneDeep(get());
    debug = storageType.getItem(STATE_MACHINE_DEBUG_NAME) === 'true';

    if (debug) {
      console.log(
        '┌───────────────────────────────────────',
      );
      console.log(
        `├─%c${key ? options.debugName[key] : options.debugName}`,
        'color: #bada55',
      );
      console.log('├─before:', copy);
    }
  }

  set(callback && callback(get(), payload));
  storageType.setItem(getName(), JSON.stringify(get()));

  if (options.shouldReRenderApp !== false) {
    updateStore(get());
  }

  if (process.env.NODE_ENV !== 'production') {
    if (debug) {
      const transform = require('lodash.transform');
      const isEqual = require('lodash.isequal');
      const isObject = require('lodash.isobject');
      const isEmpty = require('lodash.isempty');
      const diff = difference(get(), copy);
      const noChange = isEmpty(diff);

      console.log(noChange ? '└─after' : '├─after:', get());
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
        console.log('└─diff:', difference(copy, get()), ' → ', difference(get(), copy));
      }
    }
  }
};

export function useStateMachine(
  callbacks?:
    | { [key: string]: (Object, any) => Object }
    | ((Object, any) => Object),
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

  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.LITTLE_STATE_MACHINE_DEBUG = (value: string) => {
      storageType.setItem(STATE_MACHINE_DEBUG_NAME, value);
    };
    // @ts-ignore
    window.LITTLE_STATE_MACHINE_RESET = () => {
      storageType.clear();
    };
    // @ts-ignore
    window.LITTLE_STATE_MACHINE_GET = () => {
      storageType.getItem(getName());
    };
  }

  if (callbacks && Object.keys(callbacks).length) {
    return {
      actions: callbacks
        ? Object.entries(callbacks).reduce((previous, [key, callback]) => {
            previous[key] = actionTemplate({
              options,
              callback,
              updateStore,
              globalState,
              key,
            });
            return previous;
          }, {})
        : {},
      action: () => {},
      state: globalState,
    };
  }

  return {
    actions: {},
    action: callbacks
      ? actionTemplate({
          options,
          callback: callbacks,
          updateStore,
          globalState,
        })
      : () => {},
    state: globalState,
  };
}
