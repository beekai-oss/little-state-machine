import * as React from 'react';
import { useStateMachine, middleWare } from '../stateMachine';
import DevToolActionPanel from './DevToolActionPanel';
import DevToolStateTree from './DevToolStateTree';
import { Animate } from 'react-simple-animate';
import { STATE_MACHINE_DEV_TOOL_CONFIG, COLORS, Z_INDEX } from '../constants';
import saveSetting from '../logic/saveSetting';
const cloneDeep = require('lodash.clonedeep');

const { useState, useCallback } = React;
export let actions: { name: string; state: Object }[] = [];
let previousStateIndex = -1;
let previousIsLoadPanelShow = false;
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

  const closePanel = useCallback(() => {
    const closeValue = !isClose;
    setClose(closeValue);
    const config = window.localStorage.getItem(STATE_MACHINE_DEV_TOOL_CONFIG);
    saveSetting(config || '', { isClose: closeValue });
  }, []);

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
              top: -1,
              width: 200,
              margin: 0,
              padding: 10,
              background: COLORS.primary,
              color: 'white',
              zIndex: Z_INDEX.top,
              fontSize: 13,
              lineHeight: '20px',
              border: 0,
              borderRadius: 0,
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
              zIndex: Z_INDEX.top,
              position: 'fixed',
              right: 0,
              top: 0,
              width: 600,
              height: '100vh',
              background: COLORS.primary,
              display: 'grid',
              gridTemplateColumns: '150px auto',
              boxShadow: '0 0 8px 3px #080808',
              ...style,
            }}
          >
            <DevToolActionPanel
              stateIndex={stateIndex}
              actions={actions}
              setStateIndex={setStateIndex}
            />
            <DevToolStateTree
              {...{
                closePanel,
                actions,
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
