import React from 'react';
import {storiesOf} from '@storybook/react';
import FormTextField, {IFormTextFieldProps} from './FormTextField';
import {ThemeProvider} from 'emotion-theming';
import {themeMock} from '../../../../../themes/theme-mock';
import useFormHook from '../../utils/hooks/useFormHook';
import {FormProvider} from 'react-hook-form';

const formTextFieldProps: IFormTextFieldProps = {
  id: 'formTextField',
  name: 'formTextField',
  label: 'Text Field',
  value: 'Adecco Global',
};

storiesOf('Organisms/RHF/DynamicForm/FormTextField', module)
  .addDecorator((getStory) => <ThemeProvider theme={themeMock}>{getStory()}</ThemeProvider>)
  .add('default case', () => {
    const {methods}: any = useFormHook({});
    return (
      <FormProvider {...methods}>
        <FormTextField {...formTextFieldProps} />
      </FormProvider>
    );
  });
