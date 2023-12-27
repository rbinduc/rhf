import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {screen, act} from '@testing-library/react';
import FormCheckbox, {IFormCheckboxProps} from './FormCheckbox';
import {renderWithDyanmicForm} from '../../utils/testing-helpers';
import {UseFormReturn} from 'react-hook-form';

const formCheckboxProps: IFormCheckboxProps = {
  id: 'formCheckbox',
  name: 'formCheckbox',
  label: 'Form Checkbox',
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
describe('Form Checkbox', () => {
  it('snapshot match', () => {
    const {container} = renderWithDyanmicForm(<FormCheckbox {...formCheckboxProps} />, {});
    expect(container).toBeDefined();
    expect(container.firstChild).toMatchSnapshot();

    expect(screen).toMatchSnapshot();
  });

  it('renders in document and a default value and disabled', () => {
    renderWithDyanmicForm(<FormCheckbox {...formCheckboxProps} isDisabled={true} />, {
      defaultValues: {
        formCheckbox: true,
      },
    });
    const checkbox = screen.getByLabelText(formCheckboxProps.label as string);
    expect(screen.getByText('Form Checkbox')).toBeInTheDocument();
    expect((checkbox as HTMLInputElement).disabled).toBeTruthy();
    expect((checkbox as HTMLInputElement).checked).toBeTruthy();
  });

  it('checkbox aria role is applied once (implicitly for input)', () => {
    renderWithDyanmicForm(<FormCheckbox {...formCheckboxProps} />, {});
    expect(screen.getAllByRole('checkbox').length).toEqual(1);
  });

  it('displays error message when errors', async () => {
    const {getByText, dynamicFormMethods} = renderWithDyanmicForm(<FormCheckbox {...formCheckboxProps} />, {
      toPassBack: ['setError'],
    });

    await act(async () => {
      (dynamicFormMethods as UseFormReturn)?.setError(formCheckboxProps.name!, {
        type: 'manual',
        message: 'Checkbox is required',
      });
    });

    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(getByText('Checkbox is required'));
  });
});
