import { STORE_DEFAULT_NAME } from '../constants';
import { GetStoreName, GetStore, SetStore, Store } from '../types';
import getStoreData from './getStoreData';

export default function storeFactory(
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

  const set = <T>(value: T): void => {
    store = value;
  };

  const get = (): Store => store;

  return {
    set,
    get,
    getName,
  };
}
