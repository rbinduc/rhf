import React from 'react';
import {storiesOf} from '@storybook/react';
import FormSlider, {IFormSliderProps} from '.';
import {ThemeProvider} from 'emotion-theming';
import {themeMock} from '../../../../../themes/theme-mock';
import {FormProvider} from 'react-hook-form';
import useFormHook from '../../utils/hooks/useFormHook';

storiesOf('Organisms/RHF/DynamicForm/DynamicFormField/components/FormSlider', module)
  .addDecorator((getStory) => <ThemeProvider theme={themeMock}>{getStory()}</ThemeProvider>)

  .add('Slider', () => {
    const defaultProps: IFormSliderProps = {
      name: 'Slider',
      label: 'Slider',
      min: 1,
      max: 30,
      step: 1,
      isRequired: true,
    };
    const {methods}: any = useFormHook({});
    return (
      <FormProvider {...methods}>
        <FormSlider {...defaultProps} />
      </FormProvider>
    );
  });
