export type Store = Record<string, any>;

export type StoreUpdateFunction = <T, Q>(store: T, payload: Q) => Store;

export type UpdateStore =
  | StoreUpdateFunction
  | { [key: string]: StoreUpdateFunction };

export type UpdateStoreFunction = <T>(payload: T) => T;

export type ActionName = { debugName: string };

export type SetStore = <T>(value: T) => void;

export type GetStore = () => Store;

export type GetStoreName = () => string;

export type DebugName = string;

export type DebugNames = { [key: string]: string };

export type Options = {
  debugName?: DebugName;
  debugNames?: DebugNames;
  shouldReRenderApp?: boolean;
}

export type Action = (payload: any) => void

export type Actions = { [key: string]: Action };

export type StateMachineOptions = {
  name: string;
  middleWares?: Function[];
  syncStores?: Record<string, string[]> | Function | undefined;
}
