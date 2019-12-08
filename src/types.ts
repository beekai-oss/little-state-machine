export type Store = Record<string, any>;

export type StoreUpdateFunction = <T>(store: T, payload: any) => Partial<Store>;

export type UpdateStore =
  | StoreUpdateFunction
  | { [key: string]: StoreUpdateFunction };

export type UpdateStoreFunction = <T>(payload: T) => T;

export type ActionName = { debugName: string };

export type SetStore = <T>(value: T) => void;

export type GetStore = <T>() => T;

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
