import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {screen, act} from '@testing-library/react';
import FormMonthAndYearDuration, {IFormMonthAndYearDurationProps} from '.';
import {renderWithDyanmicForm} from '../../utils/testing-helpers';
import {UseFormReturn} from 'react-hook-form';

const defaultProps: IFormMonthAndYearDurationProps = {
  id: 'duration',
  name: 'duration',
  label: 'Duration',
  placeholder: 'select a duration',
  defaultValue: {months: 6, years: 7},
  maxMonths: 30,
  maxYears: 11,
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

describe('when rendering FormMonthAndYearDuration', () => {
  it('snapshot match', () => {
    const {container} = renderWithDyanmicForm(<FormMonthAndYearDuration {...defaultProps} />, {});
    expect(container).toBeDefined();
    expect(container.firstChild).toMatchSnapshot();

    expect(screen).toMatchSnapshot();
  });

  it('renders in document and a default value and disabled', () => {
    renderWithDyanmicForm(<FormMonthAndYearDuration {...defaultProps} isDisabled={true} />, {
      defaultValues: {
        duration: {months: 6, years: 7},
      },
    });
    const dateInput = screen.getByLabelText(defaultProps.label as string);
    expect(screen.getByText('Duration')).toBeInTheDocument();
    expect((dateInput as HTMLInputElement).disabled).toBeTruthy();
    expect((dateInput as HTMLInputElement).value).toBeTruthy();
  });

  it('displays error message when errors', async () => {
    const {container, getByText, dynamicFormMethods} = renderWithDyanmicForm(<FormMonthAndYearDuration {...defaultProps} />, {
      toPassBack: ['setError'],
    });

    await act(async () => {
      (dynamicFormMethods as UseFormReturn)?.setError(defaultProps.name!, {
        type: 'manual',
        message: 'Duration is required',
      });
    });

    const textbox = container.querySelector('#duration');
    expect(textbox).toBeInTheDocument();
    expect(getByText('Duration is required'));
  });
});
