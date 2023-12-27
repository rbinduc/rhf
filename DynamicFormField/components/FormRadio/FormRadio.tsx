import React from 'react';
import Radio, {RadioProps} from '@material-ui/core/Radio';
import {FormControl, FormControlLabel, FormLabel, RadioGroup} from '@material-ui/core';
import {Controller, useFormContext} from 'react-hook-form';
import {getLabel, getRequiredLabel, IDynamicFormFieldMode, IValidations} from '../../DynamicFormField';
import ReactHtmlParser from 'react-html-parser';
import styled from '@emotion/styled';
import FormMessage from '../../utils/FormMessage';

// ----------------------------------------------------------------------------
// Props
// ----------------------------------------------------------------------------
export interface IFormRadioProps extends RadioProps {
  label: React.ReactNode;
  validations?: IValidations;
  isDisabled?: boolean;
  isRequired?: boolean;
  mode?: IDynamicFormFieldMode;
  labelId?: string;
  hideAsterisk?: boolean;
  options?: Record<string, any>;
  isHorizontalOptions?: boolean;
}

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------
const FormRadio: React.FC<IFormRadioProps> = ({
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
  options,
  isHorizontalOptions = false,
  ...other
}: IFormRadioProps) => {
  const {
    control,
    formState: {errors},
  } = useFormContext();

  if (!options?.length) {
    return null;
  }

  /**
   * We need custom logic to check if radio is required since isRequired is not enough,
   * so we need to check if value is actually set to boolean value 'true'.
   */
  const rules = {
    ...validations,
    validate: (value: boolean) => (isRequired ? value : true),
  };

  const errorMessage = errors[name!]?.message;
  return (
    <FormControlStyled error={Boolean(errorMessage)} required={isRequired} shrink={mode === IDynamicFormFieldMode.DENSE}>
      {label && (
        <FormLabelStyled component="legend" id={labelId}>
          {label}
        </FormLabelStyled>
      )}
      <Controller
        render={({field}) => (
          <RadioGroup {...field} row={isHorizontalOptions}>
            {options?.map(({label, value}: Record<string, any>) => (
              <FormControlLabelStyled
                key={label}
                control={<RadioStyled disabled={isDisabled} {...other} color={'primary'} />}
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
                value={value}
                className={!!errorMessage ? 'error' : ''}
              />
            ))}
          </RadioGroup>
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
  padding: 0.5rem 0;

  & .MuiRadio-colorPrimary.Mui-checked {
    color: #273446;
  }
`;

const RadioStyled = styled(Radio)`
  &.MuiButtonBase-root {
    padding-top: 0;
    padding-bottom: 0;
  }
  &.MuiFormControlLabel-root {
    align-items: flex-start;
  }
`;

export default FormRadio;
