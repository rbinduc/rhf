import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import FormRadio, {IFormRadioProps} from '.';
import {renderWithDyanmicForm} from '../../utils/testing-helpers';
import {screen} from '@testing-library/react';

const defaultProps: IFormRadioProps = {
  name: 'SortBy',
  label: 'Sort By',
  options: [
    {
      label: 'The newest date',
      value: 0,
    },
    {
      label: 'The most relevant',
      value: 1,
    },
  ],
  isRequired: true,
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

describe('FormRadio', () => {
  it('snapshot match', () => {
    const {container} = renderWithDyanmicForm(<FormRadio {...defaultProps} />, {});
    expect(container).toBeDefined();
    expect(container.firstChild).toMatchSnapshot();
    expect(screen).toMatchSnapshot();
  });
});
