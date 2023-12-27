import React from 'react';
import {storiesOf} from '@storybook/react';
import FormAutocomplete, {IFormAutocompleteProps} from '.';
import {ThemeProvider} from 'emotion-theming';
import {themeMock} from '../../../../../themes/theme-mock';
import useFormHook from '../../utils/hooks/useFormHook';
import {FormProvider} from 'react-hook-form';

const formTextFieldProps: IFormAutocompleteProps<Record<string, any>> = {
  id: 'formAutocomplete',
  name: 'formAutocomplete',
  label: 'Form Autocomplete',
  defaultValue: 'AdeccoGlobal',
  options: ['AdeccoUS', 'AdeccoCA', 'AdeccoGlobal', 'AdeccoDirect', 'Adecco'],
};

storiesOf('Organisms/RHF/DynamicForm/FormAutocomplete', module)
  .addDecorator((getStory) => <ThemeProvider theme={themeMock}>{getStory()}</ThemeProvider>)
  .add('Default', () => {
    const {methods}: any = useFormHook({});
    return (
      <FormProvider {...methods}>
        <FormAutocomplete {...formTextFieldProps} />
      </FormProvider>
    );
  });
