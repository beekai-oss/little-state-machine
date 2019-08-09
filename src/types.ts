export type StoreUpdateFunction = (store: Object, payload: Object) => Object;

export type CallbackFunction =
  | StoreUpdateFunction
  | { [key: string]: StoreUpdateFunction };

export type Action = { debugName: string };

export type Store = Record<string, any>;

export type SetStore = <T>(value: T) => void;

export type GetStore = () => Store;

export type GetStoreName = () => string;

export type SetStoreName = (name: string) => void;
