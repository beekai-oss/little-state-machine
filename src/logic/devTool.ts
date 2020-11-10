export function setUpDevTools<T>(
  storageType: Storage,
  name: string,
  store: T,
) {
  if (typeof window === 'undefined') return;

  window.STATE_MACHINE_DEBUG = (value: string) =>
    storageType.setItem('___STATE_MACHINE_DEBUG__', value);

  window.STATE_MACHINE_RESET = () => storageType.clear();

  window.STATE_MACHINE_GET_STORE = () => storageType.getItem(name);

  window.STATE_MACHINE_SAVE_TO = (name: any) =>
    window.localStorage.setItem(name, JSON.stringify(store));

  window.STATE_MACHINE_LOAD = ({
    storeName,
    data,
  }: {
    storeName: string;
    data?: string;
  }) =>
    storageType.setItem(
      name || '___STATE_MACHINE_DEBUG__',
      data || window.localStorage.getItem(storeName) || '',
    );
}
