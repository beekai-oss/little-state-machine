import * as React from 'react';
import { mount } from 'enzyme';
import { useStateMachine, StateMachineProvider, store } from './index';

describe('stateMachine', () => {
  it('should trigger action and update state', () => {
    function What() {
      const { action } = useStateMachine(store => ({
        ...store,
        test: 'test',
      }));
      // @ts-ignore
      return <StateMachineProvider><div onClick={() => action()}>what</div></StateMachineProvider>;
    }

    const tree = mount(<What />);
    tree
      .find('div')
      .at(0)
      .simulate('click');

    expect(store).toEqual({ test: 'test' });
  });
});
