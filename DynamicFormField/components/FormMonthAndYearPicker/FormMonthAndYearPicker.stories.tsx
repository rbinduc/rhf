import React from 'react';
import {storiesOf} from '@storybook/react';
import FormMonthAndYearPicker, {IFormMonthAndYearPickerProps} from '.';
import {ThemeProvider} from 'emotion-theming';
import {themeMock} from '../../../../../themes/theme-mock';
import useFormHook from '../../utils/hooks/useFormHook';
import {FormProvider} from 'react-hook-form';

const defaultProps: IFormMonthAndYearPickerProps = {
  id: 'date',
  name: 'date',
  label: 'Date',
  placeholder: 'Select a date',
  defaultValue: 'August, 2021',
};

storiesOf('Organisms/RHF/DynamicForm/FormMonthAndYearPicker', module)
  .addDecorator((getStory) => <ThemeProvider theme={themeMock}>{getStory()}</ThemeProvider>)
  .add('default case', () => {
    const {methods}: any = useFormHook();
    return (
      <FormProvider {...methods}>
        <FormMonthAndYearPicker {...defaultProps} />
      </FormProvider>
    );
  });
