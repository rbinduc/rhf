import React from 'react';
import styled from '@emotion/styled';
import {FormControl, InputLabel} from '@material-ui/core';
import {Controller, useFormContext} from 'react-hook-form';
import SelectField, {ISelectFieldProps} from './SelectField';
import {IValidations} from '../../../DynamicForm';
import {getLabel} from '../../DynamicFormField';
import FormMessage from '../../utils/FormMessage';

export type IFormSelectProps = ISelectFieldProps & {
  isDisabled?: boolean;
  isRequired?: boolean;
  labelId?: string;
  validations?: IValidations;
  hideAsterisk?: boolean;
};

const FormSelect: React.FC<IFormSelectProps> = ({
  name,
  label,
  defaultValue,
  isRequired,
  isDisabled,
  hideAsterisk,
  options,
  labelId,
  validations,
  ...other
}) => {
  const {
    control,
    formState: {errors, dirtyFields},
  } = useFormContext();
  const errorMessage = errors[name!]?.message;
  const isDirty = !!dirtyFields[name!];
  return (
    <FormControl variant="outlined" required={isRequired} fullWidth disabled={isDisabled} error={Boolean(errorMessage)}>
      {label && (
        <InputLabelStyled shrink={false} htmlFor={name} className={errorMessage && 'error'} id={labelId}>
          {getLabel(label, !!isRequired, hideAsterisk)}
        </InputLabelStyled>
      )}
      <Controller
        name={name as any}
        control={control}
        defaultValue={defaultValue}
        rules={validations}
        render={({field}) => (
          <SelectField
            label={label}
            labelId={labelId}
            options={options!}
            required={!!isRequired}
            disabled={!!isDisabled}
            field={field}
            isDirty={isDirty}
            {...other}
          />
        )}
      />
      <FormMessage message={errorMessage} margin="dense" />
    </FormControl>
  );
};

const InputLabelStyled = styled(InputLabel)`
  .MuiFormLabel-asterisk {
    display: none;
  }
`;

export default FormSelect;
