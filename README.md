<div align="center"><a href="https://lrz5wloklm.csb.app/"><img src="https://github.com/bluebill1049/little-state-machine/blob/master/docs/logo.png?raw=true" alt="Little State Machine - React Hooks for state management" width="140px" /></a>
    <h1>Little State Machine</h2>
    
State management made super simple
</div>

<div align="center">

[![npm downloads](https://img.shields.io/npm/dm/little-state-machine.svg?style=for-the-badge)](https://www.npmjs.com/package/little-state-machine)
[![npm](https://img.shields.io/npm/dt/little-state-machine.svg?style=for-the-badge)](https://www.npmjs.com/package/little-state-machine)
[![npm](https://img.shields.io/bundlephobia/minzip/little-state-machine?style=for-the-badge)](https://bundlephobia.com/result?p=little-state-machine)

</div>

<h2>✨ Features</h2>

- Tiny with 0 dependency and simple (less than 1.5kb)
- Persist state by default (`sessionStorage` or `localStorage`)
- Build with React Hooks
- Compatible with React Native

<h2>📦 Installation</h2>

    $ npm install little-state-machine

<h2>🖥 <a href="https://codesandbox.io/s/lrz5wloklm">Demo</a></h2>
Check out the <a href="https://codesandbox.io/s/lrz5wloklm">Demo</a>.
<br />
  
<h2>🕹 API</h2>

##### 🔗 `StateMachineProvider`

This is a Provider Component to wrapper around your entire app in order to create context.

##### 🔗 `createStore`

```ts
createStore(store, options?: {
 name: string; // rename the store
 middleWares?: Function[]; // function to invoke each action
 syncStores?:  // sync with external store in your session/local storage
    | Record<string, string[]>
    | { externalStoreName: string; transform: Function } // name of the external store, and state to sync
    | { externalStoreName: string; transform: Function }[];
}})
```

Function to initialize the global store, invoked at your app root (where `<StateMachineProvider />` lives).

```ts
import yourDetail from './state/yourDetail';

function log(store) {
  console.log(store);
}

createStore(
  {
    yourDetail, // it's an object of your state { firstName: '', lastName: '' }
  },
  {
    middleWares: [log], // an array of middleWares, which gets run each actions
    syncStores: {
      // you can sync with external store and transform the data
      externalStoreName: 'externalStoreName',    
      // alternative you can just specify the store name and root state name { yourDetails: { firstName: '' } }
      // externalStoreName: ['yourDetail'],
      transform: ({ externalStoreData, currentStoreData }) => {
        return { ...externalStoreData, ...currentStoreData };
      },
    },
    // or you can pass in an array of transform function
    // syncStores : [
    //   {
    //     externalStoreName: 'externalStoreName',
    //     transform: ({ externalStoreData, currentStoreData }) => {
    //       return { ...externalStoreData, ...currentStoreData };
    //     },
    //   }
    // ]
  },
);
```

##### 🔗 `useStateMachine`

This hook function will return action/actions and state of the app.

```typescript
import { updateUserNameAction, removeNameAction } from './actions/yourDetails';

const { action, state } = useStateMachine(updateUserNameAction);
const { actions, state } = useStateMachine({
  removeNameAction,
  updateUserNameAction,
});

// The following examples are for optional argument
const { action, state } = useStateMachine(updateUserNameAction, {
  shouldReRenderApp: false, // This will prevent App from re-render and only update the store
});
```

<h2>📖 Example</h2>

📋 `app.js`

```jsx
import React from 'react';
import yourDetail from './yourDetail';
import YourComponent from './yourComponent';
import { StateMachineProvider, createStore } from 'little-state-machine';
import { DevTool } from 'little-state-machine-devtools';

// create your store
createStore({
  yourDetail,
});

export default () => {
  return (
    <StateMachineProvider>
      <DevTool />
      <YourComponent />
    </StateMachineProvider>
  );
};
```

📋 `yourComponent.js`

```jsx
import React from 'react';
import { updateName } from './action.js';
import { useStateMachine } from 'little-state-machine';

export default function YourComponent() {
  const {
    action,
    state: {
      yourDetail: { name },
    },
  } = useStateMachine(updateName);

  return <div onClick={() => action({ name: 'bill' })}>{name}</div>;
}
```

📋 `yourDetail.js`

```js
export default {
  name: 'test',
};
```

📋 `action.js`

```js
export function updateName(state, payload) {
  return {
    ...state,
    yourDetail: {
      ...state.yourDetail,
      ...payload,
    },
  };
}
```

<h2>⚒ Little State Machine DevTool</h2>

[DevTool](https://github.com/bluebill1049/little-state-machine-dev-tools) component to track your state change and action. 

```jsx
import { DevTool } from 'little-state-machine-devtools';

<StateMachineProvider>
  <DevTool />
</StateMachineProvider>;
```

<div align="center">
  <a href="https://lrz5wloklm.csb.app/">
    <img width="500" src="https://github.com/bluebill1049/little-state-machine/blob/master/docs/DevToolScreen.png?raw=true" />
  </a>
</div>

<h2>🖥 Browser Compatibility</h2>
Little State Machine supports all major browsers

For legacy IE11 support, you can import little-state-machine IE11 version.

```js
import { createStore } from 'little-state-machine/dist/little-state-machine.ie11'
```


<h2>📋 Polyfill</h2>

Consider adding `Object.entries()` polyfill if you're wondering to have support for old browsers.
You can weather consider adding snippet below into your code, ideally before your App.js file:

`utils.[js|ts]`
```js
if (!Object.entries) {
  Object.entries = function( obj ){
    var ownProps = Object.keys( obj ),
        i = ownProps.length,
        resArray = new Array(i); // preallocate the Array
    while (i--)
      resArray[i] = [ownProps[i], obj[ownProps[i]]];    
    return resArray;
  };
}
```

Or you can add [core-js](https://github.com/zloirock/core-js) polyfill into your project and add `core-js/es/object/entries` in your `polyfills.[js|ts]` file.

## Sponsors

Thank you very much for those kind people with their sponsorship to this project.

<p>
    <a href="https://github.com/sayav"
    ><img
            src="https://avatars1.githubusercontent.com/u/42376060?s=60&amp;v=4"
            width="50"
            height="50"
            alt="@sayav"
    /></a>
    <a href="https://github.com/lemcii"
    ><img
            src="https://avatars1.githubusercontent.com/u/35668113?s=60&amp;v=4"
            width="50"
            height="50"
            alt="@lemcii"
    /></a>
    <a href="https://github.com/washingtonsoares"
    ><img
            src="https://avatars2.githubusercontent.com/u/5726150?s=60&amp;v=4"
            width="50"
            height="50"
            alt="@washingtonsoares"
    /></a>
    <a href="https://github.com/lixunn"
    ><img
            src="https://avatars2.githubusercontent.com/u/5017964?s=60&amp;v=4"
            width="50"
            height="50"
            alt="@lixunn"
    /></a>
    <a href="https://github.com/SamSamskies"
    ><img
            src="https://avatars2.githubusercontent.com/u/3655410?s=60&amp;v=4"
            width="50"
            height="50"
            alt="@SamSamskies"
    /></a>
    <a href="https://github.com/peaonunes"
    ><img
            src="https://avatars2.githubusercontent.com/u/3356720?s=60&amp;v=4"
            width="50"
            height="50"
            alt="@peaonunes"
    /></a>
    <a href="https://github.com/wilhelmeek"
    ><img
            src="https://avatars2.githubusercontent.com/u/609452?s=60&amp;v=4"
            width="50"
            height="50"
            alt="@wilhelmeek"
    /></a>
    <a href="https://github.com/iwarner"
    ><img
            src="https://avatars2.githubusercontent.com/u/279251?s=60&amp;v=4"
            width="50"
            height="50"
            alt="@iwarner"
    /></a>
    <a href="https://github.com/joejknowles"
    ><img
            src="https://avatars2.githubusercontent.com/u/10728145?s=60&amp;v=4"
            width="50"
            height="50"
            alt="@joejknowles"
    /></a>
    <a href="https://github.com/chris-gunawardena"
    ><img
            src="https://avatars0.githubusercontent.com/u/5763108?s=60&amp;v=4"
            width="50"
            height="50"
            alt="@chris-gunawardena"
    /></a>
    <a href="https://github.com/Tymek"
    ><img
            src="https://avatars1.githubusercontent.com/u/2625371?s=60&amp;v=4"
            width="50"
            height="50"
            alt="@Tymek"
    /></a>
    <a href="https://github.com/Luchanso"
    ><img
            src="https://avatars0.githubusercontent.com/u/2098777?s=60&amp;v=4"
            width="50"
            height="50"
            alt="@Luchanso"
    /></a>
    <a href="https://github.com/vcarel"
    ><img
            src="https://avatars1.githubusercontent.com/u/1541093?s=60&amp;v=4"
            width="50"
            height="50"
            alt="@vcarel"
    /></a>
    <a href="https://github.com/gragland"
    ><img
            src="https://avatars0.githubusercontent.com/u/1481077?s=60&amp;v=4"
            width="50"
            height="50"
            alt="@gragland"
    /></a>
    <a href="https://github.com/tjshipe"
    ><img
            src="https://avatars2.githubusercontent.com/u/1254942?s=60&amp;v=4"
            width="50"
            height="50"
            alt="@tjshipe"
    /></a>
    <a href="https://github.com/krnlde"
    ><img
            src="https://avatars1.githubusercontent.com/u/1087002?s=60&amp;v=4"
            width="50"
            height="50"
            alt="@krnlde"
    /></a>
    <a href="https://github.com/msutkowski"
    ><img
            src="https://avatars2.githubusercontent.com/u/784953?s=60&amp;v=4"
            width="50"
            height="50"
            alt="@msutkowski"
    /></a>
    <a href="https://github.com/mlukaszczyk"
    ><img
            src="https://avatars3.githubusercontent.com/u/599247?s=60&amp;v=4"
            width="50"
            height="50"
            alt="@mlukaszczyk"
    /></a>
</p>


