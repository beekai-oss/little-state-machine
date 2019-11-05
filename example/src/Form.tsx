import * as React from 'react';
import { updateFirstLastName } from './actions/yourDetails';
import useForm from 'react-hook-form';
import { useStateMachine } from './src';

const Form: React.FC = () => {
  const { handleSubmit, register } = useForm();
  const { state, action } = useStateMachine(updateFirstLastName, {
    debugName: 'test',
  });

  const onSubmit = (data: any) => {
    action({
      ...data,
      // @ts-ignore
      submitCounter: state.yourDetails.submitCounter + 1,
    });
  };

  return (
    <section>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>First name:</label>
        <input
          name="firstname"
          placeholder="First name"
          ref={register}
          // @ts-ignore
          defaultValue={state && state.yourDetails.firstname}
        />
        <label>Last name:</label>
        <input
          name="lastname"
          placeholder="Last name"
          ref={register}
          // @ts-ignore
          defaultValue={state && state.yourDetails.lastname}
        />
        <input type="submit" />
      </form>
    </section>
  );
};

export default Form;
