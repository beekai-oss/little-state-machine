import * as React from 'react';
import storeFactory from './logic/storeFactory';
import {
  StateMachineOptions,
  GlobalState,
  AnyCallback,
  AnyActions,
  ActionsOutput,
} from './types';
import { PERSIST_OPTION, STORE_ACTION_NAME } from './constants';

export function createStore(
  defaultState: GlobalState,
  options?: StateMachineOptions,
) {
  if (options) {
    storeFactory.options = {
      ...storeFactory.options,
      ...options,
    };
  }

  if (process.env.NODE_ENV !== 'production') {
    if (typeof window !== 'undefined') {
      window.__LSM_NAME__ = storeFactory.options.name;
      window.__LSM_RESET__ = () =>
        storeFactory.options.storageType &&
        storeFactory.options.storageType.removeItem(storeFactory.options.name!);
    }
  }

  storeFactory.updateStore(defaultState);
}

const actionTemplate =
  <TCallback extends AnyCallback>(
    setState: React.Dispatch<React.SetStateAction<GlobalState>>,
    callback: TCallback,
  ) =>
  (payload: Parameters<TCallback>[1], options?: { skipRender: boolean }) => {
    if (process.env.NODE_ENV !== 'production') {
      window[STORE_ACTION_NAME] = callback.name;
    }

    storeFactory.state = callback(storeFactory.state, payload);

    if (storeFactory.options.middleWares) {
      storeFactory.state = storeFactory.options.middleWares.reduce(
        (currentValue, currentFunction) =>
          currentFunction(currentValue, callback.name, payload) || currentValue,
        storeFactory.state,
      );
    }

    (!options || !options.skipRender) && setState(storeFactory.state);

    if (storeFactory.options.persist === PERSIST_OPTION.ACTION) {
      storeFactory.saveStore();
    }
  };

export function useStateMachine<
  TCallback extends AnyCallback,
  TActions extends AnyActions<TCallback>,
  TStore,
>({
  actions,
  selector,
}: {
  actions?: TActions;
  selector?: ((payload: TStore) => TStore) | undefined;
} = {}): {
  actions: ActionsOutput<TCallback, TActions>;
  state: GlobalState;
  getState: () => GlobalState;
} {
  const actionsRef = React.useRef(
    Object.entries(actions || {}).reduce(
      (previous, [key, callback]) =>
        Object.assign({}, previous, {
          [key]: actionTemplate(storeFactory.setState, callback),
        }),
      {} as ActionsOutput<TCallback, TActions>,
    ),
  );

  const selectorRef = React.useRef(selector);
  const previousSelectedStateRef = React.useRef<TStore | undefined>(undefined);

  const getSnapshot = React.useCallback(() => {
    const currentStore = storeFactory.getState();

    if (!selectorRef.current) return currentStore;

    const newSelectedState = selectorRef.current(currentStore as TStore);

    const selectedStateHasChanged =
      JSON.stringify(previousSelectedStateRef.current) !==
      JSON.stringify(newSelectedState);

    if (selectedStateHasChanged) {
      previousSelectedStateRef.current = newSelectedState;
    }

    return previousSelectedStateRef.current;
  }, []);

  React.useSyncExternalStore(
    storeFactory.subscribe,
    getSnapshot,
    () => undefined,
  );

  return {
    actions: actionsRef.current,
    state: storeFactory.state,
    getState: React.useCallback(() => storeFactory.state, []),
  };
}
