import React from 'react';
import './App.css';
import Form from './Form';
import yourDetails from './states/yourDetails';
import { StateMachineProvider, createStore, DevTool } from './src';

createStore(
  {
    yourDetails,
  },
  {
    name: 'test',
    middleWares: [],
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
