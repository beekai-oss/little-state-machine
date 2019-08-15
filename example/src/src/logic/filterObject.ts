function drillData(originalData: Record<string, any>, keys: string[]) {
  let data = originalData;
  let tempData: any;

  for (let key in keys) {
    tempData = data;
    const result = data[keys[key]];
    if (
      (result && Array.isArray(result) && !result.length) ||
      (typeof result === 'object' && !Object.keys(result).length) ||
      result === ''
    ) {
      delete tempData[keys[key]];
    }
  }
}

export default function search(
  data: Record<string, any>,
  find: string,
  keys: string[] = [],
  originalData?: Record<string, any>,
) {
  if (!originalData) originalData = data;

  for (let key in data) {
    const result = data[key];
    const lowerCaseKey = key.toLowerCase();
    const findLowerCase = find.toLowerCase();
    if (
      lowerCaseKey === findLowerCase ||
      lowerCaseKey.startsWith(findLowerCase) ||
      lowerCaseKey.includes(findLowerCase)
    ) {
    } else if (Array.isArray(result)) {
      delete data[key];
    } else if (typeof result === 'object') {
      search(result, find, [...(keys || []), key], originalData);
    } else {
      delete data[key];
      drillData(originalData, keys);
    }
  }

  return data;
}
