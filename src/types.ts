import { PERSIST_OPTION } from './constants';
import * as React from 'react';

export interface GlobalState {}

export type AnyCallback = (state: GlobalState, payload: any) => GlobalState;

export type AnyActions<TCallback> = Record<string, TCallback>;

export type ActionsOutput<
  TCallback extends AnyCallback,
  TActions extends AnyActions<TCallback>,
> = {
  [K in keyof TActions]: (
    payload?: Parameters<TActions[K]>[1],
    options?: { skipRender: boolean },
  ) => void;
};

export type StateMachineContextValue = {
  state: GlobalState;
  setState: React.Dispatch<React.SetStateAction<GlobalState>>;
};

export type MiddleWare = (
  state: GlobalState,
  payload: any,
  callbackName: string,
) => GlobalState;

export type StateMachineOptions = Partial<{
  name: string;
  middleWares: MiddleWare[];
  storageType: Storage;
  persist: typeof PERSIST_OPTION[keyof typeof PERSIST_OPTION];
}>;

declare global {
  interface Window {
    __LSM_NAME__: any;
    __LSM__: any;
    __LSM_DEBUG__: any;
    __LSM_RESET__: any;
    __LSM_GET_STORE__: any;
    __LSM_SAVE_TO__: any;
    __LSM_LOAD__: any;
    __LSM_DEBUG_NAME__: any;
  }
}
