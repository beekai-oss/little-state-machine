import * as React from 'react';
import { useStateMachine } from './stateMachine';
import DevToolStorage from './devToolStorage';
import ReactJson from 'react-json-view';

const { useState } = React;

export default function devToolComponent() {
  if (process.env.NODE_ENV === 'production') return null;
  const { state } = useStateMachine();
  const [isClose, setClose] = useState(false);
  const [isLoadPanelShow, setLoadPanel] = useState(false);

  return (
    <div
      style={{
        fontFamily: `BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif`,
      }}
    >
      {isClose ? (
        <button
          style={{
            position: 'fixed',
            right: 0,
            top: 0,
            width: 140,
            margin: 0,
            padding: 10,
            background: '#0a1c2c',
            color: 'white',
            zIndex: 100000000,
            fontSize: 12,
          }}
          onClick={() => setClose(!isClose)}
        >
          Little State Machine
        </button>
      ) : (
        <div
          style={{
            zIndex: 100000000,
            position: 'fixed',
            right: 0,
            top: 0,
            width: 450,
            height: '100vh',
            background: '#0a1c2c',
          }}
        >
          {isLoadPanelShow && <DevToolStorage setLoadPanel={setLoadPanel} />}
          <h3
            style={{
              fontWeight: 'lighter',
              color: 'white',
              fontSize: 12,
              padding: 10,
              margin: 0,
              borderBottom: '1px solid #7c9ebd1a',
            }}
          >
            Little State Machine
          </h3>
          <section
            style={{
              marginLeft: 10,
            }}
          >
            <button
              onClick={() => {
                const name = prompt('💁🏻‍♀️ Give it a name.');
                if (name) {
                  window.localStorage.setItem(name, JSON.stringify(state));
                }
              }}
              style={{
                margin: '0 10px 0 0',
                padding: '5px 20px',
                display: 'inline',
              }}
            >
              Save
            </button>
            <button
              style={{
                margin: 0,
                padding: '5px 20px',
                display: 'inline',
              }}
              onClick={() => setLoadPanel(!isLoadPanelShow)}
            >
              Load
            </button>
          </section>
          <button
            style={{
              color: 'white',
              position: 'absolute',
              top: -5,
              right: 0,
              padding: 10,
              appearance: 'none',
              background: 'none',
              fontSize: 20,
              border: 0,
              margin: 0,
            }}
            onClick={() => setClose(!isClose)}
          >
            ×
          </button>
          <section style={{ padding: 10 }}>
            <ReactJson
              src={state}
              theme="harmonic"
              iconStyle="square"
              enableClipboard={false}
              collapsed
              displayObjectSize={false}
              displayDataTypes={false}
              indentWidth={2}
              style={{
                fontSize: 12,
                overflow: 'scroll',
                height: 'calc(100vh - 40px)',
              }}
            />
          </section>
        </div>
      )}
    </div>
  );
}
