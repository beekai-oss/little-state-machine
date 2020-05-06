import * as React from 'react';
import { useStateMachine } from '../stateMachine';
import DevToolActionPanel from './DevToolActionPanel';
import DevToolStateTree from './DevToolStateTree';
import { Animate } from 'react-simple-animate';
import { STATE_MACHINE_DEV_TOOL_CONFIG, COLORS, Z_INDEX } from '../constants';
import saveSetting from '../logic/saveSetting';
import { useRef } from 'react';
const cloneDeep = require('lodash.clonedeep');

const { useState } = React;
export let actions: { name: string; state: Object }[] = [];
let previousStateIndex = -1;
let previousIsLoadPanelShow = false;
const config =
  typeof window !== 'undefined' && typeof document !== 'undefined'
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
        panelPosition: 'right',
        mouseMoveDiff: 0,
      };

let previousMouseMoveDiff = config.mouseMoveDiff;
let previousIsCollapse = config.isCollapse;
let previousIsClose = config.isClose;

const DevTool = ({
  buttonBottom,
  buttonTop,
  iconSize,
}: {
  buttonBottom?: string | number;
  buttonTop?: string | number;
  iconSize?: number;
}) => {
  const { state } = useStateMachine();
  const [isClose, setClose] = useState(config.isClose);
  const [isLoadPanelShow, setLoadPanel] = useState(false);
  const [isCollapse, setExpand] = useState(config.isCollapse);
  const [stateIndex, setStateIndex] = useState(-1);
  const [panelPosition, setPanel] = useState(config.panelPosition);
  const rootRef = useRef<HTMLInputElement>(null);
  const mouseDownOriginalX = useRef(0);
  const isBrowser = typeof window !== 'undefined';
  const [mouseMoveDiff, setMouseMoveDiff] = useState(config.mouseMoveDiff);

  const closePanel = () => {
    const closeValue = !isClose;
    setClose(closeValue);
    saveSetting({ isClose: closeValue });
  };

  if (
    previousStateIndex === stateIndex &&
    previousIsClose === isClose &&
    previousIsLoadPanelShow === isLoadPanelShow &&
    previousIsCollapse === isCollapse &&
    previousMouseMoveDiff === mouseMoveDiff
  ) {
    actions.push({
      // @ts-ignore
      name: window['__STATE_MACHINE_ACTION_NAME__'],
      state: cloneDeep(state),
    });
  }

  previousStateIndex = stateIndex;
  previousIsClose = isClose;
  previousIsLoadPanelShow = isLoadPanelShow;
  previousIsCollapse = isCollapse;
  previousMouseMoveDiff = mouseMoveDiff;

  const move = (e: MouseEvent) => {
    setMouseMoveDiff(e.clientX - mouseDownOriginalX.current);
  };

  const mouseup = (e: any) => {
    if (rootRef && rootRef.current) {
      rootRef.current.style.userSelect = 'auto';
    }

    saveSetting({ mouseMoveDiff: e.clientX - mouseDownOriginalX.current });

    document.removeEventListener('mousemove', move);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (rootRef && rootRef.current) {
      rootRef.current.style.userSelect = 'none';
    }
    mouseDownOriginalX.current = e.clientX;

    document.addEventListener('mouseup', mouseup);
    document.addEventListener('mousemove', move);
  };

  React.useEffect(() => {
    return () => {
      document.removeEventListener('mouseup', mouseup);
      document.removeEventListener('mousemove', move);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div
      style={{
        fontFamily: `BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif`,
      }}
      ref={rootRef}
    >
      <button
        style={{
          position: 'fixed',
          top: buttonTop || 0,
          right: 0,
          bottom: buttonBottom || 'auto',
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
        }}
        onClick={() => closePanel()}
      >
        ♆
      </button>
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
              gridTemplateColumns: '3px 150px minmax(100px, 1fr)',
              boxShadow: '0 0 8px 3px #080808',
              ...(panelPosition === 'bottom'
                ? {
                    bottom: 0,
                    width: '100%',
                    height: '40%',
                  }
                : {
                    top: 0,
                    width: 600 - (mouseMoveDiff || 0),
                  }),
              ...style,
            }}
          >
            <div
              style={{
                cursor: 'ew-resize',
              }}
              onMouseDown={onMouseDown}
            />
            <DevToolActionPanel
              config={config}
              stateIndex={stateIndex}
              actions={actions}
              setStateIndex={setStateIndex}
            />
            <DevToolStateTree
              {...{
                isBrowser,
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
