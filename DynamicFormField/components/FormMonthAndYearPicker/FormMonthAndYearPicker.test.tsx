import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {screen, act} from '@testing-library/react';
import FormMonthAndYearPicker, {IFormMonthAndYearPickerProps} from '.';
import {renderWithDyanmicForm} from '../../utils/testing-helpers';
import {UseFormReturn} from 'react-hook-form';

const defaultProps: IFormMonthAndYearPickerProps = {
  id: 'date',
  name: 'date',
  label: 'Date',
  placeholder: 'Please select a date',
  defaultValue: 'August, 2021',
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
  getTenantIdFromLS: () => 98,
  getI18nFromLS: () => '',
  getNumberFromString: (v: string) => parseInt(v, 10),
}));

describe('when rendering FormMonthAndYearPicker', () => {
  it('snapshot match', () => {
    const {container} = renderWithDyanmicForm(<FormMonthAndYearPicker {...defaultProps} />, {});
    expect(container).toBeDefined();
    expect(container.firstChild).toMatchSnapshot();

    expect(screen).toMatchSnapshot();
  });

  it('renders in document and a default value and disabled', () => {
    renderWithDyanmicForm(<FormMonthAndYearPicker {...defaultProps} isDisabled={true} />, {
      defaultValues: {
        date: 'August, 2021',
      },
    });
    const dateInput = screen.getByLabelText(defaultProps.label as string);
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect((dateInput as HTMLInputElement).disabled).toBeTruthy();
    expect((dateInput as HTMLInputElement).value).toBeTruthy();
  });

  it('displays error message when errors', async () => {
    const {getByText, dynamicFormMethods} = renderWithDyanmicForm(<FormMonthAndYearPicker {...defaultProps} />, {
      toPassBack: ['setError'],
    });

    await act(async () => {
      (dynamicFormMethods as UseFormReturn)?.setError(defaultProps.name!, {
        type: 'manual',
        message: 'Date is required',
      });
    });

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(getByText('Date is required'));
  });
});
