import React from 'react';
import {storiesOf} from '@storybook/react';
import FormSwitch from '.';
import {IFormSwitchProps} from './FormSwitch.component';
import {ThemeProvider} from 'emotion-theming';
import {themeMock} from '../../../../../themes/theme-mock';
import {FormProvider} from 'react-hook-form';
import useFormHook from '../../utils/hooks/useFormHook';

storiesOf('Organisms/RHF/DynamicForm/FormSwitch', module)
  .addDecorator((getStory) => <ThemeProvider theme={themeMock}>{getStory()}</ThemeProvider>)
  .add('Default', () => {
    const defaultProps: IFormSwitchProps = {
      id: 'switch_id',
      name: 'tou',
      isRequired: true,
      label: 'Terms of use and Privacy notice*',
      description: 'I acknowledge that I have read and accepted the Terms and Conditions and Privacy Policy',
    };
    const {methods}: any = useFormHook({});
    return (
      <FormProvider {...methods}>
        <FormSwitch {...defaultProps} />
      </FormProvider>
    );
  });
