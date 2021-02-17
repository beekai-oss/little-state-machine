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
  defaultState: GlobalState,
  options: StateMachineOptions = {
    name: STORE_DEFAULT_NAME,
    middleWares: [],
  },
) {
  options.name && (storeFactory.name = options.name);
  options.storageType && (storeFactory.storageType = options.storageType);
  options.middleWares && storeFactory.updateMiddleWares(options.middleWares);

  if (process.env.NODE_ENV !== 'production') {
    setUpDevTools(
      storeFactory.storageType,
      storeFactory.name,
      storeFactory.state,
    );
  }

  storeFactory.updateStore(defaultState);
}

function actionTemplate<TCallback extends AnyCallback>(
  setState: React.Dispatch<React.SetStateAction<GlobalState>>,
  callback: TCallback,
) {
  return (payload: Parameters<TCallback>[1]) => {
    if (process.env.NODE_ENV !== 'production') {
      window[STORE_ACTION_NAME] = callback ? callback.name : '';
    }

    storeFactory.state = callback(storeFactory.state, payload);

    storeFactory.storageType.setItem(
      storeFactory.name,
      JSON.stringify(storeFactory.state),
    );

    if (storeFactory.middleWares.length) {
      storeFactory.state = storeFactory.middleWares.reduce(
        (currentValue, currentFunction) =>
          currentFunction(currentValue) || currentValue,
        storeFactory.state,
      );
    }

    setState(storeFactory.state);
  };
}

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

  return React.useMemo(
    () => ({
      actions: actions
        ? Object.entries(actions).reduce(
            (previous, [key, callback]) =>
              Object.assign({}, previous, {
                [key]: actionTemplate(setState, callback),
              }),
            {},
          )
        : ({} as any),
      state,
    }),
    [state, setState, actions],
  );
}
