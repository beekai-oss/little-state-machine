export interface GlobalState {};

export type AnyCallback = (state: GlobalState, payload: any) => GlobalState

export type AnyActions<TCallback> = Record<string, TCallback>;

export type ActionsOutput<TCallback extends AnyCallback, TActions extends AnyActions<TCallback>> = {
  [K in keyof TActions]: (payload: Parameters<TActions[K]>[1]) => void;
}

export type StateMachineContextValue = {
  store: GlobalState;
  updateStore: React.Dispatch<React.SetStateAction<GlobalState>>
};

export type MiddleWare = <T>(arg: T) => T;

export type StateMachineOptions = {
  name: string;
  middleWares: MiddleWare[];
  storageType?: Storage;
};

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
