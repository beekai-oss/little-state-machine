export type StoreUpdateFunction = ((store: Object, payload: Object) => Object);

export type CallbackFunction =
  | StoreUpdateFunction
  | { [key: string]: StoreUpdateFunction };
