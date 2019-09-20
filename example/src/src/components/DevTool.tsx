import * as React from 'react';
import { useStateMachine, middleWare } from '../stateMachine';
import DevToolActionPanel from './DevToolActionPanel';
import DevToolStateTree from './DevToolStateTree';
import { Animate } from 'react-simple-animate';
import { STATE_MACHINE_DEV_TOOL_CONFIG, COLORS, Z_INDEX } from '../constants';
import saveSetting from '../logic/saveSetting';
const cloneDeep = require('lodash.clonedeep');

const { useState } = React;
export let actions: { name: string; state: Object }[] = [];
let previousStateIndex = -1;
let previousIsLoadPanelShow = false;
const config =
  typeof window !== 'undefined'
    ? // @ts-ignore
    JSON.parse(
      window.localStorage.getItem(STATE_MACHINE_DEV_TOOL_CONFIG) ||
      '{"isCollapse": false, "isClose": true}',
    )
    : {
      isCollapse: false,
      isClose: true,
      searchTerm: '',
      filterAction: '',
      panelPosition: 'right'
    };

let previousIsCollapse = config.isCollapse;
let previousIsClose = config.isClose;

const DevTool = ({ iconSize }: { iconSize?: number }) => {
  const { state } = useStateMachine();
  const [isClose, setClose] = useState(config.isClose);
  const [isLoadPanelShow, setLoadPanel] = useState(false);
  const [isCollapse, setExpand] = useState(config.isCollapse);
  const [stateIndex, setStateIndex] = useState(-1);
  const [panelPosition, setPanel] = useState(config.panelPosition);

  const closePanel = () => {
    const closeValue = !isClose;
    setClose(closeValue);
    saveSetting({ isClose: closeValue });
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
        delay={0.3}
        render={({ style }) => (
          <button
            style={{
              position: 'fixed',
              right: 0,
              top: -1,
              width: iconSize || 40,
              height: iconSize || 40,
              margin: 0,
              padding: 10,
              background: COLORS.primary,
              color: 'white',
              zIndex: Z_INDEX.top,
              fontSize: 15,
              lineHeight: '15px',
              border: 0,
              borderRadius: 0,
              ...style,
            }}
            onClick={() => closePanel()}
          >
            ♆
          </button>
        )}
      />
      <Animate
        play={isClose}
        end={{ transform: 'translateX(102%)' }}
        easeType="ease-out"
        duration={0.3}
        render={({ style }) => (
          <div
            style={{
              zIndex: Z_INDEX.top,
              position: 'fixed',
              right: 0,
              width: 600,
              height: '100vh',
              background: COLORS.primary,
              display: 'grid',
              gridTemplateColumns: '150px auto',
              boxShadow: '0 0 8px 3px #080808',
              ...(panelPosition === "bottom"
                ? {
                  bottom: 0,
                  width: "100%",
                  height: '40vh'
                }
                : {
                  top: 0,
                  width: 600
                }),
              ...style,
            }}
          >
            <DevToolActionPanel
              config={config}
              stateIndex={stateIndex}
              actions={actions}
              setStateIndex={setStateIndex}
            />
            <DevToolStateTree
              {...{
                setPanel,
                panelPosition,
                closePanel,
                config,
                actions,
                isLoadPanelShow,
                setLoadPanel,
                state,
                setExpand,
                isCollapse,
                setClose,
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
