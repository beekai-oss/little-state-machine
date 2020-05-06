export type Store = Record<string, any>;

export type StoreUpdateFunction = (store: any, payload: any) => Store;

export type UpdateStore =
  | StoreUpdateFunction
  | { [key: string]: StoreUpdateFunction };

export type UpdateStoreFunction = <T>(payload: T) => T;

export type SetStore = <T>(value: T) => void;

export type GetStore = () => Store;

export type GetStoreName = () => string;

export type Options = {
  shouldReRenderApp?: boolean;
};

export type Action = <T extends object>(payload: T) => void;

export type Actions = { [key: string]: Action };

export type TransformFunc = <Store extends object, T extends object>({
  externalStoreData,
  currentStoreData,
}: {
  externalStoreData: Store;
  currentStoreData: T;
}) => Store;

type TransformOptions = {
  externalStoreName: string;
  transform: TransformFunc;
};

export type StateMachineOptions = {
  name: string;
  middleWares?: Function[];
  syncStores?: Record<string, string[]> | TransformOptions | TransformOptions[];
};
