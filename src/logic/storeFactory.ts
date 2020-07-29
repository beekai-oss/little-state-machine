import { STORE_DEFAULT_NAME } from '../constants';
import { GetStoreName, GetStore, SetStore, Store } from '../types';
import getStoreData from './getBrowserStoreData';

export default function storeFactory<T>(
  storageType: Storage,
  name: string | undefined,
): {
  set: SetStore;
  get: GetStore;
  getName: GetStoreName;
} {
  const storeName = name || STORE_DEFAULT_NAME;
  let store: Store = getStoreData(storageType, storeName);

  const getName = (): string => storeName;

  const set = <K>(value: K): void => {
    store = value;
  };

  const get = (): T => store as T;

  return {
    set,
    get,
    getName,
  };
}
