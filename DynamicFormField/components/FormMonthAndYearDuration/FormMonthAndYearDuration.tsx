import React from 'react';
import {Controller, useFormContext} from 'react-hook-form';
import {IDynamicFormFieldProps} from '../../../DynamicForm';
import MonthAndYearDurationComponent from './MonthAndYearDurationComponent';

export interface IMonthAndYearDuration {
  months: number;
  years: number;
}

export interface IFormMonthAndYearDurationProps extends Omit<IDynamicFormFieldProps, 'inputType'> {
  isDirty?: boolean;
  errorMessage?: string;
  ariaLabelMonth?: string;
  ariaLabelYear?: string;
  maxMonths: number;
  maxYears: number;
}

const FormMonthAndYearDuration = (props: IFormMonthAndYearDurationProps) => {
  const {name, defaultValue = '', validations, ...rest} = props;
  const {
    control,
    formState: {errors, dirtyFields},
  } = useFormContext();
  const errorMessage = errors[name!]?.message;
  const isDirty = !!dirtyFields[name!];

  const rules = {
    ...validations,
    validate: (value: IMonthAndYearDuration) => {
      return !!value?.years || !!value?.months;
    },
  };

  return (
    <Controller
      control={control}
      defaultValue={defaultValue}
      name={name!}
      rules={rules}
      render={({field}) => <MonthAndYearDurationComponent {...rest} {...field} name={name} errorMessage={errorMessage} isDirty={isDirty} />}
    />
  );
};

export default FormMonthAndYearDuration;
