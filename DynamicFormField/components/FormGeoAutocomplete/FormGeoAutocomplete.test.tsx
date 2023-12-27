import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {screen, act} from '@testing-library/react';
import FormGeoAutocomplete, {IFormGeoAutocompleteProps} from '.';
import {renderWithDyanmicForm} from '../../utils/testing-helpers';
import {UseFormReturn} from 'react-hook-form';

const formGeoAutocompleteProps: IFormGeoAutocompleteProps<Record<string, any>> = {
  id: 'formGeoAutocomplete',
  name: 'formGeoAutocomplete',
  label: 'Form Geo Autocomplete',
  defaultValue: 'Berlin',
  options: ['Berlin', 'Bertand', 'Berstung'],
  geoLocation: {types: '[(cities)]', country: 'de', isMultiSelect: false},
};

const mockState = {
  shared: {
    cutoutInfo: {
      hasCutout: false,
      insetTop: '',
      keyboardToolbarHeight: 0,
    },
  },
  tenant: {
    tenantId: 98,
    country: {
      id: 'bd8e6f16-f948-4b1e-ae16-1831cc127ae0',
      code: 'US-demo',
      name: 'United States of America (Demo)',
      callingCode: '1',
      createdAt: '2022-04-08T07:42:30.144Z',
      updatedAt: '2022-04-08T07:42:30.144Z',
    },
    fetchCountryStatus: 'success',
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
  useDispatch: jest.fn,
  useSelector: () => {
    return mockState;
  },
}));

// TODO: needs to fix unit tests.
document.createRange = () => ({
  setStart: jest.fn(),
  setEnd: jest.fn(),
  // @ts-ignore
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document,
  },
});

describe('FormAGeoutocomplete when rendering', () => {
  it('snapshot match <FormGeoAutocomplete/> snapshot', () => {
    const {container} = renderWithDyanmicForm(<FormGeoAutocomplete {...formGeoAutocompleteProps} />, {});
    expect(container).toBeDefined();
    expect(screen).toMatchSnapshot();
  });
  it('textbox aria role is applied once (implicitly for input)', () => {
    renderWithDyanmicForm(<FormGeoAutocomplete {...formGeoAutocompleteProps} />, {});
    const length = screen.getAllByRole('textbox').length;
    expect(length).toEqual(1);
  });
  it('displays error message when errors', async () => {
    const {getByText, dynamicFormMethods} = renderWithDyanmicForm(<FormGeoAutocomplete {...formGeoAutocompleteProps} />, {
      toPassBack: ['setError'],
    });
    await act(async () => {
      (dynamicFormMethods as UseFormReturn)?.setError(formGeoAutocompleteProps.name!, {
        type: 'manual',
        message: 'GeoAutocomplete is required',
      });
    });
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(getByText('GeoAutocomplete is required'));
  });
});
