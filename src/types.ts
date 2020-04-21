export type Store = Record<string, any>;

export type StoreUpdateFunction = (store: any, payload: any) => Store;

export type UpdateStore =
  | StoreUpdateFunction
  | { [key: string]: StoreUpdateFunction };

export type UpdateStoreFunction = <T>(payload: T) => T;

export type ActionName = { debugName: string };

export type SetStore = <T>(value: T) => void;

export type GetStore = () => Store;

export type GetStoreName = () => string;

export type Options = {
  shouldReRenderApp?: boolean;
};

export type Action = <T>(store: any, payload: T) => T;

export type Actions = { [key: string]: Action };

export type TransformFunc = ({
  externalStoreData,
  currentStoreData,
}: {
  externalStoreData: any;
  currentStoreData: any;
}) => any;

type TransformOptions = {
  externalStoreName: string;
  transform: TransformFunc;
};

export type StateMachineOptions = {
  name: string;
  middleWares?: Function[];
  syncStores?: Record<string, string[]> | TransformOptions | TransformOptions[];
};
