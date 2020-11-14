export type Store = Record<string, any>;

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export type StoreUpdateFunction<T> = (store: T, payload: DeepPartial<T>) => T;

export type Action<T> = (payload: DeepPartial<T>) => void;

export type Actions<T, K> = Record<keyof K, Action<T>>;

export type ActionArg<T> = (globalStore: T, payload: DeepPartial<T>) => T;

export type ActionsArg<T> = Record<string, ActionArg<T>>;

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
