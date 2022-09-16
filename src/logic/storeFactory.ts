import { PersistOption, STORE_DEFAULT_NAME } from '../constants';
import { MiddleWare, GlobalState, StateMachineOptions } from '../types';

function StoreFactory() {
  let options: StateMachineOptions = {
    name: STORE_DEFAULT_NAME,
    middleWares: [] as MiddleWare[],
    storageType: undefined,
    persist: PersistOption.OnAction,
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
          JSON.parse(options.storageType?.getItem(options.name!) || '') ||
          defaultValues;
      } catch {
        state = defaultValues;
      }
    },
    saveStore() {
      options.storageType?.setItem(options.name!, JSON.stringify(state));
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
