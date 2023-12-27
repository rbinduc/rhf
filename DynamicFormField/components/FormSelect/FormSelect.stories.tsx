import React from 'react';
import {storiesOf} from '@storybook/react';
import FormSelect from '.';
import {IFormSelectProps} from './FormSelect.component';
import {ThemeProvider} from 'emotion-theming';
import {themeMock} from '../../../../../themes/theme-mock';
import {FormProvider} from 'react-hook-form';
import useFormHook from '../../utils/hooks/useFormHook';

storiesOf('Organisms/RHF/DynamicForm/FormSelect', module)
  .addDecorator((getStory) => <ThemeProvider theme={themeMock}>{getStory()}</ThemeProvider>)

  .add('Langauge', () => {
    const defaultProps: IFormSelectProps = {
      name: 'Language Selection',
      label: 'Language',
      defaultValue: 'en-US',
      options: [
        {
          label: 'English',
          value: 'en-US',
        },
        {
          label: 'Español',
          value: 'es-US',
        },
      ],
      isRequired: true,
      id: 'language',
    };
    const {methods}: any = useFormHook({});
    return (
      <FormProvider {...methods}>
        <FormSelect {...defaultProps} />
      </FormProvider>
    );
  })

  .add('Country', () => {
    const defaultProps: IFormSelectProps = {
      name: 'Country Selection',
      label: 'Country / region',
      defaultValue: 101,
      options: [
        {
          label: 'United States of America',
          value: 101,
          hasFlag: true,
        },
        {
          label: 'Canada',
          value: 100,
          hasFlag: true,
        },
      ],
      isRequired: true,
      id: 'country',
    };
    const {methods}: any = useFormHook({});
    return (
      <FormProvider {...methods}>
        <FormSelect {...defaultProps} />
      </FormProvider>
    );
  });
