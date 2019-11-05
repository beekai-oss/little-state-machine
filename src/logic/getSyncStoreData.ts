import getBrowserStoreData from './getBrowserStoreData';
import { StateMachineOptions } from '../types';

export default function getSyncStoreData(
  data: any,
  options: StateMachineOptions,
  storageType: Storage,
) {
  let result = data;
  const syncStore = options.syncStores;
  if (syncStore) {
    if (typeof syncStore === 'function') {
      // pam your work will be here
    } else {
      Object.entries(syncStore).forEach(([key, values]) => {
        try {
          const browserStore = getBrowserStoreData(storageType, key);
          (values as any).forEach((value: string) => {
            result = {
              ...result,
              ...{
                [value]: {
                  ...result[value],
                  ...browserStore[value],
                },
              },
            };
          });
        } catch {}
      });
      return result;
    }
  }
}
