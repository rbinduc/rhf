import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {screen, act} from '@testing-library/react';
import FormPhoneNumber, {IFormPhoneNumberProps} from './FormPhoneNumber';
import {renderWithDyanmicForm} from '../../utils/testing-helpers';
import {UseFormReturn} from 'react-hook-form';

const formPhoneNumberProps: IFormPhoneNumberProps = {
  id: 'FormPhoneNumber',
  name: 'FormPhoneNumber',
  label: 'Form PhoneNumber',
  placeholder: 'E.g.1234567890',
  defaultValue: '+1 (234) 565-7586',
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

describe('FormPhoneNumber', () => {
  it('snapshot match', () => {
    const {container} = renderWithDyanmicForm(<FormPhoneNumber {...formPhoneNumberProps} />, {});
    expect(container).toBeDefined();
    expect(container.firstChild).toMatchSnapshot();

    expect(screen).toMatchSnapshot();
  });

  it('renders in document and a default value and disabled', () => {
    renderWithDyanmicForm(<FormPhoneNumber {...formPhoneNumberProps} isDisabled={true} />, {});
    const textbox = screen.getByLabelText(formPhoneNumberProps.label as string);

    expect((textbox as HTMLInputElement).disabled).toBeTruthy();
    expect((textbox as HTMLInputElement).value).toEqual(formPhoneNumberProps.defaultValue);
  });

  it('textbox aria role is applied once (implicitly for input)', () => {
    renderWithDyanmicForm(<FormPhoneNumber {...formPhoneNumberProps} />, {});
    expect(screen.getAllByRole('textbox').length).toEqual(1);
  });

  it('displays error message when errors', async () => {
    const {getByText, dynamicFormMethods} = renderWithDyanmicForm(<FormPhoneNumber {...formPhoneNumberProps} />, {
      toPassBack: ['setError'],
    });

    await act(async () => {
      (dynamicFormMethods as UseFormReturn)?.setError(formPhoneNumberProps.name, {
        type: 'manual',
        message: 'PhoneNumber is required',
      });
    });

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(getByText('PhoneNumber is required'));
  });
});
