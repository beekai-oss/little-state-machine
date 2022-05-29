import * as React from 'react';
import { useStateMachineContext } from './StateMachineContext';
import storeFactory from './logic/storeFactory';
import {
  StateMachineOptions,
  GlobalState,
  AnyCallback,
  AnyActions,
  ActionsOutput,
  PersistOptions,
} from './types';
import { STORE_ACTION_NAME } from './constants';

export let persistOption: PersistOptions = 'onAction';

export function createStore(
  defaultState: GlobalState,
  options?: StateMachineOptions,
) {
  if (options) {
    options.name && (storeFactory.name = options.name);
    options.storageType && (storeFactory.storageType = options.storageType);
    options.middleWares && (storeFactory.middleWares = options.middleWares);
    options.persist && (persistOption = options.persist);
  }

  if (process.env.NODE_ENV !== 'production') {
    if (typeof window !== 'undefined') {
      window.__LSM_NAME__ = storeFactory.name;
      window.__LSM_RESET__ = () =>
        storeFactory.storageType.removeItem(storeFactory.name);
    }
  }

  storeFactory.updateStore(defaultState);
}

const actionTemplate = <TCallback extends AnyCallback>(
  setState: React.Dispatch<React.SetStateAction<GlobalState>>,
  callback: TCallback,
) => (payload: Parameters<TCallback>[1]) => {
  if (process.env.NODE_ENV !== 'production') {
    window[STORE_ACTION_NAME] = callback.name;
  }

  storeFactory.state = callback(storeFactory.state, payload);

  if (storeFactory.middleWares) {
    storeFactory.state = storeFactory.middleWares.reduce(
      (currentValue, currentFunction) =>
        currentFunction(currentValue, callback.name, payload) || currentValue,
      storeFactory.state,
    );
  }

  setState(storeFactory.state);
  persistOption === 'onAction' && storeFactory.saveStore();
};

export function useStateMachine<
  TCallback extends AnyCallback,
  TActions extends AnyActions<TCallback>
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
