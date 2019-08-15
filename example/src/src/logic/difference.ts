import { Store } from '../types';
const transform = require('lodash.transform');
const isEqual = require('lodash.isequal');
const isObject = require('lodash.isobject');

export default function difference(object: Store, base: Store) {
  function changes(object: Store, base: Store) {
    return transform(object, (result: Store, value: any, key: string) => {
      if (!isEqual(value, base[key])) {
        result[key] =
          isObject(value) && isObject(base[key])
            ? changes(value, base[key])
            : value;
      }
    });
  }
  return changes(object, base);
}
