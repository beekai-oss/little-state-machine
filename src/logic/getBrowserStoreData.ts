export default async (storageType: Storage, storeName: string) => {
  try {
    const sessionStorageData = await storageType.getItem(storeName);
    return sessionStorageData ? JSON.parse(sessionStorageData) : undefined;
  } catch {
    return undefined;
  }
};
