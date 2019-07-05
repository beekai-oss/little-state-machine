<div align="center"><img src="https://github.com/bluebill1049/little-state-machine/blob/master/docs/logo.png" alt="React forme Logo - React hook form valiation" width="180px" />
    <h1>Little State Machine</h2>
</div>

> Flux state management should be easy

[![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=Little-State-Machine&url=https://github.com/bluebill1049/little-state-machine)&nbsp; [![npm downloads](https://img.shields.io/npm/dm/little-state-machine.svg?style=flat-square)](https://www.npmjs.com/package/little-state-machine)
[![npm](https://img.shields.io/npm/dt/little-state-machine.svg?style=flat-square)](https://www.npmjs.com/package/little-state-machine)
[![npm](https://badgen.net/bundlephobia/minzip/little-state-machine)](https://badgen.net/bundlephobia/minzip/little-state-machine)

- Follow flux application architecture
- Tiny with 0 dependency and simple
- Persist your state by default
- Build with React Hook

## Install

    $ npm install little-state-machine
    
## [Demo](https://codesandbox.io/s/lrz5wloklm)
Check out the [Demo](https://codesandbox.io/s/lrz5wloklm).
    
## API
##### 🔗 `StateMachineProvider`
This is a Provider Component to wrapper around your entire app in order to create context.

##### 🔗 `createStore`
Function to initial the global store, call at app root where `StateMachineProvider` is.

##### 🔗 `useStateMachine(Action | Actions, Options) =>` 
`{ action: (any) => void, actions: { [key: string] : (any) => void}, state: Object }`

```typescript
// individual action
Action: (store: Object, payload: any) => void;
// multiple actions
Actions: { [key: string] : Action }
// options to name action in debug, and weather trigger global state update to re-render entire app 
Options: {
  debugName: string, // unique debug name can really help you :)
  shouldReRenderApp: boolean, 
}
```

This hook function will return action/actions and state of the app. 

## Dev tools

##### 🔗 `window.STATE_MACHINE_DEBUG`
This will toggle the console output in dev tool.

`window.LITTLE_STATE_MACHINE_DEBUG(true)` to turn debug on in console

`window.LITTLE_STATE_MACHINE_DEBUG(false)` to turn off debug on in console

<img width="500" src="https://github.com/bluebill1049/little-state-machine/blob/master/docs/devtool.png" />

##### 🔗 `window.STATE_MACHINE_RESET`
This will reset the entire store.

`window.LITTLE_STATE_MACHINE_RESET()` to reset the localStorage or sessionStorage
 
## Example

app.js
```jsx
import React, { useState } from 'react'
import yourDetail from './yourDetail'
import YourComponent from './yourComponent'
import { StateMachineProvider, createStore } from 'little-state-machine'

// create your store
createStore({
  yourDetail,
});

const App = ({children}) => {
  return (
    <StateMachineProvider>
      <YourComponent />
    </StateMachineProvider>
  )
}
```

yourComponent.js
```jsx
import React from 'react'
import { updateName } from './action.js'
import { useStateMachine } from 'little-state-machine'

export default function YourComponent() {
  const {
    action,
    state: { yourDetail: { name } },
  } = useStateMachine(updateName);

  return <div onClick={() => action('bill')}>
    {name}
  </div>
}
```

yourDetail.js
```js
export default {
  name: 'test',
}
```

action.js
```js
export function updateName(state, payload) {
  return {
    ...state,
    yourDetail: payload,
  }
}
```
