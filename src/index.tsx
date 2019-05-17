// @flow
import * as React from 'react';

let storageType = window.sessionStorage;

export function setStorageType(type) {
  storageType = type;
}

function storeFactory() {
  let storeName = 'SESSION_LITTLE_STATE_MACHINE';
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

const { setName: setStorageName, getName, get, set } = storeFactory();

export { setStorageName };

export function createStore(data: any) {
  const result = get();
  if (result && Object.keys(result).length) return;
  set(data);
}

export const StateMachineContext = React.createContext({
  store: {},
  updateStore: () => {},
});

export function StateMachineProvider(props) {
  const [globalState, updateStore] = React.useState(get());
  const value = React.useMemo(
    () => {
      return {
        store: globalState,
        updateStore,
      };
    },
    [globalState],
  );

  return <StateMachineContext.Provider value={value} {...props} />;
}

const actionTemplate = ({ options, callback, key, updateStore }: any) => (payload: any) => {
  let debug;

  if (process.env.NODE_ENV !== 'production') {
    const cloneDeep = require('lodash.clonedeep');
    debug = storageType.getItem('__STATE_MACHINE_DEBUG') === 'true';

    if (debug) {
      console.log(`%c${key ? options.debugName[key] : options.debugName}`, 'color: #bada55');
      console.log('├─before:', cloneDeep(get()));
    }
  }

  set(callback && callback(get(), payload));
  storageType.setItem(getName(), JSON.stringify(get()));

  if (options.shouldReRenderApp !== false) {
    updateStore(get());
  }

  if (process.env.NODE_ENV !== 'production') {
    if (debug) {
      console.log('└─after:', get());
    }
  }
};

export function useStateMachine(
  callbacks?: { [key: string]: (Object, any) => Object } | ((Object, any) => Object),
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
  const { store: globalState, updateStore } = React.useContext(StateMachineContext);

  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.LITTLE_STATE_MACHINE_DEBUG = (value: string) => {
      storageType.setItem('__STATE_MACHINE_DEBUG', value);
    };
  }

  if (callbacks && Object.keys(callbacks).length) {
    return {
      actions: callbacks
        ? Object.entries(callbacks).reduce((previous, [key, callback]) => {
            previous[key] = actionTemplate({ options, callback, updateStore, globalState, key });
            return previous;
          }, {})
        : {},
      action: () => {},
      state: globalState,
    };
  }

  return {
    actions: {},
    action: callbacks ? actionTemplate({ options, callback: callbacks, updateStore, globalState }) : () => {},
    state: globalState,
  };
}
