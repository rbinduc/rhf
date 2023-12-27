import React from 'react';
import {render} from '@testing-library/react';
import {FormProvider} from 'react-hook-form';
import useFormHook from './hooks/useFormHook';
import {ThemeProvider} from 'emotion-theming';
import {themeMock} from '../../../../themes/theme-mock';

interface IDefaultValue {
  [key: string]: any;
}

interface RenderOptions {
  defaultValues?: IDefaultValue;
  toPassBack?: any[];
}

/**
 * Testing Library utility function to wrap tested component in React Hook Form
 * @param {ReactElement} ui A React component
 * @param objectParameters
 * @param {Object} objectParameters.defaultValues Initial form values to pass into
 * React Hook Form, which you can then assert against
 * @param {Array} objectParameters.toPassBack React Hook Form method names which we'd
 * like to pass back and use in tests.  A primary use case is sending back 'setError',
 * so we can manually setErrors on React Hook Form components and test error handling
 */
export function renderWithDyanmicForm(
  ui: React.ReactElement<any, string | React.JSXElementConstructor<any>>,
  {defaultValues = {}, toPassBack = []}: RenderOptions = {}
) {
  let dynamicFormMethods = {} as any;

  const Wrapper = ({children}: {children: React.ReactNode}) => {
    const {methods}: any = useFormHook({defaultValues});
    for (let dynamicFormItem of toPassBack) {
      dynamicFormMethods[dynamicFormItem] = methods[dynamicFormItem];
    }

    return (
      <ThemeProvider theme={themeMock}>
        <FormProvider {...methods}>{children}</FormProvider>
      </ThemeProvider>
    );
  };

  return {
    ...render(ui, {wrapper: Wrapper as React.ComponentType<{}>}),
    dynamicFormMethods,
  };
}

/**
 * Higher order helper function which wraps a component w/ React Hook Form
 * @param {React Component} WrappedComponent to pass into
 * @param {*} restProps any other remaining props
 * @returns {React Component}
 */
export function withDynamicForm(WrappedComponent: React.ComponentType<any>, restProps: object, defaultValues: IDefaultValue) {
  return () => {
    const methods = useFormHook({defaultValues});

    return (
      <ThemeProvider theme={themeMock}>
        <WrappedComponent {...restProps} {...methods} />
      </ThemeProvider>
    );
  };
}
