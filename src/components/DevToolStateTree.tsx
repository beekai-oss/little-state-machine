import DevToolStorage from './DevToolStorage';
import * as React from 'react';
import { COLORS } from '../constants';
import saveSetting from '../logic/saveSetting';
import { useState } from 'react';
import search from '../logic/filterObject';
const clone = require('lodash.clonedeep');
let ReactJson = (props: any) => <div {...props} />;
if (typeof window !== 'undefined') {
  ReactJson = require('react-json-view').default;
}

const buttonStyle = {
  margin: '0 10px 0 0',
  padding: '5px 10px',
  display: 'inline',
  fontSize: '12px',
  border: 'none',
  borderRadius: '2px',
};

const toggleStyle = {
  borderRadius: 0,
  display: 'inline',
  padding: 0,
  margin: 0,
  width: 20,
  height: 20,
  top: 0,
  marginRight: 10,
  border: 0,
};

export default ({
  setPanel,
  isLoadPanelShow,
  setLoadPanel,
  state,
  setExpand,
  isCollapse,
  closePanel,
  stateIndex,
  actions,
  config,
}: {
  isLoadPanelShow: boolean;
  setLoadPanel: (payload: boolean) => void;
  state: Object;
  setExpand: (payload: boolean) => void;
  setClose: (payload: boolean) => void;
  closePanel: () => void;
  stateIndex: number;
  isCollapse: boolean;
  config: {
    isCollapse: boolean;
    isClose: boolean;
    searchTerm: string;
    filterTerm: string;
  };
  setPanel: (arg: string) => void;
  actions: {
    name: string;
    state: Object;
  }[];
}) => {
  const collapse = () => {
    const expandValue = !isCollapse;
    setExpand(expandValue);
    saveSetting({ isCollapse: expandValue });
  };
  const [filterValue, setFilterValue] = useState(config.searchTerm);
  let data = (stateIndex === -1
    ? actions[actions.length - 1]
    : actions[stateIndex]
  ).state;

  if (filterValue) data = search(clone(data), filterValue);

  return (
    <section>
      {isLoadPanelShow && <DevToolStorage setLoadPanel={setLoadPanel} />}
      <h3
        style={{
          fontWeight: 'lighter',
          color: 'white',
          fontSize: 12,
          padding: 10,
          lineHeight: '20px',
          margin: '0 0 10px 0',
          borderBottom: `1px solid ${COLORS.secondary}`,
        }}
      >
        ♆ Little State Machine
        <span style={{ marginRight: 40, float: 'right' }}>
          <button
            onClick={() => {
              setPanel('right');
              saveSetting({ panelPosition: 'right' });
            }}
            style={{ ...toggleStyle, borderRight: '6px solid #ec5990' }}
          />
          <button
            onClick={() => {
              setPanel('bottom');
              saveSetting({ panelPosition: 'bottom' });
            }}
            style={{ ...toggleStyle, borderBottom: '6px solid #ec5990' }}
          />
        </span>
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
          {isCollapse ? 'Expand' : 'Collapse'}
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
          lineHeight: '22px',
        }}
        aria-label="close panel"
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
        <input
          name="filter"
          style={{
            borderRadius: 0,
            background: '#11334c',
            marginTop: 10,
            border: 0,
            color: 'white',
            padding: '10px 10px',
            boxSizing: 'border-box',
            fontSize: '14px',
            width: 'calc(100% + 10px)',
            margin: '0 -10px 10px',
          }}
          type="search"
          placeholder="Search..."
          defaultValue={config.searchTerm}
          onChange={e => {
            setFilterValue(e.target.value);
            saveSetting({ searchTerm: e.target.value });
          }}
        />
        <ReactJson
          src={data}
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
