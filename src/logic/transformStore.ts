import getBrowserStoreData from './getBrowserStoreData';
import { TransformFunc } from '../types';

export default ({
  transform,
  externalStoreName,
  storageType,
  store,
}: {
  transform: TransformFunc;
  externalStoreName: string;
  storageType: Storage;
  store: any;
}) =>
  transform({
    externalStoreData: getBrowserStoreData(storageType, externalStoreName),
    currentStoreData: store,
  });
