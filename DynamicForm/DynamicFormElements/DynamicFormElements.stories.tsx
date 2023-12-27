import React from 'react';
import {storiesOf} from '@storybook/react';
import DynamicFormElements, {IDynamicFormElements} from './DynamicFormElements';

const dynamicFormElementsProps: IDynamicFormElements = {
  fields: [],
  showSubmitButton: false,
  submitButton: {
    id: 'Form_Id',
    buttonText: 'Submit',
    variant: 'contained',
    size: 'large',
    color: 'primary',
  },
};

storiesOf('Organisms/RHF/DynamicForm/DynamicFormField', module).add('default case', () => (
  <DynamicFormElements {...dynamicFormElementsProps} />
));
