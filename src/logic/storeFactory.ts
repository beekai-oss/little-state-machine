import { STORE_DEFAULT_NAME } from '../constants';
import getStoreData from './getBrowserStoreData';

export default class StoreFactory<T> {
  private _name: string = STORE_DEFAULT_NAME;
  private _store: T;
  private _storageType: Storage;

  constructor(name: string, isClient: boolean) {
    this._storageType =
      isClient && typeof sessionStorage !== 'undefined'
        ? window.sessionStorage
        : {
            getItem: (payload) => payload,
            setItem: (payload: string) => payload,
            clear: () => {},
            length: 0,
            key: (payload: number) => payload.toString(),
            removeItem: () => {},
          };
    this._name = name;
    this._store = getStoreData(this._storageType, name);
  }

  get name(): string {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }

  get store(): T {
    return getStoreData(this._storageType, name) || this._store;
  }

  set store(value: T) {
    this._store = value;
  }

  set storageType(value: Storage) {
    this._storageType = value;
  }

  get storageType() {
    return this._storageType;
  }
}
