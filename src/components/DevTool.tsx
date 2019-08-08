import * as React from 'react';
import { useStateMachine, middleWare } from '../stateMachine';
import DevToolActionPanel from './DevToolActionPanel';
import DevToolStateTree from './DevToolStateTree';
import { Animate } from 'react-simple-animate';
import { STATE_MACHINE_DEV_TOOL_CONFIG } from '../constants';

const cloneDeep = require('lodash.clonedeep');

const { useState } = React;
let previousStateIndex = -1;
let previousIsLoadPanelShow = false;
export let actions: { name: string; state: Object }[] = [];
const config =
  typeof window !== 'undefined'
    ? // @ts-ignore
      JSON.parse(
        window.localStorage.getItem(STATE_MACHINE_DEV_TOOL_CONFIG) || '{}',
      )
    : {
        isCollapse: false,
        isClose: false,
      };
let previousIsCollapse = config.isCollapse;
let previousIsClose = config.isClose;

const DevTool: React.FC = () => {
  const { state } = useStateMachine();
  const [isClose, setClose] = useState(config.isClose);
  const [isLoadPanelShow, setLoadPanel] = useState(false);
  const [isCollapse, setExpand] = useState(config.isCollapse);
  const [stateIndex, setStateIndex] = useState(-1);

  const closePanel = () => {
    const closeValue = !isClose;
    setClose(closeValue);
    const config = window.localStorage.getItem(STATE_MACHINE_DEV_TOOL_CONFIG);
    try {
      window.localStorage.setItem(
        STATE_MACHINE_DEV_TOOL_CONFIG,
        config
          ? JSON.stringify({
              ...JSON.parse(config),
              isClose: closeValue,
            })
          : JSON.stringify({ isClose: closeValue }),
      );
    } catch {}
  };

  if (
    previousStateIndex === stateIndex &&
    previousIsClose === isClose &&
    previousIsLoadPanelShow === isLoadPanelShow &&
    previousIsCollapse === isCollapse
  ) {
    actions.push({
      name: (middleWare() || {}).debugName,
      state: cloneDeep(state),
    });
  }

  previousStateIndex = stateIndex;
  previousIsClose = isClose;
  previousIsLoadPanelShow = isLoadPanelShow;
  previousIsCollapse = isCollapse;

  return (
    <div
      style={{
        fontFamily: `BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif`,
      }}
    >
      <Animate
        play={!isClose}
        end={{ transform: 'translateY(-50px)' }}
        delay={0.5}
        render={({ style }) => (
          <button
            style={{
              position: 'fixed',
              right: 0,
              top: '-1px',
              width: 200,
              margin: 0,
              padding: 10,
              background: '#0a1c2c',
              color: 'white',
              zIndex: 100000000,
              fontSize: 12,
              lineHeight: '25px',
              ...style,
            }}
            onClick={() => closePanel()}
          >
            ♆ LITTLE STATE MACHINE
          </button>
        )}
      />
      <Animate
        play={isClose}
        end={{ transform: 'translateX(800px)' }}
        easeType="ease-out"
        duration={0.5}
        render={({ style }) => (
          <div
            style={{
              zIndex: 100000000,
              position: 'fixed',
              right: 0,
              top: 0,
              width: 600,
              height: '100vh',
              background: '#0a1c2c',
              display: 'grid',
              gridTemplateColumns: '150px auto',
              boxShadow: '0 0 8px 2px #080808',
              ...style,
            }}
          >
            <DevToolActionPanel
              stateIndex={stateIndex}
              setStateIndex={setStateIndex}
            />
            <DevToolStateTree
              {...{
                closePanel,
                isLoadPanelShow,
                setLoadPanel,
                state,
                setExpand,
                isCollapse,
                setClose,
                isClose,
                stateIndex,
              }}
            />
          </div>
        )}
      />
    </div>
  );
};

export default DevTool;
