# little-state-machine

## usage

state.js
```
export default {
    name: 'test',
};
```

app.js
```jsx
import state from './state';
import { StateMachineProvider, store as stateMachineStore, createStore } from './stateMachine';

createStore({
  state,
});

const App = ({children}) => {
    return <StateMachineProvider
      value={{
        store: globalState,
        updateStore,
      }}
    >
        {children}
    </StateMachineProvider>
}
```

action.js
```
function updateName(state, payload) {
    return {
        ...state,
        name: payload,
    }
}
```

yourComponent.js
```jsx
function YourComponent() {
    const {
        state: { name },
    } = useStateMachine(updateName);

    return <div onClick={() => updateName('bill')}>
       {name}
    </div>
}
```
