import React from 'react';
import {storiesOf} from '@storybook/react';
import FormCheckbox, {IFormCheckboxProps} from '.';
import useFormHook from '../../utils/hooks/useFormHook';
import {themeMock} from '../../../../../themes/theme-mock';
import {FormProvider} from 'react-hook-form';
import {ThemeProvider} from 'emotion-theming';

const defaultProps: IFormCheckboxProps = {
  id: 'formCheckbox',
  name: 'formCheckbox',
  label: 'Form Checkbox',
};

storiesOf('Organisms/RHF/DynamicForm/FormCheckbox', module)
  .addDecorator((getStory) => <ThemeProvider theme={themeMock}>{getStory()}</ThemeProvider>)
  .add('default case', () => {
    const {methods}: any = useFormHook();
    return (
      <FormProvider {...methods}>
        <FormCheckbox {...defaultProps} />
      </FormProvider>
    );
  });
