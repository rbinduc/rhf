import React from 'react';
import {storiesOf} from '@storybook/react';
import FormRadio, {IFormRadioProps} from '.';
import {ThemeProvider} from 'emotion-theming';
import {themeMock} from '../../../../../themes/theme-mock';
import {FormProvider} from 'react-hook-form';
import useFormHook from '../../utils/hooks/useFormHook';

storiesOf('Organisms/RHF/DynamicForm/DynamicFormField/components/FormRadio', module)
  .addDecorator((getStory) => <ThemeProvider theme={themeMock}>{getStory()}</ThemeProvider>)

  .add('Langauge', () => {
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
    const {methods}: any = useFormHook({});
    return (
      <FormProvider {...methods}>
        <FormRadio {...defaultProps} />
      </FormProvider>
    );
  });
