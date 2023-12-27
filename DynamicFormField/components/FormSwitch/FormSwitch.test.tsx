import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import FormSwitch from '.';
import {IFormSwitchProps} from './FormSwitch.component';
import {renderWithDyanmicForm} from '../../utils/testing-helpers';

const defaultProps: IFormSwitchProps = {
  id: 'switch_id',
  name: 'tou',
  isRequired: true,
  label: 'Terms of use and Privacy notice*',
  description: 'I acknowledge that I have read and accepted the Terms and Conditions and Privacy Policy',
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

describe('FormSwitch', () => {
  it('snapshot match', () => {
    const {container} = renderWithDyanmicForm(<FormSwitch {...defaultProps} />, {});
    expect(container).toBeDefined();
    expect(container.firstChild).toMatchSnapshot();
  });
});
