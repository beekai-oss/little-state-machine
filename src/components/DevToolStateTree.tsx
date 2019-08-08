import DevToolStorage from './DevToolStorage';
import ReactJson from 'react-json-view';
import * as React from 'react';
import { actions } from './DevTool';
import { STATE_MACHINE_DEV_TOOL_CONFIG } from '../constants';

const buttonStyle = {
  margin: '0 10px 0 0',
  padding: '5px 20px',
  display: 'inline',
  fontSize: '12px',
  border: 'none',
  borderRadius: '2px',
};

export default ({
  isLoadPanelShow,
  setLoadPanel,
  state,
  setExpand,
  isCollapse,
  closePanel,
  stateIndex,
}: {
  isLoadPanelShow: boolean;
  setLoadPanel: (payload: boolean) => void;
  state: Object;
  setExpand: (payload: boolean) => void;
  setClose: (payload: boolean) => void;
  closePanel: () => void;
  stateIndex: number;
  isCollapse: boolean;
}) => {
  const collapse = () => {
    const expandValue = !isCollapse;
    setExpand(expandValue);
    const config = window.localStorage.getItem(STATE_MACHINE_DEV_TOOL_CONFIG);
    try {
      window.localStorage.setItem(
        STATE_MACHINE_DEV_TOOL_CONFIG,
        config
          ? JSON.stringify({
              ...JSON.parse(config),
              isCollapse: expandValue,
            })
          : JSON.stringify({ isCollapse: expandValue }),
      );
    } catch {}
  };

  return (
    <section>
      {isLoadPanelShow && <DevToolStorage setLoadPanel={setLoadPanel} />}
      <h3
        style={{
          fontWeight: 'lighter',
          color: 'white',
          fontSize: 12,
          padding: 10,
          margin: '0 0 10px 0',
          borderBottom: '1px solid rgb(17, 50, 76)',
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
          style={buttonStyle}
        >
          Save
        </button>
        <button
          style={buttonStyle}
          onClick={() => setLoadPanel(!isLoadPanelShow)}
        >
          Load
        </button>
        <button
          style={buttonStyle}
          onClick={() => {
            collapse();
          }}
        >
          {isCollapse ? 'Expand' : 'collapse'}
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
          fontSize: 26,
          border: 0,
          margin: 0,
        }}
        onClick={() => {
          if (isLoadPanelShow) {
            setLoadPanel(false);
          } else {
            closePanel();
          }
        }}
      >
        ×
      </button>
      <section style={{ padding: '10px 0px 10px 10px' }}>
        <ReactJson
          src={
            (stateIndex === -1
              ? actions[actions.length - 1]
              : actions[stateIndex]
            ).state
          }
          theme="harmonic"
          iconStyle="square"
          enableClipboard={false}
          collapsed={isCollapse}
          displayObjectSize={false}
          displayDataTypes={false}
          indentWidth={2}
          style={{
            fontSize: 12,
            overflow: 'auto',
            height: 'calc(100vh - 90px)',
          }}
        />
      </section>
    </section>
  );
};
