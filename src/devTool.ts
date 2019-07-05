import { STATE_MACHINE_DEBUG_NAME } from './constants';

export function setUpDevTools(isDevMode, storageType, getName, getStore) {
  if (typeof window === 'undefined' || !isDevMode) return;

  window['STATE_MACHINE_DEBUG'] = (value: string) => {
    storageType.setItem(STATE_MACHINE_DEBUG_NAME, value);
  };

  window['STATE_MACHINE_RESET'] = () => {
    storageType.clear();
  };

  window['STATE_MACHINE_GET_STORE'] = () => {
    return storageType.getItem(getName());
  };

  window['STATE_MACHINE_SAVE_TO'] = (name) => {
    storageType.setItem(name, JSON.stringify(getStore()));
  };

  window['STATE_MACHINE_LOAD'] = ({
    storeName,
    data,
  }: {
    storeName?: string;
    data?: any;
  }) => {
    if (!storeName && !data) return;
    storageType.setItem(getName(), data || storageType.getItem(storeName));
  };
}
