import { STORE_DEFAULT_NAME } from '../constants';
import { GetStoreName, GetStore, SetStore, Store } from '../types';

export default function storeFactory(
  storageType: Storage,
  name: string | undefined,
): {
  set: SetStore;
  get: GetStore;
  getName: GetStoreName;
} {
  const storeName = name || STORE_DEFAULT_NAME;
  let store: Store = {};
  const sessionStorageData = storageType.getItem(storeName);
  try {
    store = sessionStorageData ? JSON.parse(sessionStorageData) : {};
  } catch {}

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
