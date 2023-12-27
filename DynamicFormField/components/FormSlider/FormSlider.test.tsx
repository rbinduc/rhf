import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import FormSlider, {IFormSliderProps} from '.';
import {renderWithDyanmicForm} from '../../utils/testing-helpers';
import {screen} from '@testing-library/react';

const defaultProps: IFormSliderProps = {
  name: 'Slider',
  label: 'Slider',
  min: 1,
  max: 30,
  step: 1,
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

describe('FormSlider', () => {
  it('snapshot match', () => {
    const {container} = renderWithDyanmicForm(<FormSlider {...defaultProps} />, {});
    expect(container).toBeDefined();
    expect(container.firstChild).toMatchSnapshot();
    expect(screen).toMatchSnapshot();
  });
});
