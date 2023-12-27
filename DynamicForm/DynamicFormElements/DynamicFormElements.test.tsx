import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {screen, act, RenderResult} from '@testing-library/react';
import {renderWithDyanmicForm} from '../../DynamicFormField/utils/testing-helpers';
import DynamicFormElements, {IDynamicFormElements} from './DynamicFormElements';
import {DynamicFormFieldType} from '../../DynamicFormField/DynamicFormField';

const dynamicFormElementsProps: IDynamicFormElements = {
  fields: [
    {
      inputType: DynamicFormFieldType.TEXT,
      id: 'formTextField',
      name: 'formTextField',
      label: 'Text Field',
      value: 'Adecco Global',
    },
    {
      inputType: DynamicFormFieldType.CHECKBOX,
      id: 'formCheckbox',
      name: 'formCheckbox',
      label: 'Form Checkbox',
    },
  ],
  showSubmitButton: true,
  submitButton: {
    id: 'Form_Id',
    buttonText: 'Submit',
    variant: 'contained',
    size: 'large',
    color: 'primary',
  },
};

jest.mock('@ionic-native/keyboard', () => ({
  hide: jest.fn(),
}));

jest.mock('../../../../../automation/PageLocators', () => ({
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

let renderedResult = {} as RenderResult;

describe('DynamicFormElements', () => {
  beforeEach(async () => {
    await act(async () => {
      renderedResult = renderWithDyanmicForm(<DynamicFormElements {...dynamicFormElementsProps} />, {});
    });
  });

  it('snapshot match', () => {
    const {container} = renderedResult || {};
    expect(container).toBeDefined();
    expect(container.firstChild).toMatchSnapshot();

    expect(screen).toMatchSnapshot();
  });

  it('should have a submit button', async () => {
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });

  it('should contain a textbox and a checkbox', async () => {
    expect(screen.getAllByRole('textbox').length).toEqual(1);
    expect(screen.getAllByRole('checkbox').length).toEqual(1);
  });
});
