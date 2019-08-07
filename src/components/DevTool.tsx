import * as React from 'react';
import { useStateMachine, middleWare } from '../stateMachine';
import DevToolActionPanel from './DevToolActionPanel';
import DevToolStateTree from './DevToolStateTree';
import { Animate } from 'react-simple-animate';
const cloneDeep = require('lodash.clonedeep');

const { useState } = React;
export let actions: { name: string; state: Object }[] = [];
let previousStateIndex = -1;
let previousIsClose = false;
let previousIsLoadPanelShow = false;
export const DEV_TOOL_CONFIG = 'dev_tool_config';
const config =
  typeof window !== 'undefined'
    ? // @ts-ignore
      JSON.parse(window.localStorage.getItem(DEV_TOOL_CONFIG) || '{}')
    : {};
let previousIsCollpase = config.isCollapse;

const DevTool: React.FC = () => {
  const { state } = useStateMachine();
  const [isClose, setClose] = useState(false);
  const [isLoadPanelShow, setLoadPanel] = useState(false);
  const [isCollapse, setExpand] = useState(config.isCollapse);
  const [stateIndex, setStateIndex] = useState(-1);

  if (
    previousStateIndex === stateIndex &&
    previousIsClose === isClose &&
    previousIsLoadPanelShow === isLoadPanelShow &&
    previousIsCollpase === isCollapse
  ) {
    actions.push({
      name: (middleWare() || {}).debugName,
      state: cloneDeep(state),
    });
  }

  previousStateIndex = stateIndex;
  previousIsClose = isClose;
  previousIsLoadPanelShow = isLoadPanelShow;
  previousIsCollpase = isCollapse;

  return (
    <div
      style={{
        fontFamily: `BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif`,
      }}
    >
      <Animate
        play={!isClose}
        end={{ opacity: 0 }}
        delay={0.4}
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
              ...style,
            }}
            onClick={() => setClose(!isClose)}
          >
            Little State Machine
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
