import * as React from 'react';
import styled from '@emotion/styled';
import {FormControl, InputLabel} from '@material-ui/core';
import {Controller, useFormContext} from 'react-hook-form';
import {ITenantTheme} from '../../../../../../models';
import {IDynamicFormFieldMode, IValidations} from '../../DynamicFormField';
import FormMessage from '../../utils/FormMessage';
import ReactHtmlParser from 'react-html-parser';
import SwitchField, {ISwitchFieldProps} from './SwitchField';

export interface IFormSwitchProps extends ISwitchFieldProps {
  rootWidth?: string;
  rootHeight?: string;
  rootPadding?: string;
  onChange?: (e: any) => void | Promise<void>;
  switchOnLabel?: string;
  switchOffLabel?: string;
  theme?: ITenantTheme;
  description?: string;
  validations?: IValidations;
  isRequired?: boolean;
  isDisabled?: boolean;
  labelId?: string;
  mode?: IDynamicFormFieldMode;
}

/**
 * TODO: We need to refactor structure once more and then we can move this components from organisms to molecules.
 * @param param0
 * @returns
 */
const FormSwitch: React.FC<IFormSwitchProps> = ({
  name,
  size = 'medium',
  onChange,
  label,
  mode,
  description,
  validations,
  defaultValue,
  isRequired,
  isDisabled,
  labelId,
  ...other
}) => {
  const {
    control,
    formState: {errors},
  } = useFormContext();

  /**
   * We need custom logic to check if switch is required since isRequired is not enough,
   * so we need to check if value is actually set to boolean value 'true'.
   */
  const rules = {
    ...validations,
    validate: (value: boolean) => (isRequired ? value : true),
  };

  const errorMessage = errors[name!]?.message;
  return (
    <ContainerStyled>
      <BodyStyled>
        <InputLabelStyled htmlFor={name} id={labelId} fontWeight={description ? 700 : 400}>
          {label}
        </InputLabelStyled>
        <FormControl error={Boolean(errorMessage)} required={isRequired}>
          <Controller
            render={({field}) => (
              <SwitchField checked={field.value} label={label} field={field} isDisabled={isDisabled} size={size} {...other} />
            )}
            name={name as any}
            control={control}
            rules={rules}
            defaultValue={defaultValue}
          />
        </FormControl>
        <FormMessage message={errorMessage} margin="dense" />
      </BodyStyled>
      <FooterStyled>
        <FormSwitchTextStyled shrink={mode === IDynamicFormFieldMode.DENSE}>{ReactHtmlParser(description ?? '')}</FormSwitchTextStyled>
      </FooterStyled>
    </ContainerStyled>
  );
};

interface IFormSwitchLabelStyled {
  shrink?: boolean;
}

const FormSwitchTextStyled = styled.span<IFormSwitchLabelStyled>`
  font-size: ${(props) => (props.shrink ? '0.875rem' : '1rem')};
`;

const ContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const BodyStyled = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FooterStyled = styled.div``;

interface IInputLabelProps {
  fontWeight: number;
}

const InputLabelStyled = styled(InputLabel)<IInputLabelProps>`
  & {
    font-size: 1rem;
    font-weight: ${({fontWeight}) => fontWeight};
  }
`;

export default FormSwitch;
