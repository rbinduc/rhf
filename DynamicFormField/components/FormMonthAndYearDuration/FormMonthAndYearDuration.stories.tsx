import React from 'react';
import {storiesOf} from '@storybook/react';
import FormMonthAndYearDuration, {IFormMonthAndYearDurationProps} from '.';
import {ThemeProvider} from 'emotion-theming';
import {themeMock} from '../../../../../themes/theme-mock';
import useFormHook from '../../utils/hooks/useFormHook';
import {FormProvider} from 'react-hook-form';

const defaultProps: IFormMonthAndYearDurationProps = {
  id: 'duration',
  name: 'duration',
  label: 'Duration',
  placeholder: 'select a duration',
  defaultValue: {months: 6, years: 7},
  maxMonths: 30,
  maxYears: 11,
};

storiesOf('Organisms/RHF/DynamicForm/FormMonthAndYearDuration', module)
  .addDecorator((getStory) => <ThemeProvider theme={themeMock}>{getStory()}</ThemeProvider>)
  .add('default case', () => {
    const {methods}: any = useFormHook();
    return (
      <FormProvider {...methods}>
        <FormMonthAndYearDuration {...defaultProps} />
      </FormProvider>
    );
  });
