import React from 'react';
import {Controller, useFormContext} from 'react-hook-form';
import FormCalendarDurationComponent, {IFormCalendarDurationProps} from './FormCalendarDurationComponent';

const FormCalendarDuration = (props: IFormCalendarDurationProps) => {
  const {name, defaultValue = '', validations, ...rest} = props;
  const {
    control,
    formState: {errors, dirtyFields},
  } = useFormContext();
  const errorMessage = errors[name]?.message;
  const isDirty = !!dirtyFields[name];

  return (
    <Controller
      control={control}
      defaultValue={defaultValue}
      name={name}
      rules={validations}
      render={({field}) => <FormCalendarDurationComponent {...rest} {...field} name={name} errorMessage={errorMessage} isDirty={isDirty} />}
    />
  );
};

export default FormCalendarDuration;
