import { middleWare } from './stateMachine';
import difference from './difference';
import { GetStore, Store } from './types';
const cloneDeep = require('lodash.clonedeep');

export function logStartAction({
  debugName,
  getStore,
}: {
  debugName: string;
  getStore: GetStore;
}) {
  const storeCopy = cloneDeep(getStore());
  console.log('┌───────────────────────────────────────>');
  console.log(`├─%c${debugName}`, 'color: #bada55');
  console.log('├─before:', storeCopy);
  middleWare({ debugName });
  return storeCopy;
}

export function logEndAction({
  getStore,
  storeCopy,
}: {
  getStore: GetStore;
  storeCopy: Store;
}) {
  const isEmpty = require('lodash.isempty');
  const diff = difference(getStore(), storeCopy);
  const noChange = isEmpty(diff);

  console.log(noChange ? '└─after' : '├─after:', getStore());

  if (!noChange) {
    console.log(
      '└─diff:',
      difference(storeCopy, getStore()),
      ' → ',
      difference(getStore(), storeCopy),
    );
  }
}
