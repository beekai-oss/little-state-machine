import { TransformFunc } from '../types';
import getBrowserStoreData from './getBrowserStoreData';

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
