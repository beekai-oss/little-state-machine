import * as React from 'react';
import { useStateMachine } from './stateMachine';
import ReactJson from 'react-json-view';

const { useState } = React;

export default function devToolComponent() {
  const { state } = useStateMachine();
  const [isCurrentState, setCurrentState] = useState(true);
  const [isClose, setClose] = useState(false);
  console.log('isClose', isClose);

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
              src={isCurrentState ? state : {}}
              theme="harmonic"
              iconStyle="square"
              enableClipboard
              collapsed
              displayObjectSize={false}
              displayDataTypes={false}
              indentWidth={2}
              style={{
                fontSize: 12,
                overflow: 'scroll',
                height: '100vh',
              }}
            />
          </section>
        </div>
      )}
    </div>
  );
}
