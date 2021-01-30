import { STORE_DEFAULT_NAME } from '../constants';
import getStoreData from './getBrowserStoreData';
import { MiddleWare, GlobalState } from '../types';

class StoreFactory {
  public storageType: Storage;
  public state: GlobalState = {};
  public middleWares: MiddleWare[] = [];

  constructor(public name = STORE_DEFAULT_NAME) {
    try {
      this.storageType =
        typeof sessionStorage !== 'undefined'
          ? window.sessionStorage
          : ({} as Storage);
    } catch {
      this.storageType = {} as Storage;
    }
  }

  updateStore(defaultValues: GlobalState) {
    this.state = getStoreData(this.storageType, this.name) || defaultValues;
  }

  updateMiddleWares(middleWares: MiddleWare[]) {
    return (this.middleWares = middleWares);
  }
}

export default new StoreFactory();
