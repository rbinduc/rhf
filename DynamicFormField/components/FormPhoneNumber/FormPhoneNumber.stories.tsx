import React from 'react';
import {storiesOf} from '@storybook/react';
import FormPhoneNumber, {IFormPhoneNumberProps} from '.';
import useFormHook from '../../utils/hooks/useFormHook';
import {themeMock} from '../../../../../themes/theme-mock';
import {FormProvider} from 'react-hook-form';
import {ThemeProvider} from 'emotion-theming';

const defaultProps: IFormPhoneNumberProps = {
  id: 'formPhoneNumber',
  name: 'formPhoneNumber',
  label: 'PhoneNumber',
  placeholder: 'Please enter a phone number',
  value: '12345657586',
};

storiesOf('Organisms/RHF/DynamicForm/FormPhoneNumber', module)
  .addDecorator((getStory) => <ThemeProvider theme={themeMock}>{getStory()}</ThemeProvider>)
  .add('default case', () => {
    const {methods}: any = useFormHook();
    return (
      <FormProvider {...methods}>
        <FormPhoneNumber {...defaultProps} />
      </FormProvider>
    );
  });
