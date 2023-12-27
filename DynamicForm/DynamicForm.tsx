import React from 'react';
import {FormProvider, UseFormHandleSubmit, UseFormReturn} from 'react-hook-form';
import {IDynamicFormFieldProps} from '../DynamicFormField';
import DynamicFormElements from './DynamicFormElements';
import {ButtonProps} from '@material-ui/core';
import styled from '@emotion/styled';
import {useTranslation} from 'react-i18next';
import {locators} from '../../../../automation/PageLocators';
import {IDynamicForm, ITenantTheme} from '../../../../models';
import {useTheme} from 'emotion-theming';

// ----------------------------------------------------------------------------
// Props
// ----------------------------------------------------------------------------
const {aMandatoryLabel} = locators.componentPersonalDetails ?? {};

export interface IDynamicFormSubmitProps extends ButtonProps {
  buttonText: string;
  enabled?: boolean;
  withBorderTop?: boolean;
  hide?: boolean;
  sticky?: boolean;
}

export interface IDynamicFormProviderProps<V = any> {
  children?: React.ReactNode;
  methods: UseFormReturn<V>;
  onSubmit?: (data: UseFormHandleSubmit<V>) => void;
  formStyles?: {
    [key: string]: string | number;
  };
  defaultFormStyles?: IDynamicForm;
}

export interface IDynamicFormProps extends IDynamicFormProviderProps {
  fields: IDynamicFormFieldProps[];
  submitButton?: IDynamicFormSubmitProps;
  showSubmitButton?: boolean;
  hideMandtoryLabel?: boolean;
}

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------
function DynamicFormProvider<FormValues = any>(props: IDynamicFormProviderProps<FormValues>) {
  const {methods, children, onSubmit, formStyles, defaultFormStyles, ...rest} = props;

  const styles: {[key: string]: string | number} = {
    ...(defaultFormStyles ?? {}),
    ...(formStyles ?? {}),
  };

  const handleSubmit = (data: UseFormHandleSubmit<FormValues>) => {
    if (onSubmit) onSubmit(data);
  };
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)} noValidate {...rest} style={styles}>
        {children}
      </form>
    </FormProvider>
  );
}

const DynamicForm: React.FC<IDynamicFormProps> = ({
  fields,
  submitButton,
  showSubmitButton,
  hideMandtoryLabel,
  ...rest
}: IDynamicFormProps) => {
  const theme: ITenantTheme = useTheme();
  const defaultFormStyles: IDynamicForm = theme?.dynamicForm;
  const showMandatoryLabel = fields?.some((field) => !field?.isHidden) && fields?.some((field) => field?.isRequired);
  const {t} = useTranslation(['common']);
  return (
    <DynamicFormProvider {...rest} defaultFormStyles={defaultFormStyles}>
      {showMandatoryLabel && !hideMandtoryLabel && (
        <LabelStyled>
          <label id={aMandatoryLabel}>* {t('common:mandatory')}</label>
        </LabelStyled>
      )}
      <DynamicFormElements fields={fields} submitButton={submitButton} showSubmitButton={showSubmitButton} />
    </DynamicFormProvider>
  );
};

interface ILabelCSS {
  color?: string;
  fontSize?: string;
}

const LabelStyled = styled.div<ILabelCSS>`
  font-size: 0.625rem;
  text-transform: uppercase;
  font-weight: bold;
  margin-bottom: 1rem;
`;

export default DynamicForm;
