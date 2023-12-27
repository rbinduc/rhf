import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {screen, act} from '@testing-library/react';
import FormAsyncAutocomplete, {IFormAsyncAutocompleteProps} from '.';
import {renderWithDyanmicForm} from '../../utils/testing-helpers';
import {UseFormReturn} from 'react-hook-form';

const defaultOptions = [
  {
    categoryId: '00000000-0000-4000-0000-000000000001',
    groupBy: 'Language',
    label: 'English',
    skillId: 'b007feaf-0b4c-5a3b-99e7-f217ebd2ff0e',
    value: 'b007feaf-0b4c-5a3b-99e7-f217ebd2ff0e',
  },
  {
    categoryId: '00000000-0000-4000-0000-000000000002',
    groupBy: 'Job Title',
    label: 'Driver',
    skillId: 'b007feaf-0b4c-5a3b-99e7-f217ebd28f0e',
    value: 'b007feaf-0b4c-5a3b-99e7-f217ebd28f0e',
  },
];

const defaultProps: IFormAsyncAutocompleteProps<Record<string, any>> = {
  id: 'formAsyncAutocomplete',
  name: 'formAsyncAutocomplete',
  label: 'Form Async Autocomplete',
  defaultValue: 'b007feaf-0b4c-5a3b-99e7-f217ebd2ff0e',
  options: defaultOptions,
  asyncFunction: (term: string) =>
    new Promise((resolve, reject) => {
      resolve(defaultOptions);
    }),
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

jest.mock('react-redux', () => ({
  useSelector: () => {
    return mockState;
  },
}));

describe('FormAsyncAutocomplete when rendering', () => {
  it('snapshot match <FormAsyncAutocomplete/> snapshot', () => {
    const {container} = renderWithDyanmicForm(<FormAsyncAutocomplete {...defaultProps} />, {});
    //TODO: snapshot need to be fixed.
    expect(container).toBeDefined();

    expect(screen).toMatchSnapshot();
  });

  it('renders in document and a default value and disabled', () => {
    renderWithDyanmicForm(<FormAsyncAutocomplete {...defaultProps} isDisabled={true} />, {});
    const textbox = screen.getByLabelText(defaultProps.label as string);

    expect((textbox as HTMLInputElement).disabled).toBeTruthy();
    expect((textbox as HTMLInputElement).value).toEqual(defaultProps.defaultValue);
  });

  it('textbox aria role is applied once (implicitly for input)', () => {
    renderWithDyanmicForm(<FormAsyncAutocomplete {...defaultProps} />, {});
    expect(screen.getAllByRole('textbox').length).toEqual(1);
  });

  it('displays error message when errors', async () => {
    const {getByText, dynamicFormMethods} = renderWithDyanmicForm(<FormAsyncAutocomplete {...defaultProps} />, {
      toPassBack: ['setError'],
    });

    await act(async () => {
      (dynamicFormMethods as UseFormReturn)?.setError(defaultProps.name!, {
        type: 'manual',
        message: 'Autocomplete is required',
      });
    });

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(getByText('Autocomplete is required'));
  });
});
