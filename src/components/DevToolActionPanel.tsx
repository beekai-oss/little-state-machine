import * as React from 'react';
import { useState } from 'react';
import { COLORS } from '../constants';
import saveSetting from '../logic/saveSetting';

const DevToolActionPanel = ({
  setStateIndex,
  stateIndex,
  actions,
  config,
}: {
  setStateIndex: (index: number) => void;
  stateIndex: number;
  actions: {
    name: string;
    state: Object;
  }[];
  config: {
    isCollapse: boolean;
    isClose: boolean;
    searchTerm: string;
    filterAction: string;
  };
}) => {
  const [filterName, setFilterName] = useState(config.filterAction);
  return (
    <div
      style={{
        borderRight: '1px solid #11324c',
      }}
    >
      <p
        style={{
          color: 'white',
          fontSize: 13,
          lineHeight: '20px',
          margin: 0,
          padding: '10px 10px 9px',
          borderBottom: `1px solid ${COLORS.secondary}`,
        }}
      >
        <span style={{ fontSize: 10 }}>▼</span> Actions
      </p>
      <input
        name="filter"
        type="search"
        style={{
          borderRadius: 0,
          background: '#11334c',
          marginTop: 0,
          border: 'none',
          color: 'white',
          padding: '10px 10px',
          width: '100%',
          boxSizing: 'border-box',
          fontSize: '14px',
        }}
        defaultValue={config.filterAction}
        onChange={event => {
          setFilterName(event.target.value.toLowerCase());
          saveSetting({ filterAction: event.target.value });
        }}
        placeholder="Filter..."
      />
      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          height: 'calc(100vh - 50px)',
          overflowY: 'auto',
        }}
      >
        {actions
          .filter(
            data =>
              ((data.name &&
                data.name.toLowerCase &&
                data.name.toLowerCase().includes(filterName)) ||
                (!data.name && !filterName) ||
                filterName === '') &&
              data.name,
          )
          .map(({ name }, index) => (
            <li
              style={{
                fontSize: 13,
                padding: 0,
              }}
              key={`${name}${index}`}
            >
              <button
                style={{
                  margin: 0,
                  padding: 10,
                  background: 'none',
                  color: 'white',
                  border: 'none',
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  borderRadius: 0,
                  borderBottom:
                    stateIndex === index
                      ? '1px solid #ec5990'
                      : `1px solid ${COLORS.secondary}`,
                  textTransform: 'initial',
                }}
                onClick={() => {
                  setStateIndex(index);
                }}
              >
                {name || 'unknown'}
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default DevToolActionPanel;
