import getBrowserStoreData from './getBrowserStoreData';
import { StateMachineOptions } from '../types';

export default function getSyncStoreData(
  data: any,
  options: StateMachineOptions,
  storageType: Storage,
) {
  let syncedStoreData = data;
  const syncStore = options.syncStores;
  if (syncStore) {
    if (syncStore.name && typeof syncStore.transform === 'function') {
      try {
        const sessionData = window.sessionStorage.getItem(options.name);
        const parsedSessionStorage = sessionData && JSON.parse(sessionData);
        syncedStoreData = syncStore.transform(
          parsedSessionStorage,
          syncedStoreData,
        );
      } catch {}
    } else {
      Object.entries(syncStore).forEach(([key, values]) => {
        try {
          const browserStore = getBrowserStoreData(storageType, key);
          values.forEach((value: string) => {
            syncedStoreData = {
              ...syncedStoreData,
              ...{
                [value]: {
                  ...syncedStoreData[value],
                  ...browserStore[value],
                },
              },
            };
          });
        } catch {}
      });
    }
  }
  return syncedStoreData;
}
