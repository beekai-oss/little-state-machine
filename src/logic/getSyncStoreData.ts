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
      syncStoreOption.externalStoreName &&
      typeof syncStoreOption.transform === 'function' &&
      typeof syncStoreOption.externalStoreName === 'string'
    ) {
      return syncStoreOption.transform({
        externalStoreData: getBrowserStoreData(
          storageType,
          syncStoreOption.externalStoreName,
        ),
        currentStoreData: store,
      });
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
