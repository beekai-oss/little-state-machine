import { GlobalState } from "../types";

export function setUpDevTools(
  storageType: Storage,
  name: string,
  store: GlobalState,
) {
  if (typeof window === 'undefined') return;

  window.__LSM_NAME__ = name;

  window.__LSM_DEBUG__ = (value: string) =>
    storageType.setItem('___LSM_DEBUG__', value);

  window.__LSM_RESET__ = () => storageType.clear();

  window.__LSM_GET_STORE__ = () => storageType.getItem(name);

  window.__LSM_SAVE_TO__ = (name: any) =>
    window.localStorage.setItem(name, JSON.stringify(store));

  window.__LSM_LOAD__ = ({
    storeName,
    data,
  }: {
    storeName: string;
    data?: string;
  }) =>
    storageType.setItem(
      name || '___LSM_DEBUG__',
      data || window.localStorage.getItem(storeName) || '',
    );
}
