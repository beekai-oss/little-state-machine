const transform = require('lodash.transform');
const isEqual = require('lodash.isequal');
const isObject = require('lodash.isobject');

export default function difference(object: any, base: string) {
  function changes(object: any, base: string) {
    return transform(object, function(result: any, value: any, key: any) {
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
