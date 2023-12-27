import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {screen, act} from '@testing-library/react';
import FormCalendarDuration, {IFormCalendarDurationProps} from '.';
import {renderWithDyanmicForm} from '../../utils/testing-helpers';
import {UseFormReturn} from 'react-hook-form';

const defaultProps: IFormCalendarDurationProps = {
  id: 'calendarDuration',
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
};

jest.mock('@ionic-native/keyboard', () => ({
  hide: jest.fn(),
}));

jest.mock('../../../../../../automation/PageLocators', () => ({
  locators: {
    jobPageLocators: {
      aFiltersIcon: 'filtersIcon',
    },
    commonLocators: {
      aHeaderText: 'headerText',
    },
    accountSettings: {
      aChangeCountryHeader: 'changeCountryHeader',
    },
  },
}));

jest.mock('../../../../../../helpers/HelperUtils', () => ({
  isGuestUser: () => false,
  getTenantIdFromLS: () => 98,
  getI18nFromLS: () => '',
  getNumberFromString: (v: string) => parseInt(v, 10),
}));

describe('FormCalendarDuration', () => {
  it('snapshot match', () => {
    const {container} = renderWithDyanmicForm(<FormCalendarDuration {...defaultProps} />, {});
    expect(container).toBeDefined();
    expect(container.firstChild).toMatchSnapshot();

    expect(screen).toMatchSnapshot();
  });

  it('renders in document and a default value and disabled', () => {
    const {container} = renderWithDyanmicForm(<FormCalendarDuration {...defaultProps} isDisabled={true} />, {});
    const input = container.querySelector('#calendarDuration');

    expect((input as HTMLInputElement).disabled).toBeTruthy();
    const inputValue = (input as HTMLInputElement).value;
    expect(JSON.parse(inputValue)).toEqual(defaultProps.defaultValue);
  });

  it('textbox aria role is applied once (implicitly for input)', () => {
    const {container} = renderWithDyanmicForm(<FormCalendarDuration {...defaultProps} />, {});
    const textbox = container.querySelector('#calendarDuration');
    expect(textbox).toBeInTheDocument();
  });

  it('should contain two selects and able to change duration', () => {
    const {container} = renderWithDyanmicForm(<FormCalendarDuration {...defaultProps} defaultValue={{number: 4, name: 'months'}} />, {});
    const durationName = container.querySelector('#calendarDuration_name');
    const durationNumber = container.querySelector('#calendarDuration_number');

    expect(durationName).toBeInTheDocument();
    expect(durationNumber).toBeInTheDocument();

    expect(screen.getAllByRole('button').length).toEqual(2);

    const durationNameValue = (durationName as HTMLInputElement).value;
    expect(durationNameValue).toEqual('months');

    const durationNumberValue = (durationNumber as HTMLInputElement).value;
    expect(parseInt(durationNumberValue, 10)).toEqual(4);
  });

  it('displays error message when errors', async () => {
    const {container, getByText, dynamicFormMethods} = renderWithDyanmicForm(<FormCalendarDuration {...defaultProps} />, {
      toPassBack: ['setError'],
    });

    await act(async () => {
      (dynamicFormMethods as UseFormReturn)?.setError(defaultProps.name!, {
        type: 'manual',
        message: 'Textbox is required',
      });
    });

    const textbox = container.querySelector('#calendarDuration');
    expect(textbox).toBeInTheDocument();
    expect(getByText('Textbox is required'));
  });
});
