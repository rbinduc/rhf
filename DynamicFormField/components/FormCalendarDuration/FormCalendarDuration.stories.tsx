import React from 'react';
import {storiesOf} from '@storybook/react';
import FormCalendarDuration, {IFormCalendarDurationProps} from '.';
import {ThemeProvider} from 'emotion-theming';
import {themeMock} from '../../../../../themes/theme-mock';
import {FormProvider} from 'react-hook-form';
import useFormHook from '../../utils/hooks/useFormHook';

const defaultProps: IFormCalendarDurationProps = {
  name: 'calendarDuration',
  label: 'Choose the duration from now on',
  title: 'For how long would you like deactivate your account?',
  infoLabel: 'Unfortunately, you can not deactivate your account for more than 18 months until 29th Apr, 2023',
  validityLabel: 'Your account <b>will be</b> deactivated until:',
  defaultValue: {number: 1, name: 'days'},
  options: [
    {
      label: 'Day(s)',
      value: 'days',
      max: 7,
    },
    {
      label: 'Month(s)',
      value: 'months',
      max: 4,
    },
    {
      label: 'Week(s)',
      value: 'weeks',
      max: 18,
    },
  ],
  isRequired: true,
  id: 'calendarDuration',
} as IFormCalendarDurationProps;

storiesOf('Organisms/RHF/DynamicForm/FormCalendarDuration', module)
  .addDecorator((getStory) => <ThemeProvider theme={themeMock}>{getStory()}</ThemeProvider>)
  .add('Duration', () => {
    const {methods}: any = useFormHook({});
    return (
      <FormProvider {...methods}>
        <FormCalendarDuration {...defaultProps} />
      </FormProvider>
    );
  });
