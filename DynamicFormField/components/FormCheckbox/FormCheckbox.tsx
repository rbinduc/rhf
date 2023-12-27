import React from 'react';
import Checkbox, {CheckboxProps} from '@material-ui/core/Checkbox';
import {FormControl, FormControlLabel, FormLabel} from '@material-ui/core';
import {Controller, useFormContext} from 'react-hook-form';
import {getLabel, getRequiredLabel, IDynamicFormFieldMode, IValidations} from '../../DynamicFormField';
import FormMessage from '../../utils/FormMessage';
import {CheckedIcon} from '../../../../../icons/global/checkbox/Checked';
import {UncheckedIcon} from '../../../../../icons/global/checkbox/Unchecked';
import ReactHtmlParser from 'react-html-parser';
import styled from '@emotion/styled';

// ----------------------------------------------------------------------------
// Props
// ----------------------------------------------------------------------------
export interface IFormCheckboxProps extends CheckboxProps {
  label: React.ReactNode;
  validations?: IValidations;
  isDisabled?: boolean;
  isRequired?: boolean;
  mode?: IDynamicFormFieldMode;
  labelId?: string;
  hideAsterisk?: boolean;
}

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------
const FormCheckbox: React.FC<IFormCheckboxProps> = ({
  name,
  label,
  validations,
  isDisabled,
  defaultValue,
  isRequired = false,
  title,
  mode,
  labelId = '',
  hideAsterisk = false,
  ...other
}: IFormCheckboxProps) => {
  const {
    control,
    formState: {errors},
  } = useFormContext();

  /**
   * We need custom logic to check if checkbox is required since isRequired is not enough,
   * so we need to check if value is actually set to boolean value 'true'.
   */
  const rules = {
    ...validations,
    validate: (value: boolean) => (isRequired ? value : true),
  };

  const errorMessage = errors[name!]?.message;
  return (
    <FormControlStyled error={Boolean(errorMessage)} required={isRequired} shrink={mode === IDynamicFormFieldMode.DENSE}>
      {title && <FormLabelStyled component="legend">{title}</FormLabelStyled>}
      <Controller
        render={({field}) => (
          <FormControlLabelStyled
            control={
              <CheckboxStyled
                {...other}
                icon={<UncheckedIcon />}
                checkedIcon={<CheckedIcon />}
                disabled={isDisabled}
                inputProps={{
                  'aria-label': label && typeof label === 'string' ? label : '',
                  'aria-hidden': isDisabled,
                  ...other.inputProps,
                }}
                color={'primary'}
              />
            }
            label={
              typeof label === 'string' ? (
                ReactHtmlParser(!!title ? label : getLabel(label, isRequired, hideAsterisk))
              ) : (
                <>
                  {label}
                  {getRequiredLabel(isRequired, hideAsterisk)}
                </>
              )
            }
            onChange={(e) => field.onChange((e.target as HTMLInputElement).checked)}
            checked={field.value}
            id={labelId}
          />
        )}
        name={name!}
        control={control}
        rules={rules}
        defaultValue={defaultValue}
      />
      <FormMessage message={errorMessage} margin="dense" />
    </FormControlStyled>
  );
};

interface IFormControlStyled {
  shrink?: boolean;
}

const FormControlStyled = styled(({shrink, ...rest}) => <FormControl {...rest} />)<IFormControlStyled>`
  & .MuiFormControlLabel-label {
    line-height: 1.3;
    font-size: ${(props) => (props.shrink ? '0.875rem' : '1rem')};
  }
`;

const FormLabelStyled = styled(FormLabel)<any>`
  font-size: 1rem;
  font-style: normal;
  font-weight: 700;
  line-height: 1.375rem;
  letter-spacing: 0;
  text-align: left;
  padding-bottom: 0.625rem;
`;

const FormControlLabelStyled = styled(FormControlLabel)`
  align-items: flex-start;
`;

const CheckboxStyled = styled(Checkbox)`
  &.MuiButtonBase-root {
    padding-top: 0;
    padding-bottom: 0;
  }
  &.MuiFormControlLabel-root {
    align-items: flex-start;
  }
`;

export default FormCheckbox;
