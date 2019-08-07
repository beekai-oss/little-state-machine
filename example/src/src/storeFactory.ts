import { STORE_DEFAULT_NAME } from './constants';

export default function storeFactory(storageType: any) {
  let storeName = STORE_DEFAULT_NAME;
  const sessionStorageData = storageType.getItem(storeName);
  let store = sessionStorageData ? JSON.parse(sessionStorageData) : {};

  const getName = () => storeName;

  const setName = (name: string) => {
    const data = storageType.getItem(name);
    storeName = name;
    store = data ? JSON.parse(data) : {};
  };

  const set = (value: any) => {
    store = value;
  };

  const get = () => store;

  return {
    set,
    get,
    getName,
    setName,
  };
}
