import React from 'react';
import {Controller, useFormContext} from 'react-hook-form';
import MonthAndYearPickerComponent, {IMonthAndYearPickerComponentProps} from './MonthAndYearPickerComponent';

export type IFormMonthAndYearPickerProps = IMonthAndYearPickerComponentProps;

const FormMonthAndYearPicker = (props: IFormMonthAndYearPickerProps) => {
  const {name, defaultValue = '', validations, ...rest} = props;
  const {
    control,
    formState: {errors, dirtyFields},
  } = useFormContext();
  const errorMessage = errors[name!]?.message;
  const isDirty = !!dirtyFields[name!];

  return (
    <Controller
      control={control}
      defaultValue={defaultValue}
      name={name!}
      rules={validations}
      render={({field}) => <MonthAndYearPickerComponent {...rest} {...field} name={name} errorMessage={errorMessage} isDirty={isDirty} />}
    />
  );
};

export default FormMonthAndYearPicker;
