import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {screen, act} from '@testing-library/react';
import FormAutocomplete, {IFormAutocompleteProps} from '.';
import {renderWithDyanmicForm} from '../../utils/testing-helpers';
import {UseFormReturn} from 'react-hook-form';

const formAutocompleteProps: IFormAutocompleteProps<Record<string, any>> = {
  id: 'formAutocomplete',
  name: 'formAutocomplete',
  label: 'Form Autocomplete',
  defaultValue: 'Adecco',
  options: ['AdeccoUS', 'AdeccoCA', 'AdeccoGlobal', 'AdeccoDirect', 'Adecco'],
};

const mockState = {
  shared: {
    cutoutInfo: {
      hasCutout: false,
      insetTop: '',
      keyboardToolbarHeight: 0,
    },
  },
};

jest.mock('@ionic-native/keyboard', () => ({
  hide: jest.fn(),
}));

jest.mock('react-redux', () => ({
  useSelector: () => {
    return mockState;
  },
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

describe('FormAutocomplete when rendering', () => {
  it('snapshot match <FormAutocomplete/> snapshot', () => {
    const {container} = renderWithDyanmicForm(<FormAutocomplete {...formAutocompleteProps} />, {});
    //TODO: snapshot need to be fixed.
    expect(container).toBeDefined();

    expect(screen).toMatchSnapshot();
  });

  it('renders in document and a default value and disabled', () => {
    renderWithDyanmicForm(<FormAutocomplete {...formAutocompleteProps} isDisabled={true} />, {});
    const textbox = screen.getByLabelText(formAutocompleteProps.label as string);

    expect((textbox as HTMLInputElement).disabled).toBeTruthy();
    expect((textbox as HTMLInputElement).value).toEqual(formAutocompleteProps.defaultValue);
  });

  it('textbox aria role is applied once (implicitly for input)', () => {
    renderWithDyanmicForm(<FormAutocomplete {...formAutocompleteProps} />, {});
    expect(screen.getAllByRole('textbox').length).toEqual(1);
  });

  it('displays error message when errors', async () => {
    const {getByText, dynamicFormMethods} = renderWithDyanmicForm(<FormAutocomplete {...formAutocompleteProps} />, {
      toPassBack: ['setError'],
    });

    await act(async () => {
      (dynamicFormMethods as UseFormReturn)?.setError(formAutocompleteProps.name!, {
        type: 'manual',
        message: 'Autocomplete is required',
      });
    });

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(getByText('Autocomplete is required'));
  });
});
