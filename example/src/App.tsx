import React from 'react';
import './App.css';
import Form from './Form';
import yourDetails from './states/yourDetails';
import { StateMachineProvider, createStore, DevTool } from './src';
const merge = require('deepmerge');

window.sessionStorage.setItem(
  'test',
  '{"yourDetails": {"firstname": "hello", "addresses": [{"street": "streetC","suburb": "suburbC","state": "stateC"}]}}',
);

const mergeStore = (sessionData: any, data: any) => merge(data, sessionData);

createStore(
  {
    yourDetails,
  },
  {
    name: 'test',
    syncStores: {
      name: 'yourDetails',
      transform: mergeStore,
      __fuck__: ['yourDetails'],
    },
  },
);

const App: React.FC = () => {
  return (
    <StateMachineProvider>
      <DevTool />
      <div className="App">
        <h1>Little State Machine</h1>
        <Form />
      </div>
    </StateMachineProvider>
  );
};

export default App;
