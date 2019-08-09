export type Store = Record<string, any>;

export type StoreUpdateFunction = <T, Q>(store: T, payload: Q) => Store;

export type UpdateStore =
  | StoreUpdateFunction
  | { [key: string]: StoreUpdateFunction };

export type ActionName = { debugName: string };

export type SetStore = <T>(value: T) => void;

export type GetStore = () => Store;

export type GetStoreName = () => string;

export type SetStoreName = (name: string) => void;

export type DebugName = string | { [key: string]: string };

export type Options = {
  debugName: DebugName;
  shouldReRenderApp?: boolean;
}

export type Action = (payload: any) => void

export type Actions = { [key: string]: Action };
