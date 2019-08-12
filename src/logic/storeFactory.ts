import { STORE_DEFAULT_NAME } from '../constants';
import { GetStoreName, GetStore, SetStore, Store, SetStoreName } from '../types';

export default function storeFactory(
  storageType: Storage,
): {
  set: SetStore;
  get: GetStore;
  getName: GetStoreName;
  setName: SetStoreName;
} {
  let storeName = STORE_DEFAULT_NAME;
  let store: Store = {};
  const sessionStorageData = storageType.getItem(storeName);
  try {
    store = sessionStorageData ? JSON.parse(sessionStorageData) : {};
  } catch {}

  const getName = (): string => storeName;

  const setName = (name: string): void => {
    const data = storageType.getItem(name);
    storeName = name;
    try {
      store = data ? JSON.parse(data) : {};
    } catch {}
  };

  const set = <T>(value: T): void => {
    store = value;
  };

  const get = (): Store => store;

  return {
    set,
    get,
    getName,
    setName,
  };
}
