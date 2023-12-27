import React from 'react';
import {storiesOf} from '@storybook/react';
import FormAsyncAutocomplete, {IFormAsyncAutocompleteProps} from '.';
import {ThemeProvider} from 'emotion-theming';
import {themeMock} from '../../../../../themes/theme-mock';
import useFormHook from '../../utils/hooks/useFormHook';
import {FormProvider} from 'react-hook-form';

const defaultOptions = [
  {
    categoryId: '00000000-0000-4000-0000-000000000001',
    groupBy: 'Language',
    label: 'English',
    skillId: 'b007feaf-0b4c-5a3b-99e7-f217ebd2ff0e',
    value: 'b007feaf-0b4c-5a3b-99e7-f217ebd2ff0e',
  },
  {
    categoryId: '00000000-0000-4000-0000-000000000002',
    groupBy: 'Job Title',
    label: 'Driver',
    skillId: 'b007feaf-0b4c-5a3b-99e7-f217ebd28f0e',
    value: 'b007feaf-0b4c-5a3b-99e7-f217ebd28f0e',
  },
];

const defaultProps: IFormAsyncAutocompleteProps<Record<string, any>> = {
  id: 'formAsyncAutocomplete',
  name: 'formAsyncAutocomplete',
  label: 'Form Async Autocomplete',
  defaultValue: 'b007feaf-0b4c-5a3b-99e7-f217ebd2ff0e',
  options: defaultOptions,
  asyncFunction: (term: string) =>
    new Promise((resolve, reject) => {
      resolve(defaultOptions);
    }),
};

storiesOf('Organisms/RHF/DynamicForm/FormAsyncAutocomplete', module)
  .addDecorator((getStory) => <ThemeProvider theme={themeMock}>{getStory()}</ThemeProvider>)
  .add('Default', () => {
    const {methods}: any = useFormHook({});
    return (
      <FormProvider {...methods}>
        <FormAsyncAutocomplete {...defaultProps} />
      </FormProvider>
    );
  });
