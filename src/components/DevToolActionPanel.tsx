import * as React from 'react';
import { actions } from './DevTool';
import { useState } from 'react';

const DevToolActionPanel = ({
  setStateIndex,
  stateIndex,
}: {
  setStateIndex: (index: number) => void;
  stateIndex: number;
}) => {
  const [filterName, setFilterName] = useState('');
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
          margin: 0,
          padding: '10px',
          borderBottom: '1px solid rgb(17, 50, 76)',
        }}
      >
        <span style={{fontSize: 10}}>▼</span> Actions
      </p>
      <input
        name="filter"
        style={{
          borderRadius: 0,
          background: '#11334c',
          marginTop: 10,
          border: 'none',
          color: 'white',
        }}
        onChange={(event: React.ChangeEvent) =>
          // @ts-ignore
          setFilterName(event.target.value.toLowerCase())
        }
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
              (data.name && data.name.toLowerCase().includes(filterName)) ||
              (!data.name && !filterName),
          )
          .map(({ name, state }, index) => (
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
                      : '1px solid #162a3c',
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
