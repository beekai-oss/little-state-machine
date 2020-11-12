export default (storageType: Storage, storeName: string) => {
  try {
    return storageType.getItem(storeName);
  } catch {
    return undefined;
  }
};
