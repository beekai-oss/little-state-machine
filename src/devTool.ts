import { STATE_MACHINE_DEBUG_NAME } from './constants';

export function setUpDevTools(isDevMode: boolean, storageType: any, getName: Function, getStore: Function) {
  if (typeof window === 'undefined' || !isDevMode) return;

  // @ts-ignore
  window['STATE_MACHINE_DEBUG'] = (value: string) => {
    storageType.setItem(STATE_MACHINE_DEBUG_NAME, value);
  };

  // @ts-ignore
  window['STATE_MACHINE_RESET'] = () => {
    storageType.clear();
  };

  // @ts-ignore
  window['STATE_MACHINE_GET_STORE'] = () => {
    return storageType.getItem(getName());
  };

  // @ts-ignore
  window['STATE_MACHINE_SAVE_TO'] = (name) => {
    window.localStorage.setItem(name, JSON.stringify(getStore()));
  };

  // @ts-ignore
  window['STATE_MACHINE_LOAD'] = ({
    storeName,
    data,
  }: {
    storeName?: string;
    data?: any;
  }) => {
    // @ts-ignore
    storageType.setItem(getName() || STATE_MACHINE_DEBUG_NAME, data || window.localStorage.getItem(storeName));
  };
}
