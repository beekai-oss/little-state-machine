export type Store = Record<string, any>;

export type StoreUpdateFunction<T> = (store: T, payload: any) => T;

export type UpdateStore<T> =
  | StoreUpdateFunction<T>
  | { [key: string]: StoreUpdateFunction<T> };

export type Options = {
  shouldReRenderApp?: boolean;
};

export type Action = <T extends object>(payload: T) => void;

export type Actions = { [key: string]: Action };

export type StateMachineOptions = Partial<{
  name: string;
  middleWares?: Function[];
  storageType: Storage;
}>;

declare global {
  interface Window {
    __LSM_NAME__: any;
    __LSM__: any;
    STATE_MACHINE_DEBUG: any;
    STATE_MACHINE_RESET: any;
    STATE_MACHINE_GET_STORE: any;
    STATE_MACHINE_SAVE_TO: any;
    STATE_MACHINE_LOAD: any;
    STATE_MACHINE_DEBUG_NAME: any;
  }
}
