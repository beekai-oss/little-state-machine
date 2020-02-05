import * as React from 'react';
import { COLORS, Z_INDEX } from '../constants';

export default function DevToolStorage({ setLoadPanel, isBrowser }: any) {
  return (
    <div
      style={{
        color: 'white',
        position: 'absolute',
        top: 40,
        right: 0,
        width: 450,
        margin: 0,
        padding: 10,
        background: COLORS.primary,
        fontSize: 12,
        boxSizing: 'border-box',
        zIndex: Z_INDEX.second,
        overflowY: 'auto',
        height: 'calc(100vh - 50px)',
        overflowX: 'hidden',
      }}
    >
      <ul
        style={{
          padding: 0,
          margin: 0,
          listStyle: 'none',
          fontSize: 14,
          lineHeight: 1.5,
        }}
      >
        {isBrowser && Object.entries(window.localStorage).map(([key, value], index) => (
          <li key={`${key}${index}`}>
            <button
              style={{
                padding: 10,
                margin: '0 0 20px',
                width: '100%',
                textAlign: 'left',
                background: 'none',
                color: 'white',
                border: `1px solid ${COLORS.secondary}`,
                overflowWrap: 'break-word',
              }}
              onClick={() => {
                if (window.confirm('Are you sure to load state?')) {
                  window.sessionStorage.setItem(
                    // @ts-ignore
                    window['STATE_MACHINE_NAME'],
                    value,
                  );
                }
              }}
            >
              {key}
            </button>
          </li>
        ))}
      </ul>
      <button
        style={{
          margin: 0,
          borderRadius: '4px',
          padding: '10px',
          width: '100%',
        }}
        onClick={() => setLoadPanel(false)}
      >
        Go Back
      </button>
    </div>
  );
}
