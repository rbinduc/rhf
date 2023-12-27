import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import FormTextNode, {IFormTextNodeProps} from '.';
import {renderWithDyanmicForm} from '../../utils/testing-helpers';
import {screen} from '@testing-library/react';

const defaultProps: IFormTextNodeProps = {
  label: 'Some test text',
};

describe('FormTextNode', () => {
  it('snapshot match', () => {
    const {container} = renderWithDyanmicForm(<FormTextNode {...defaultProps} />, {});
    expect(container).toBeDefined();
    expect(container.firstChild).toMatchSnapshot();
    expect(screen).toMatchSnapshot();
  });
  it('renders in document', () => {
    renderWithDyanmicForm(<FormTextNode {...defaultProps} />, {});
    const label = screen.getByText(defaultProps.label as string);
    expect(label as HTMLLabelElement).toBeTruthy();
  });
});
