import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {screen, act} from '@testing-library/react';
import FormTextField, {IFormTextFieldProps} from './FormTextField';
import {renderWithDyanmicForm} from '../../utils/testing-helpers';
import {UseFormReturn} from 'react-hook-form';

const formTextFieldProps: IFormTextFieldProps = {
  id: 'formTextField',
  name: 'FormTextField',
  label: 'Form Textbox',
  defaultValue: 'Adecco',
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

describe('FormTextField', () => {
  it('snapshot match', () => {
    const {container} = renderWithDyanmicForm(<FormTextField {...formTextFieldProps} />, {});
    expect(container).toBeDefined();
    expect(container.firstChild).toMatchSnapshot();

    expect(screen).toMatchSnapshot();
  });

  it('renders in document and a default value and disabled', () => {
    renderWithDyanmicForm(<FormTextField {...formTextFieldProps} isDisabled={true} />, {});
    const textbox = screen.getByLabelText(formTextFieldProps.label as string);

    expect((textbox as HTMLInputElement).disabled).toBeTruthy();
    expect((textbox as HTMLInputElement).value).toEqual(formTextFieldProps.defaultValue);
  });

  it('textbox aria role is applied once (implicitly for input)', () => {
    renderWithDyanmicForm(<FormTextField {...formTextFieldProps} />, {});
    expect(screen.getAllByRole('textbox').length).toEqual(1);
  });

  it('displays error message when errors', async () => {
    const {getByText, dynamicFormMethods} = renderWithDyanmicForm(<FormTextField {...formTextFieldProps} />, {
      toPassBack: ['setError'],
    });

    await act(async () => {
      (dynamicFormMethods as UseFormReturn)?.setError(formTextFieldProps.name!, {
        type: 'manual',
        message: 'Textbox is required',
      });
    });

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(getByText('Textbox is required'));
  });
});
