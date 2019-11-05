import { STATE_MACHINE_DEV_TOOL_CONFIG } from '../constants';

export default function saveSetting(setting: {
  [key: string]: boolean | string | number;
}) {
  try {
    const config = window.localStorage.getItem(STATE_MACHINE_DEV_TOOL_CONFIG);
    window.localStorage.setItem(
      STATE_MACHINE_DEV_TOOL_CONFIG,
      config
        ? JSON.stringify({
            ...JSON.parse(config),
            ...setting,
          })
        : JSON.stringify(setting),
    );
  } catch {}
}
