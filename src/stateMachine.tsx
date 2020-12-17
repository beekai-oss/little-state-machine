import * as React from 'react';
import { useStateMachineContext } from './StateMachineContext';
import storeFactory from './logic/storeFactory';
import { setUpDevTools } from './logic/devTool';
import {
  StateMachineOptions,
  GlobalState,
  AnyCallback,
  AnyActions,
  ActionsOutput,
} from './types';
import { STORE_ACTION_NAME, STORE_DEFAULT_NAME } from './constants';

export function createStore(
  defaultStoreData: GlobalState,
  options: StateMachineOptions = {
    name: STORE_DEFAULT_NAME,
    middleWares: [],
  },
) {
  options.name && (storeFactory.name = options.name);
  options.storageType && (storeFactory.storageType = options.storageType);
  storeFactory.updateMiddleWares(options.middleWares);

  if (process.env.NODE_ENV !== 'production') {
    setUpDevTools(
      storeFactory.storageType,
      storeFactory.name,
      storeFactory.store,
    );
  }

  storeFactory.updateStore(defaultStoreData);
}

function actionTemplate<TCallback extends AnyCallback>(
  updateStore: React.Dispatch<GlobalState>,
  callback: TCallback,
) {
  return (payload: Parameters<TCallback>[1]) => {
    if (process.env.NODE_ENV !== 'production') {
      window[STORE_ACTION_NAME] = callback ? callback.name : '';
    }

    storeFactory.store = callback(storeFactory.store, payload);

    storeFactory.storageType.setItem(
      storeFactory.name,
      JSON.stringify(storeFactory.store),
    );

    if (storeFactory.middleWares.length) {
      storeFactory.store = storeFactory.middleWares.reduce(
        (currentValue, currentFunction) =>
          currentFunction(currentValue) || currentValue,
        storeFactory.store,
      );
    }

    updateStore(storeFactory.store);
  };
}

export function useStateMachine<TCallback extends AnyCallback, TActions extends AnyActions<TCallback>>(
  actions?: TActions,
): {
  actions: ActionsOutput<TCallback, TActions>;
  state: GlobalState;
} {
  const { store, updateStore } = useStateMachineContext();

  return React.useMemo(
    () => ({
      actions: actions
        ? Object.entries(actions).reduce(
            (previous, [key, callback]) =>
              Object.assign({}, previous, {
                [key]: actionTemplate(updateStore, callback),
              }),
            {},
          )
        : ({} as any),
      state: store,
    }),
    [store, actions, updateStore],
  );
}
