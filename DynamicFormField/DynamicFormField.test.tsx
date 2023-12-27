import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {screen} from '@testing-library/react';
import DynamicFormField, {IDynamicFormFieldProps, DynamicFormFieldType} from './DynamicFormField';
import {renderWithDyanmicForm} from './utils/testing-helpers';

const defaultProps: IDynamicFormFieldProps = {
  inputType: DynamicFormFieldType.TEXT,
  id: 'formTextField',
  name: 'FormTextField',
  label: 'Form Textbox',
  defaultValue: 'Adecco',
};

jest.mock('@ionic-native/keyboard', () => ({
  hide: jest.fn(),
}));

jest.mock('../../../../automation/PageLocators', () => ({
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

describe('DynamicFormField', () => {
  it('snapshot match', () => {
    const {container} = renderWithDyanmicForm(<DynamicFormField {...defaultProps} />);
    expect(container).toBeDefined();
    expect(container.firstChild).toMatchSnapshot();

    expect(screen).toMatchSnapshot();
  });

  it('renders in document and a should be a textbox', () => {
    renderWithDyanmicForm(<DynamicFormField {...defaultProps} />);
    const textbox = screen.getByRole('textbox');
    expect((textbox as HTMLInputElement).name).toEqual(defaultProps.name);
  });
});
