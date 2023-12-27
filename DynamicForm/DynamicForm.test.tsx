import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {render, screen, act, fireEvent, RenderResult} from '@testing-library/react';
import {DynamicFormFieldType} from '../DynamicFormField/DynamicFormField';
import DynamicForm, {IDynamicFormProps} from './DynamicForm';
import {UseFormReturn} from 'react-hook-form';
import {withDynamicForm} from '../DynamicFormField/utils/testing-helpers';

const mockSubmit = jest.fn((data) => {
  return Promise.resolve(data);
});

const dynamicFormProps: IDynamicFormProps = {
  fields: [
    {
      inputType: DynamicFormFieldType.TEXT,
      id: 'formTextField',
      name: 'formTextField',
      label: 'Text Field',
      value: 'Adecco Global',
      isRequired: true,
      validations: {
        required: {
          value: true,
          message: 'TextField is Required',
        },
        maxLength: {
          value: 8,
          message: 'Max length exceeded',
        },
      },
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
  methods: {} as UseFormReturn<any>,
  onSubmit: mockSubmit,
};

const defaultValues = {
  formTextField: '',
  formCheckbox: false,
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
    componentPersonalDetails: {
      aMandatoryLabel: 'mandatoryLabel',
    },
  },
}));

let renderedResult = {} as RenderResult;

describe('DynamicForm', () => {
  beforeEach(async () => {
    await act(async () => {
      const Wrapped = withDynamicForm(DynamicForm, dynamicFormProps, defaultValues);
      renderedResult = render(<Wrapped />);
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

  it('should display error field is required', async () => {
    fireEvent.input(screen.getByRole('textbox'), {
      target: {
        value: '',
      },
    });

    await act(async () => {
      fireEvent.submit(screen.getByRole('button'));
    });

    expect(dynamicFormProps.onSubmit).not.toBeCalled();
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('');
    expect(screen.getByText('TextField is Required')).toBeInTheDocument();
  });

  it('should display error max length exceeded', async () => {
    const value = 'ASdskfhgfdkjgrigudh';
    fireEvent.input(screen.getByRole('textbox'), {
      target: {
        value,
      },
    });

    await act(async () => {
      fireEvent.submit(screen.getByRole('button'));
    });

    expect(dynamicFormProps.onSubmit).not.toBeCalled();
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe(value);
    expect(screen.getByText('Max length exceeded')).toBeInTheDocument();
  });
});
