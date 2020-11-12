export type Store = Record<string, any>;

export type StoreUpdateFunction<T> = (store: T, payload: any) => T;

export type UpdateStore<T> = { [key: string]: StoreUpdateFunction<T> };

export type Options = {
  shouldReRenderApp?: boolean;
};

export type Action = <T extends object>(payload: T) => void;

export type Actions = { [key: string]: Action };

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
