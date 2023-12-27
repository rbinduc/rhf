import {TFunction} from 'i18next';
import {IDynamicFormFieldProps} from '../DynamicForm';
import {ISelectOption} from '../DynamicFormField/components/FormSelect';

export interface ExtraFieldProps {
  [key: string]: Partial<IDynamicFormFieldProps>;
}

export const translatePrefix = 'translate__';

export const checkAndTranslateParams = (param: string, t: TFunction): any => {
  if (typeof param === 'string' && param.startsWith(translatePrefix)) {
    return t(param.replace(translatePrefix, ''));
  }
  return param;
};

export const mergeFields = (
  formFields: IDynamicFormFieldProps[],
  extraProps: ExtraFieldProps,
  pageSelector?: string
): IDynamicFormFieldProps[] =>
  formFields?.map((value) => {
    const extraFiledProps = extraProps[value.name];
    value = pageSelector ? {...value, id: `${pageSelector}_${value.name}`} : value;
    if (extraFiledProps) {
      return {...value, ...extraFiledProps};
    }
    return value;
  });

export const resolveTranslations = (formFields: IDynamicFormFieldProps[], t: TFunction): IDynamicFormFieldProps[] => {
  return formFields?.map((field) => {
    let fieldData: any = {};
    if (typeof field.label === 'string') {
      fieldData.label = checkAndTranslateParams(field.label, t);
    }
    if (field.validations) {
      const newValidations = Object.entries(field.validations).reduce((attr, item) => {
        const value = item[1];
        return {
          ...attr,
          [item[0]]:
            typeof value === 'string'
              ? checkAndTranslateParams(value, t)
              : {...value, message: checkAndTranslateParams(item[1].message, t)},
        };
      }, {});
      field = {...field, validations: newValidations};
    }

    if (field.placeholder) {
      fieldData.placeholder = checkAndTranslateParams(field.placeholder, t);
    }

    if (field.title) {
      fieldData.title = checkAndTranslateParams(field.title, t);
    }

    if (field.description) {
      fieldData.description = checkAndTranslateParams(field.description, t);
    }

    if (!!field.options?.length) {
      field.options = field.options.map((option: ISelectOption | string) =>
        typeof option === 'string'
          ? checkAndTranslateParams(option, t)
          : {
              ...option,
              label: checkAndTranslateParams(option.label, t),
            }
      );
    }

    return {...field, ...fieldData} as IDynamicFormFieldProps;
  });
};

export const removeEmptyFields = (dataObject: any) => {
  const shallowCopy = {...dataObject};
  Object.keys(shallowCopy).forEach((key) => shallowCopy[key] === null || (shallowCopy[key] === '' && delete shallowCopy[key]));
  return shallowCopy;
};

export const sortStringObjectArray = (objArray: any[], key: string): any[] => {
  return objArray.sort((a, b) => a[key].toLowerCase().localeCompare(b[key].toLowerCase()));
};

/**
 * Translates all component fields and then resolve field state (enabled or disabled).
 * @param formFields as IDynamicFormFieldProps[]
 * @param extraProps as ExtraFieldProps
 * @param t as TFunction
 * @returns formFields as IDynamicFormFieldProps[]
 */
export const getResolvedFields = (
  formFields: IDynamicFormFieldProps[],
  extraProps: ExtraFieldProps,
  t: TFunction
): IDynamicFormFieldProps[] => resolveTranslations(mergeFields(formFields, extraProps), t);

export const getIsDisabled = (
  isDirty: boolean,
  isValid: boolean,
  isSubmitting: boolean,
  showPromiseScreen: boolean = false,
  errors: any = {}
) => !isDirty || !isValid || isSubmitting || showPromiseScreen || JSON.stringify(errors) !== '{}';

export const checkIfFieldIsHidden = (formFields: IDynamicFormFieldProps[], name: string): boolean =>
  formFields?.find((formField) => formField.name === name)?.isHidden ?? false;
