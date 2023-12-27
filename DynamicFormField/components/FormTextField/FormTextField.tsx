import React, {ChangeEvent, KeyboardEvent} from 'react';
import {FormControl, FormControlLabel, TextFieldProps} from '@material-ui/core';
import {Controller, Message, useFormContext} from 'react-hook-form';
import TextField from './TextField';
import {getLabel, IValidations} from '../../DynamicFormField';
import FormMessage from '../../utils/FormMessage';
import styled from '@emotion/styled';

// ----------------------------------------------------------------------------
// Props
// ----------------------------------------------------------------------------
export type IFormTextFieldProps = TextFieldProps & {
  validations?: IValidations;
  endIcon?: React.ReactNode;
  startIcon?: React.ReactNode;
  isDisabled?: boolean;
  isRequired?: boolean;
  labelId?: string;
  hideAsterisk?: boolean;
  blackListEmailDomains?: string[];
  skipBlurValidation?: boolean;
};

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------
const FormTextField: React.FC<IFormTextFieldProps> = ({
  label,
  name,
  defaultValue,
  validations,
  endIcon,
  startIcon,
  isRequired,
  isDisabled,
  labelId = '',
  placeholder = '',
  hideAsterisk,
  blackListEmailDomains = [],
  skipBlurValidation,
  ...other
}: IFormTextFieldProps) => {
  const {
    control,
    watch,
    formState: {errors, dirtyFields},
  } = useFormContext();
  const {multiline} = other;
  const value = watch(name!);
  const maxLength = (validations?.maxLength as any)?.value;
  const errorMessage = errors[name!]?.message;
  const isDirty = !!dirtyFields[name!];

  const rules = {
    ...validations,
    validate: (value: string) => {
      let isValid: Message | boolean = true;
      if (!!blackListEmailDomains?.length) {
        isValid =
          !blackListEmailDomains?.some((domain: string) => value.toLowerCase().includes(domain.toLowerCase())) ||
          (validations?.validateMessage as Message);
      }

      return isValid || !isRequired || !!value?.trim();
    },
  };

  return (
    <FormControlStyled error={Boolean(errorMessage)} required={isRequired}>
      <Controller
        defaultValue={defaultValue}
        render={({field}) => (
          <FormControlLabelStyled
            control={
              <TextField
                error={Boolean(errorMessage)}
                fullWidth
                variant="outlined"
                helperText={<FormMessage message={errorMessage} component={'span'} />}
                disabled={isDisabled}
                {...other}
                {...field}
                placeholder={placeholder}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  field?.onChange((event?.target?.value ?? '')?.replace(/\s{2,}/g, ' ')?.trimStart())
                }
                onBlur={(event: ChangeEvent<HTMLInputElement>) => !skipBlurValidation && field?.onChange(event?.target?.value?.trim())}
                onKeyDown={(event: KeyboardEvent) => {
                  if (event.keyCode === 13) {
                    field?.onChange(field?.value?.trim());
                  }
                }}
                required={isRequired}
                InputProps={{
                  readOnly: isDisabled,
                  startAdornment: startIcon,
                  endAdornment: endIcon,
                  className: isDirty ? 'dirty' : '',
                }}
                InputLabelProps={{
                  disableAnimation: true,
                  shrink: false,
                }}
                inputProps={{
                  'aria-label': label && typeof label === 'string' ? label : placeholder,
                  'aria-hidden': isDisabled,
                  ...other.inputProps,
                }}
              />
            }
            label={getLabel(label, !!isRequired, hideAsterisk)}
            id={labelId}
            className={!!errorMessage ? 'error' : ''}
          />
        )}
        name={name!}
        control={control}
        rules={rules}
      />
      {multiline && maxLength && (
        <FormMessageStyled>
          {maxLength - (value ? value.length : 0)} / {maxLength}
        </FormMessageStyled>
      )}{' '}
      {/** Refactor with form message component once PR containing new components gets merged */}
    </FormControlStyled>
  );
};

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

  & .MuiOutlinedInput-multiline {
    height: auto;
    min-height: 3.5rem;
  }
`;

const FormMessageStyled = styled.span`
  font-size: 0.6rem;
  position: absolute;
  bottom: 0.625rem;
  right: 0.625rem;
  color: #959eaa;
`;

export default FormTextField;
