import { STORE_DEFAULT_NAME } from '../constants';
import { GetStoreName, GetStore, SetStore } from '../types';

export default function storeFactory<T>(
  storageType: Storage,
  name: string | undefined,
): {
  set: SetStore;
  get: GetStore;
  getName: GetStoreName;
} {
  const storeName = name || STORE_DEFAULT_NAME;
  let store: T = {} as T;
  const sessionStorageData = storageType.getItem(storeName);
  try {
    store = sessionStorageData ? JSON.parse(sessionStorageData) : {};
  } catch {}

  const getName = (): string => storeName;

  const set = <K>(value: K): void => {
    // @ts-ignore
    store = value;
  };

  // @ts-ignore
  const get = <T>(): T => store;

  return {
    set,
    get,
    getName,
  };
}
