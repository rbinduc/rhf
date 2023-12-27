import React from 'react';
import {storiesOf} from '@storybook/react';
import FormGeoAutocomplete, {IFormGeoAutocompleteProps} from '.';
import {ThemeProvider} from 'emotion-theming';
import {themeMock} from '../../../../../themes/theme-mock';
import useFormHook from '../../utils/hooks/useFormHook';
import {FormProvider} from 'react-hook-form';

const formTextFieldProps: IFormGeoAutocompleteProps<Record<string, any>> = {
  id: 'formGeoAutocomplete',
  name: 'formGeoAutocomplete',
  label: 'Form Geo Autocomplete',
  defaultValue: 'Berlin',
  options: ['Berlin', 'Bertand', 'Berstung'],
  geoLocation: {
    types: '[(cities)]',
    country: 'de',
  },
};

storiesOf('Organisms/RHF/DynamicForm/FormGeoAutocomplete', module)
  .addDecorator((getStory) => <ThemeProvider theme={themeMock}>{getStory()}</ThemeProvider>)
  .add('Default', () => {
    const {methods}: any = useFormHook({});
    return (
      <FormProvider {...methods}>
        <FormGeoAutocomplete {...formTextFieldProps} />
      </FormProvider>
    );
  });
