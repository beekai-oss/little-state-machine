export const STORE_DEFAULT_NAME = '__LSM__';
export const STORE_ACTION_NAME = '__LSM_NAME__';

export enum PersistOption {
  None = 'none',
  OnAction = 'onAction',
  BeforeUnload = 'beforeUnload',
}
