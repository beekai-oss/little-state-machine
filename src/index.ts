// @flow
import * as React from 'react';

const sessionStorageData = sessionStorage.getItem('sessionStateMachine');

export let store = sessionStorageData ? JSON.parse(sessionStorageData) : {};

export function createStore(data: any) {
  if (!sessionStorageData) {
    store = data;
  }
}

const StateMachineContext = React.createContext({
  store,
  updateStore: () => {},
});

export const StateMachineProvider = StateMachineContext.Provider;

const actionTemplate = ({ options, callback, key, updateStore, globalState }: any) => (payload: any) => {
  // @ts-ignore
  const debug = sessionStorage.getItem('stateMachineDebug') === 'true';

  if (debug) {
    console.log(`%c${key ? options.debugName[key] : options.debugName}`, 'color: #bada55');
    console.log('├─before:', store);
  }

  store = callback && callback(store, payload);
  sessionStorage.setItem('sessionStateMachine', JSON.stringify(store));

  if (options.shouldReRenderApp !== false) {
    updateStore(store);
  }

  if (debug) {
    console.log('└─after:', store);
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

  // @ts-ignore
  if (!typeof window === 'undefined') {
    // @ts-ignore
    window.STATE_MACHINE_DEBUG = (value: string) => {
      sessionStorage.setItem('stateMachineDebug', value);
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
