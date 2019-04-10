// @flow
import React, { useContext } from 'react';
import objectDifference from './utilities/objectDifference';

const sessionStorageData = sessionStorage.getItem('sessionStateMachine');

export let store = sessionStorageData ? JSON.parse(sessionStorageData) : {};

export function createStore(data: any) {
  if (!sessionStorageData) {
    store = data;
  }
}

export const StateMachineContext = React.createContext<{
  store: Object,
  updateStore: any => void,
}>({
  store,
  updateStore: () => {},
});

export const StateMachineProvider = StateMachineContext.Provider;

const actionTemplate = ({ options, callback, key, updateStore, globalState }: any) => (payload: any) => {
  sessionStorage.setItem('stateMachineDebug', window.STATE_MACHINE);
  const debug = sessionStorage.getItem('stateMachineDebug') === 'true';

  if (debug) {
    console.log(`%c${key ? options.debugName[key] : options.debugName}`, 'color: #bada55');
    console.log('├─before:', store);
  }

  store = callback && callback(store, payload);
  sessionStorage.setItem('sessionStateMachine', JSON.stringify(store));

  if (options.isGlobal !== false) {
    updateStore(store);
  }

  if (debug) {
    console.log('├─after:', store);
    console.log('└─diff:', objectDifference(globalState, store));
  }
};

export function useStateMachine(
  callbacks?: { [key: string]: (Object, any) => Object } | ((Object, any) => Object),
  options?: {
    debugName: string | { [key: string]: string },
    isGlobal?: boolean,
  } = {
    debugName: '',
    isGlobal: true,
    name: '',
  },
): {
  action: Function,
  actions: { [key: string]: Function },
  state: Object,
} {
  const { store: globalState, updateStore } = useContext(StateMachineContext);

  if (callbacks && Object.keys(callbacks).length) {
    return {
      actions: callbacks
        ? Object.entries(callbacks).reduce((previous, [key, callback]) => {
            previous[key] = actionTemplate({ options, callback, updateStore, globalState, key });
            return previous;
          }, {})
        : {},
      action: '',
      state: globalState,
    };
  }

  return {
    actions: {},
    action: callbacks ? actionTemplate({ options, callback: callbacks, updateStore, globalState }) : '',
    state: globalState,
  };
}
