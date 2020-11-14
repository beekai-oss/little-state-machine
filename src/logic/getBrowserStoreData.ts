export default (storageType: Storage, storeName: string) => {
  try {
    return JSON.parse(storageType.getItem(storeName) as string);
  } catch {
    return '';
  }
};
