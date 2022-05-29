import { STORE_DEFAULT_NAME } from '../constants';
import { MiddleWare, GlobalState } from '../types';

function StoreFactory() {
  let options = {
    name: STORE_DEFAULT_NAME,
    middleWares: [] as MiddleWare[],
    storageType: {} as Storage,
    persistOption: '',
  };
  let state: GlobalState = {};

  try {
    options.storageType =
      typeof sessionStorage !== 'undefined'
        ? window.sessionStorage
        : ({} as Storage);
  } catch {}

  return {
    updateStore(defaultValues: GlobalState) {
      try {
        state = JSON.parse(options.storageType.getItem(options.name) || '') || defaultValues;
      } catch {
        state = defaultValues;
      }
    },
    saveStore() {
      options.storageType.setItem(options.name, JSON.stringify(state));
    },
    get state() {
      return state;
    },
    set state(value) {
      state = value;
    },
    get options() {
      return options;
    },
    set options(value) {
      options = value;
    },
  };
}

export default StoreFactory();
