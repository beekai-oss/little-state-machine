<div align="center"><img src="https://github.com/bluebill1049/little-state-machine/blob/master/docs/logo.png" alt="React forme Logo - React hook form valiation" width="180px" />
    <h1 style="font-weight: 100">Little State Machine</h2>
</div>

> Flux state management should be easy

[![Tweet](https://img.shields.io/twitter/url/http/shields.io.svg?style=social)](https://twitter.com/intent/tweet?text=Little-State-Machine&url=https://github.com/bluebill1049/little-state-machine)&nbsp; [![npm downloads](https://img.shields.io/npm/dm/little-state-machine.svg?style=flat-square)](https://www.npmjs.com/package/little-state-machine)
[![npm](https://img.shields.io/npm/dt/little-state-machine.svg?style=flat-square)](https://www.npmjs.com/package/little-state-machine)
[![npm](https://img.shields.io/npm/l/little-state-machine.svg?style=flat-square)](https://www.npmjs.com/package/react-lazyload-image)

- Follow flux application architecture
- Tiny and simple (663B)
- Persist your state by default
- Build with React Hook

## Install

    $ npm install little-state-machine
    
## [Demo](https://codesandbox.io/s/lrz5wloklm)
Check out the [Demo](https://codesandbox.io/s/lrz5wloklm).
    
## API
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
##### 🔗 `useStateMachine(Action | Actions, Options) =>` 
`{ action: (any) => void, actions: { [key: string] : (any) => void}, state: Object }`

This hook function will return action/actions and state of the app. 

##### 🔗 `window.STATE_MACHINE = true`
This will turn on the dev tool at console.

<img width="500" src="https://github.com/bluebill1049/little-state-machine/blob/master/docs/devtool.png" />

##### 🔗 `StateMachineProvider`
This is a Component to wrapper around your entire app in order to create context.

##### 🔗 `createStore`
Function to initial the global store, call at app root where `StateMachineProvider` is.

##### 🔗 `store`
The global store. 
 
## Example

app.js
```jsx
import React, { useState } from 'react'
import state from './state'
import YourComponent from './yourComponent'
import { StateMachineProvider, store, createStore } from 'little-state-machine'

// create your store
createStore({
  state,
});

const App = ({children}) => {
  const [globalState, updateStore] = useState(stateMachineStore);
  
  return <StateMachineProvider
    value={{
      store: globalState,
      updateStore,
    }}
  >
    <YourComponent />
  </StateMachineProvider>
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
    state: { name },
  } = useStateMachine(updateName);

  return <div onClick={() => action('bill')}>
    {name}
  </div>
}
```

state.js
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
    name: payload,
  }
}
```
