import React from 'react';
import styled from '@emotion/styled';
import {TextField, FormControl, FormControlLabel, InputAdornment} from '@material-ui/core';
import {getLabel} from '../../DynamicFormField';
import {IFormTextFieldProps} from '../FormTextField';
import FormMessage from '../../utils/FormMessage';
import {TenantVector} from '../../../../../icons/TenantVector/TenantVector.component';
import {IconNames} from '../../../../../icons/IconNameConstants';

// ----------------------------------------------------------------------------
// Props
// ----------------------------------------------------------------------------
export type IPickerFieldProps = IFormTextFieldProps & {
  isDirty?: boolean;
  errorMessage?: string;
};

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------
const PickerField = ({
  id,
  name,
  label,
  labelId,
  placeholder,
  isRequired,
  isDisabled,
  value,
  isDirty = false,
  errorMessage = '',
  ...rest
}: IPickerFieldProps) => (
  <FormControlStyled error={Boolean(errorMessage)} required={isRequired}>
    <FormControlLabelStyled
      label={getLabel(label, !!isRequired)}
      id={labelId}
      className={!!errorMessage ? 'error' : ''}
      control={
        <TextField
          {...rest}
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          autoComplete="off"
          error={Boolean(errorMessage)}
          fullWidth
          variant="outlined"
          helperText={<FormMessage message={errorMessage} component={'span'} />}
          disabled={isDisabled}
          required={isRequired}
          InputProps={{
            readOnly: true,
            className: !isDisabled && isDirty ? 'dirty' : '',
            endAdornment: (
              <InputAdornmentStyled position="start">
                <TenantVector tenantVectorName={IconNames.Event} />
              </InputAdornmentStyled>
            ),
          }}
          InputLabelProps={{
            disableAnimation: true,
            shrink: false,
          }}
        />
      }
    />
  </FormControlStyled>
);

// ----------------------------------------------------------------------------
// Styles
// ----------------------------------------------------------------------------
const FormControlStyled = styled(FormControl)`
  width: 100%;
`;

const FormControlLabelStyled = styled(FormControlLabel)`
  display: flex;
  flex-direction: column-reverse;
  width: 100%;
  align-items: baseline;
  margin: 0;
  & .MuiFormControlLabel-label {
    margin-bottom: 0.3125rem;
  }

  & .MuiInputBase-input {
    text-transform: capitalize;
  }

  & .MuiOutlinedInput-adornedEnd {
    padding-right: 0;
  }
`;

const InputAdornmentStyled = styled(InputAdornment)`
  position: absolute;
  right: 0.5rem;
`;

export default PickerField;
