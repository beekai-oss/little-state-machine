<div align="center"><a href="https://lrz5wloklm.csb.app/"><img src="https://github.com/bluebill1049/little-state-machine/blob/master/docs/logo.png?raw=true" alt="Little State Machine - React Hooks for state management" width="140px" /></a>
    <h1>Little State Machine</h1>
    
State management made super simple
</div>

<div align="center">

[![npm downloads](https://img.shields.io/npm/dm/little-state-machine.svg?style=for-the-badge)](https://www.npmjs.com/package/little-state-machine)
[![npm](https://img.shields.io/npm/dt/little-state-machine.svg?style=for-the-badge)](https://www.npmjs.com/package/little-state-machine)
[![npm](https://img.shields.io/bundlephobia/minzip/little-state-machine?style=for-the-badge)](https://bundlephobia.com/result?p=little-state-machine)

</div>

<h2>✨ Features</h2>

- Tiny with 0 dependency and simple (715B _gzip_)
- Persist state by default (`sessionStorage` or `localStorage`)
- Build with React Hooks

<h2>📦 Installation</h2>

    $ npm install little-state-machine

<h2>🕹 API</h2>

#### 🔗 `StateMachineProvider`

This is a Provider Component to wrapper around your entire app in order to create context.

```tsx
<StateMachineProvider>
  <App />
</StateMachineProvider>
```

#### 🔗 `createStore`

Function to initialize the global store, invoked at your app root (where `<StateMachineProvider />` lives).

```tsx
function log(store) {
  console.log(store);
  return store;
}

createStore(
  {
    yourDetail: { firstName: '', lastName: '' } // it's an object of your state
  },
  {
     name?: string; // rename the store
     middleWares?: [ log ]; // function to invoke each action
     storageType?: Storage; // session/local storage (default to session)
  },
);
```

#### 🔗 `useStateMachine`

This hook function will return action/actions and state of the app.

```tsx
const { actions, state } = useStateMachine<T>({
  updateYourDetail,
});
```

<h2>💁‍♂️ Tutorial</h2>

Quick video tutorial on little state machine.

<a href="https://scrimba.com/scrim/ceqRebca">
<img src="https://raw.githubusercontent.com/bluebill1049/little-state-machine/master/docs/tutorial.png" />
</a>

<h2>📖 Example</h2>

Check out the <a href="https://codesandbox.io/s/wild-dawn-ud8bq">Demo</a>.

```tsx
import React from 'react';
import {
  StateMachineProvider,
  createStore,
  useStateMachine,
} from 'little-state-machine';

createStore({
  yourDetail: { name: '' },
});

function updateName(state, payload) {
  return {
    ...state,
    yourDetail: {
      ...state.yourDetail,
      ...payload,
    },
  };
}

function YourComponent() {
  const { actions, state } = useStateMachine({ updateName });

  return (
    <div onClick={() => actions.updateName({ name: 'bill' })}>
      {state.yourDetail.name}
    </div>
  );
}

export default () => (
  <StateMachineProvider>
    <YourComponent />
  </StateMachineProvider>
);
```

## ⌨️ Type Safety (TS)

You can create a `global.d.ts` file to declare your GlobalState's type.

Checkout the [example](https://codesandbox.io/s/typescript-forked-xs30h).

```ts
import 'little-state-machine';

declare module 'little-state-machine' {
  interface GlobalState {
    yourDetail: {
      name: string;
    };
  }
}
```

```tsx
import * as React from 'react';
import {
  createStore,
  useStateMachine,
  StateMachineProvider,
  GlobalState,
} from 'little-state-machine';

createStore({
  yourDetail: { name: '' },
});

const updateName = (state: GlobalState, payload: { name: string }) => ({
  ...state,
  yourDetail: {
    ...state.yourDetail,
    ...payload,
  },
});

const YourComponent = () => {
  const { actions, state } = useStateMachine({
    updateName,
  });

  return (
    <div onClick={() => actions.updateName({ name: 'Kotaro' })}>
      {state.yourDetail.name}
    </div>
  );
};

const App = () => (
  <StateMachineProvider>
    <YourComponent />
  </StateMachineProvider>
);
```

<h2>⚒ DevTool</h2>

[DevTool](https://github.com/bluebill1049/little-state-machine-dev-tools) component to track your state change and action.

```tsx
import { DevTool } from 'little-state-machine-devtools';

<StateMachineProvider>
  <DevTool />
</StateMachineProvider>;
```
