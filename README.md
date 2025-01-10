<div align="center">
    <h1>📠 Little State Machine</h1>
    
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
- Fine-tune the performance with partial render and selector

<h2>📦 Installation</h2>

    $ npm install little-state-machine

<h2>🕹 API</h2>

#### 🔗 `createStore`

Function to initialize the global store.

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
     persist?: 'action' // onAction is default if not provided
     // when 'none' is used then state is not persisted
     // when 'action' is used then state is saved to the storage after store action is completed
     // when 'beforeUnload' is used then state is saved to storage before page unloa
  },
);
```

#### 🔗 `useStateMachine`

This hook function will return action/actions and the state of the app.

```tsx
// Optional selector to isolate re-render based selected state
const selector = state => state.data;

const { actions, state, getState } = useStateMachine<T>({
  actions: {
    updateYourDetail,
  }
  selector,
});
```

<h2>📖 Example</h2>

Check out the <a href="https://codesandbox.io/p/sandbox/compassionate-forest-ql3f56?workspaceId=ws_4xFLLpCJQLXZtvdkd1DS72">Demo</a>.

```tsx
import { createStore, useStateMachine } from 'little-state-machine';

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

function selector(state) {
  return state.yourDetails.name.length > 10;
}

function YourComponent() {
  const { actions, state } = useStateMachine({ actions: { updateName } });

  return (
    <buttton onClick={() => actions.updateName({ name: 'bill' })}>
      {state.yourDetail.name}
    </buttton>
  );
}

function YourComponentSelectorRender() {
  const { state } = useStateMachine({ selector });
  return <p>{state.yourDetail.name]</p>;
}

const App = () => (
  <>
    <YourComponent />
    <YourComponentSelectorRender />
  </>
);
```

## ⌨️ Type Safety (TS)

You can create a `global.d.ts` file to declare your GlobalState's type.

Check out the [example](https://codesandbox.io/s/typescript-forked-xs30h).

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

## ⌨️ Migrate to V5

- `StateMachineProvider` has been removed, simple API

```diff
const App = () => (
- <StateMachineProvider>
    <YourComponent />
- <StateMachineProvider>
);
```

- Actions now is an object payload `useStateMachine({ actions: { updateName } })`
- Upgrade react >= 18

## By the makers of BEEKAI

We also make [BEEKAI](https://www.beekai.com/). Build the next-generation forms with modern technology and best in class user experience and accessibility.

<h2>🤝 Contributors</h2>

Thanks go to these wonderful people:

<a href="https://github.com/beekai-oss/little-state-machine/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=beekai-oss/little-state-machine" />
</a>
