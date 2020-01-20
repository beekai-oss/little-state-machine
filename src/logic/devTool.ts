import { STATE_MACHINE_DEBUG_NAME } from '../constants';
import { GetStore } from '../types';

export function setUpDevTools(
  isDevMode: boolean,
  storageType: Storage,
  getName: Function,
  getStore: GetStore,
) {
  if (typeof window === 'undefined' || !isDevMode) return;

  // @ts-ignore
  window.STATE_MACHINE_DEBUG = (value: string) =>
    storageType.setItem(STATE_MACHINE_DEBUG_NAME, value);

  // @ts-ignore
  window.STATE_MACHINE_RESET = () => storageType.clear();

  // @ts-ignore
  window.STATE_MACHINE_GET_STORE = () => storageType.getItem(getName());

  // @ts-ignore
  window.STATE_MACHINE_SAVE_TO = name =>
    window.localStorage.setItem(name, JSON.stringify(getStore()));

  // @ts-ignore
  window.STATE_MACHINE_LOAD = ({
    storeName,
    data,
  }: {
    storeName: string;
    data?: string;
  }) =>
    storageType.setItem(
      getName() || STATE_MACHINE_DEBUG_NAME,
      data || window.localStorage.getItem(storeName) || '',
    );
}
