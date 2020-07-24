export default async (storageType: Storage, storeName: string) => {
  const sessionStorageData = await storageType.getItem(storeName);
  try {
    return sessionStorageData ? JSON.parse(sessionStorageData) : undefined;
  } catch {
    return undefined;
  }
};
