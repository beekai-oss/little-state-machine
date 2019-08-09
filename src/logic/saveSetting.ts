import { STATE_MACHINE_DEV_TOOL_CONFIG } from '../constants';

export default function saveSetting(
  config: string,
  setting: { [key: string]: boolean },
) {
  try {
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
