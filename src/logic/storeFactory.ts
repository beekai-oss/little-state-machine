import { PERSIST_OPTION, STORE_DEFAULT_NAME } from '../constants';
import { GlobalState, StateMachineOptions } from '../types';

function StoreFactory() {
  let options: StateMachineOptions = {
    name: STORE_DEFAULT_NAME,
    middleWares: [],
    persist: PERSIST_OPTION.ACTION,
  };
  let state: GlobalState = {};

  try {
    options.storageType =
      typeof sessionStorage !== 'undefined' ? window.sessionStorage : undefined;
  } catch {}

  return {
    updateStore(defaultValues: GlobalState) {
      try {
        state =
          (options.storageType &&
            JSON.parse(options.storageType.getItem(options.name!) || '')) ||
          defaultValues;
      } catch {
        state = defaultValues;
      }
    },
    saveStore() {
      options.storageType &&
        options.storageType.setItem(options.name!, JSON.stringify(state));
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
