import { STORE_DEFAULT_NAME } from '../constants';
import { MiddleWare, GlobalState } from '../types';

function StoreFactory() {
  let storageType: Storage;
  let state: GlobalState = {};
  let middleWares: MiddleWare[] = [];
  let name = STORE_DEFAULT_NAME;

  try {
    storageType =
      typeof sessionStorage !== 'undefined'
        ? window.sessionStorage
        : ({} as Storage);
  } catch {
    storageType = {} as Storage;
  }

  return {
    updateStore(defaultValues: GlobalState) {
      try {
        state = JSON.parse(storageType.getItem(name) || '') || defaultValues;
      } catch {
        state = defaultValues;
      }
    },
    saveStore() {
      storageType.setItem(name, JSON.stringify(state));
    },
    get middleWares() {
      return middleWares;
    },
    set middleWares(wares: MiddleWare[]) {
      middleWares = wares;
    },
    get state() {
      return state;
    },
    set state(value) {
      state = value;
    },
    get name() {
      return name;
    },
    set name(value) {
      name = value;
    },
    get storageType() {
      return storageType;
    },
    set storageType(value) {
      storageType = value;
    },
  };
}

export default StoreFactory();
