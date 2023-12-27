import React from 'react';
import Slider, {SliderProps} from '@material-ui/core/Slider';
import {FormControl, InputLabel} from '@material-ui/core';
import {Controller, useFormContext} from 'react-hook-form';
import {getLabel, IDynamicFormFieldMode, IValidations} from '../../DynamicFormField';
import styled from '@emotion/styled';
import FormMessage from '../../utils/FormMessage';

// ----------------------------------------------------------------------------
// Props
// ----------------------------------------------------------------------------
export interface IFormSliderProps extends SliderProps {
  label: React.ReactNode;
  validations?: IValidations;
  isDisabled?: boolean;
  isRequired?: boolean;
  mode?: IDynamicFormFieldMode;
  labelId?: string;
  hideAsterisk?: boolean;
  placeholder?: string;
  onChangeExtra?: (event: any, newValue: string) => void;
}

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------
const FormSlider: React.FC<IFormSliderProps> = ({
  name,
  label,
  validations,
  defaultValue,
  isRequired = false,
  mode,
  labelId = '',
  hideAsterisk = false,
  value,
  placeholder,
  min,
  max,
  step,
  onChangeExtra,
}: IFormSliderProps) => {
  const {
    control,
    formState: {errors},
  } = useFormContext();

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
    <>
      {label && (
        <InputLabelStyled shrink={false} htmlFor={name} className={errorMessage && 'error'} id={labelId}>
          {getLabel(label, !!isRequired, hideAsterisk)}
        </InputLabelStyled>
      )}
      {value}
      <FormControlStyled error={Boolean(errorMessage)} required={isRequired} shrink={mode === IDynamicFormFieldMode.DENSE} fullWidth>
        <Controller
          render={({field}) => (
            <>
              <SliderValueStyled shrink={false} htmlFor={name} className={errorMessage && 'error'} id={labelId}>
                {field.value} {placeholder}
              </SliderValueStyled>
              <SliderStyled
                {...field}
                min={min}
                max={max}
                step={step}
                aria-label="Default"
                valueLabelDisplay="auto"
                onChange={(_, newValue) => {
                  field.onChange(newValue);
                  if (typeof onChangeExtra === 'function') {
                    onChangeExtra(_, field?.value);
                  }
                }}
              />
            </>
          )}
          name={name!}
          control={control}
          rules={rules}
          defaultValue={defaultValue}
        />
        <FormMessage message={errorMessage} margin="dense" />
      </FormControlStyled>
    </>
  );
};

interface IFormControlStyled {
  shrink?: boolean;
}

const FormControlStyled = styled(({shrink, ...rest}) => <FormControl {...rest} />)<IFormControlStyled>`
  width: 97%;
  & .MuiFormControlLabel-label {
    line-height: 1.3;
    font-size: ${(props) => (props.shrink ? '0.875rem' : '1rem')};
  }
`;

const InputLabelStyled = styled(InputLabel)`
  .MuiFormLabel-asterisk {
    display: none;
  }
`;

const SliderValueStyled = styled(InputLabel)`
  position: inherit;
  transform: inherit;
`;

const SliderStyled = styled(Slider)`
  padding: 0;
`;

export default FormSlider;
