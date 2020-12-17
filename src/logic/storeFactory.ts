import { STORE_DEFAULT_NAME } from '../constants';
import getStoreData from './getBrowserStoreData';
import { MiddleWare, GlobalState } from '../types';

export default class StoreFactory {
  public name: string = STORE_DEFAULT_NAME;
  public storageType: Storage;
  public store: GlobalState | undefined = undefined;
  public middleWares: MiddleWare[] = [];

  constructor(name: string) {
    this.storageType =
      typeof sessionStorage !== 'undefined'
        ? window.sessionStorage
        : ({} as Storage);
    this.name = name;
  }

  updateStore(defaultValues: GlobalState) {
    this.store = getStoreData(this.storageType, this.name) || defaultValues;
  }

  updateMiddleWares(middleWares: MiddleWare[]) {
    return (this.middleWares = middleWares);
  }
}
