import * as React from 'react';
import { useStateMachineContext } from './StateMachineContext';
import storeFactory from './logic/storeFactory';
import {
  StateMachineOptions,
  GlobalState,
  AnyCallback,
  AnyActions,
  ActionsOutput,
} from './types';
import { PERSIST_BEFORE_UNLOAD, STORE_ACTION_NAME } from './constants';

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
        storeFactory.options.storageType.removeItem(storeFactory.options.name);
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
    storeFactory.options.persist !== PERSIST_BEFORE_UNLOAD &&
      storeFactory.saveStore();
  };

export function useStateMachine<
  TCallback extends AnyCallback,
  TActions extends AnyActions<TCallback>,
>(
  actions?: TActions,
): {
  actions: ActionsOutput<TCallback, TActions>;
  state: GlobalState;
} {
  const { state, setState } = useStateMachineContext();
  const actionsRef = React.useRef(
    Object.entries(actions || {}).reduce(
      (previous, [key, callback]) =>
        Object.assign({}, previous, {
          [key]: actionTemplate(setState, callback),
        }),
      {} as ActionsOutput<TCallback, TActions>,
    ),
  );

  return {
    actions: actionsRef.current,
    state,
  };
}
