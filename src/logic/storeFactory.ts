import { STORE_DEFAULT_NAME } from '../constants';
import getStoreData from './getBrowserStoreData';
import { MiddleWare } from '../types';

export default class StoreFactory {
  public name: string = STORE_DEFAULT_NAME;
  public storageType: Storage;
  public store: unknown = undefined;
  public middleWares: MiddleWare[] = [];

  constructor(name: string) {
    this.storageType =
      typeof sessionStorage !== 'undefined'
        ? window.sessionStorage
        : ({} as Storage);
    this.name = name;
  }

  updateStore<T>(defaultValues: T) {
    this.store = getStoreData(this.storageType, this.name) || defaultValues;
  }

  updateMiddleWares(middleWares: MiddleWare[]) {
    return (this.middleWares = middleWares);
  }
}
