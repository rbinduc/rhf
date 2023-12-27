import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import FormSelect, {IFormSelectProps} from '.';
import {renderWithDyanmicForm} from '../../utils/testing-helpers';

import {screen} from '@testing-library/react';
const defaultProps: IFormSelectProps = {
  name: 'Country Selection',
  label: 'Country / region',
  defaultValue: 101,
  options: [
    {
      label: 'United States of America',
      value: 101,
      hasFlag: true,
    },
    {
      label: 'Canada',
      value: 100,
      hasFlag: true,
    },
  ],
  isRequired: true,
  id: 'country',
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

describe('FormSelect', () => {
  it('snapshot match', () => {
    const {container} = renderWithDyanmicForm(<FormSelect {...defaultProps} />, {});
    expect(container).toBeDefined();
    expect(container.firstChild).toMatchSnapshot();

    expect(screen).toMatchSnapshot();
  });
});
