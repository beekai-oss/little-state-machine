import getBrowserStoreData from './getBrowserStoreData';
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
    if (
      syncStoreOption.name &&
      typeof syncStoreOption.transform === 'function'
    ) {
      return syncStoreOption.transform(
        getBrowserStoreData(storageType, options.name),
        store,
      );
    } else {
      Object.entries(syncStoreOption).forEach(([key, values]) => {
        const browserStore = getBrowserStoreData(storageType, key);
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
