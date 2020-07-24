import getBrowserStoreData from './getBrowserStoreData';
import transformStore from './transformStore';
import { StateMachineOptions } from '../types';

export default function getSyncStoreData(
  defaultStoreData: any,
  options: StateMachineOptions,
  storageType: Storage,
) {
  let store = defaultStoreData;
  const syncStoreOption = options.syncStores;

  if (!syncStoreOption) return store;

  try {
    if (Array.isArray(syncStoreOption)) {
      syncStoreOption.forEach(option => {
        store = transformStore({
          transform: option.transform,
          externalStoreName: option.externalStoreName,
          storageType,
          store,
        });
      });
    } else if (
      syncStoreOption.externalStoreName &&
      typeof syncStoreOption.transform === 'function' &&
      typeof syncStoreOption.externalStoreName === 'string'
    ) {
      return transformStore({
        transform: syncStoreOption.transform,
        externalStoreName: syncStoreOption.externalStoreName,
        storageType,
        store,
      });
    } else {
      Object.entries(syncStoreOption).forEach(async ([key, values]) => {
        const browserStore = await getBrowserStoreData(storageType, key);
        values.forEach((value: string) => {
          store = {
            ...store,
            ...{
              [value]: {
                ...store[value],
                ...browserStore[value],
              },
            },
          };
        });
      });
    }
  } catch {
    return store;
  }

  return store;
}
