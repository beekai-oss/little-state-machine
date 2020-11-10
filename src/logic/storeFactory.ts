import { STORE_DEFAULT_NAME } from '../constants';
import getStoreData from './getBrowserStoreData';

export default class StoreFactory<T> {
  private _name: string = STORE_DEFAULT_NAME;
  private _store: T;
  storageType: Storage;

  constructor(storageType: Storage, name:string) {
    this.storageType = storageType;
    this._name = name;
    this._store = getStoreData(storageType, name);
  }

  get name(): string {
    return this._name;
  }

  set name(value) {
    this._name = value;
  }

  get store(): T {
    return getStoreData(this.storageType, name) || this._store;
  }

  set store(value: T) {
    this._store = value;
  }
}
