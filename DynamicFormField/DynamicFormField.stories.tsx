import React from 'react';
import {storiesOf} from '@storybook/react';
import DynamicFormField, {IDynamicFormFieldProps, DynamicFormFieldType} from './DynamicFormField';
import useFormHook from './utils/hooks/useFormHook';
import {themeMock} from './../../../themes/theme-mock';
import {FormProvider} from 'react-hook-form';
import {ThemeProvider} from 'emotion-theming';

const dynamicFormTextFieldProps: IDynamicFormFieldProps = {
  inputType: DynamicFormFieldType.TEXT,
  id: 'firstName',
  name: 'firstName',
  label: 'First Name',
  value: 'Adecco Global',
};

const dynamicFormPhoneFieldProps: IDynamicFormFieldProps = {
  inputType: DynamicFormFieldType.PHONE,
  id: 'phone',
  name: 'phone',
  label: 'Phone Number',
  value: '12345678978',
};

storiesOf('Organisms/RHF/DynamicForm/DynamicFormField', module)
  .addDecorator((getStory) => <ThemeProvider theme={themeMock}>{getStory()}</ThemeProvider>)
  .add('default case', () => {
    const {methods}: any = useFormHook();
    return (
      <FormProvider {...methods}>
        <DynamicFormField {...dynamicFormTextFieldProps} />
      </FormProvider>
    );
  });

storiesOf('Organisms/RHF/DynamicForm/DynamicFormField', module)
  .addDecorator((getStory) => <ThemeProvider theme={themeMock}>{getStory()}</ThemeProvider>)
  .add('phone number', () => {
    const {methods}: any = useFormHook();
    return (
      <FormProvider {...methods}>
        <DynamicFormField {...dynamicFormPhoneFieldProps} />
      </FormProvider>
    );
  });
