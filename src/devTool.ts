import { STATE_MACHINE_DEBUG_NAME } from './constants';

export function setUpDevTools(isDevMode, storageType, getName) {
  if (typeof window === 'undefined' || !isDevMode) return;

  window['LITTLE_STATE_MACHINE_DEBUG'] = (value: string) => {
    storageType.setItem(STATE_MACHINE_DEBUG_NAME, value);
  };

  window['LITTLE_STATE_MACHINE_RESET'] = () => {
    storageType.clear();
  };

  window['LITTLE_STATE_MACHINE_GET_STORE'] = () => {
    storageType.getItem(getName());
  };
}
