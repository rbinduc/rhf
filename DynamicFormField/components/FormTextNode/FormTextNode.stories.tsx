import React from 'react';
import {storiesOf} from '@storybook/react';
import FormTextNode, {IFormTextNodeProps} from '.';
import useFormHook from '../../utils/hooks/useFormHook';
import {themeMock} from '../../../../../themes/theme-mock';
import {FormProvider} from 'react-hook-form';
import {ThemeProvider} from 'emotion-theming';

const defaultProps: IFormTextNodeProps = {
  label: 'Demo label',
};

storiesOf('Organisms/RHF/DynamicForm/FormTextNode', module)
  .addDecorator((getStory) => <ThemeProvider theme={themeMock}>{getStory()}</ThemeProvider>)
  .add('default case', () => {
    const {methods}: any = useFormHook();
    return (
      <FormProvider {...methods}>
        <FormTextNode {...defaultProps} />
      </FormProvider>
    );
  });
