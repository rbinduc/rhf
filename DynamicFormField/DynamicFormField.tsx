import React, {FC, ReactNode} from 'react';
import {TextFieldProps} from '@material-ui/core';
import {RegisterOptions, ValidationValueMessage} from 'react-hook-form';
import FormTextField from './components/FormTextField';
import FormCheckbox from './components/FormCheckbox';
import FormPhoneNumber from './components/FormPhoneNumber';
import FormSelect, {ISelectOption} from './components/FormSelect';
import FormSwitch from './components/FormSwitch';
import FormAutocomplete from './components/FormAutocomplete';
import FormGeoAutocomplete from './components/FormGeoAutocomplete';

import {IconNames} from '../../../icons/IconNameConstants';
import FormMonthAndYearPicker from './components/FormMonthAndYearPicker';
import FormTextNode from './components/FormTextNode/FormTextNode';
import FormCalendarDuration, {IFormCalendarDurationProps} from './components/FormCalendarDuration';
import {IFormSelectProps} from './components/FormSelect/FormSelect.component';
import FormAsyncAutocomplete, {IFormAsyncAutocompleteProps} from './components/FormAsyncAutocomplete';
import FormMonthAndYearDuration, {IFormMonthAndYearDurationProps} from './components/FormMonthAndYearDuration';
import FormRadio from './components/FormRadio';
import FormSlider from './components/FormSlider';

// ----------------------------------------------------------------------------
// Props
// ----------------------------------------------------------------------------
export interface InputProps extends Omit<TextFieldProps['InputProps'], 'inputProps'> {}

export enum DynamicFormFieldType {
  TEXT = 'text',
  PASSWORD = 'password',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  EMAIL = 'email',
  DATE = 'date',
  TEL = 'tel',
  PHONE = 'phone',
  SELECT = 'select',
  SWITCH = 'switch',
  TEXT_AREA = 'textarea',
  AUTO_COMPLETE = 'autocomplete',
  GEO_AUTO_COMPLETE = 'geoautocomplete',
  ASYNC_AUTO_COMPLETE = 'asyncAutocomplete',
  TEXT_NODE = 'textnode',
  CALENDAR_DURATION = 'calendarDuration',
  MONTH_YEAR_DURATION = 'monthYearDuration',
  SLIDER = 'slider',
}

export enum IDynamicFormFieldMode {
  NORMAL = 'normal',
  DENSE = 'dense',
}
export interface IValidations extends RegisterOptions {
  validateMessage?: string;
}

export interface IDynamicFormFieldCommonProps {
  id: string;
  name: string;
  label: ReactNode;
  value?: any;
  placeholder?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  className?: string;
  validations?: IValidations;
  defaultValue?: any;
  description?: string;
  labelId?: string;
  onClick?: () => void;
  freeSoloTextInput?: boolean;
  noOptionsText?: string;
  onKeyDown?: (event: any) => void;
  onKeyDownExtra?: () => void;
  onOptionClick?: () => void;
  onCloseIconClick?: () => void;
}

export interface IGeoOptions {
  types: string;
  country: string;
  isMultiSelect?: boolean;
  optionDisplayCount?: number;
}

export interface IDynamicFormFieldProps extends IDynamicFormFieldCommonProps {
  inputType: DynamicFormFieldType;
  onChange?: any;
  endIcon?: ReactNode;
  startIcon?: ReactNode;
  Icon?: IconNames;
  hideAsterisk?: boolean;
  InputProps?: InputProps;
  inputProps?: TextFieldProps['inputProps'];
  options?: ISelectOption[] | string[];
  mode?: IDynamicFormFieldMode;
  title?: string;
  gutter?: boolean;
  isMultiSelect?: boolean;
  geoLocation?: IGeoOptions;
  keyboardLayout?: KeyboardLayout;
  rows?: number;
  isHidden?: boolean;
  onFocus?: any;
  onBlur?: any;
  languageCode?: string;
  blackListEmailDomains?: string[];
  noBorder?: boolean;
  asyncFunction?: (...args: any) => any;
  customErrorMessage?: string;
  onChangeExtra?: any;
  skipBlurValidation?: boolean;
  onInputChange?: (event: any, newInputValue: string) => void;
  additionalTags?: string;
  allowItalianLeadingZero?: boolean;
  minAutoFillLength?: number;
}

enum KeyboardLayout {
  ALPHANUMERIC = 'alphanumeric',
  NUMERIC = 'numeric',
}

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------
export const getRequiredLabel = (isRequired: boolean = false, hideAsterisk: boolean = false) => (isRequired && !hideAsterisk ? '*' : '');

export const getLabel = (label: ReactNode, isRequired: boolean, hideAsterisk?: boolean) => {
  if (!label) {
    return '';
  }

  return `${label}${getRequiredLabel(isRequired, hideAsterisk)}`;
};

const formatFieldProps = (props: Partial<IDynamicFormFieldProps>) => {
  let fieldProps = props;
  const {validations = {}} = fieldProps || {};

  let inputProps: TextFieldProps['inputProps'] = {};

  if (fieldProps.keyboardLayout === KeyboardLayout.NUMERIC) {
    delete fieldProps.keyboardLayout;
    inputProps.inputMode = 'numeric';
    inputProps.pattern = '[0-9]*';
  }

  const validationPattern = validations['pattern'];
  if (validationPattern) {
    const {value, message} = validationPattern as ValidationValueMessage<RegExp>;
    try {
      fieldProps = {
        ...fieldProps,
        validations: {...validations, pattern: {message, value: new RegExp(value)}},
      };
      // Pass input props only if there is something defined inside.
      if (Object.keys(inputProps).length) {
        fieldProps = {
          ...fieldProps,
          inputProps: {...inputProps},
        };
      }
    } catch (e) {
      console.warn(`${fieldProps?.name} regex validation is failed. Reason: invalid regex:${value}`);
    }
  }
  return fieldProps;
};

const DynamicFormField: FC<IDynamicFormFieldProps> = ({inputType, isHidden, rows = 4, ...rest}: IDynamicFormFieldProps) => {
  if (isHidden) {
    return null;
  }

  switch (inputType) {
    case DynamicFormFieldType.CHECKBOX:
      return <FormCheckbox {...rest} />;

    case DynamicFormFieldType.RADIO:
      return <FormRadio {...rest} />;

    case DynamicFormFieldType.PHONE:
      return <FormPhoneNumber {...rest} />;

    case DynamicFormFieldType.SELECT:
      return <FormSelect {...(rest as IFormSelectProps)} />;

    case DynamicFormFieldType.SWITCH:
      return <FormSwitch {...rest} />;

    case DynamicFormFieldType.TEXT_AREA:
      return <FormTextField {...formatFieldProps(rest)} multiline rows={rows} />;

    case DynamicFormFieldType.DATE:
      return <FormMonthAndYearPicker {...rest} />;

    case DynamicFormFieldType.AUTO_COMPLETE:
      return <FormAutocomplete {...rest} />;

    case DynamicFormFieldType.GEO_AUTO_COMPLETE:
      return <FormGeoAutocomplete {...rest} />;

    case DynamicFormFieldType.ASYNC_AUTO_COMPLETE:
      return <FormAsyncAutocomplete {...(rest as IFormAsyncAutocompleteProps<any>)} />;

    case DynamicFormFieldType.TEXT_NODE:
      return <FormTextNode {...rest} />;

    case DynamicFormFieldType.CALENDAR_DURATION:
      return <FormCalendarDuration {...(rest as IFormCalendarDurationProps)} />;

    case DynamicFormFieldType.MONTH_YEAR_DURATION:
      return <FormMonthAndYearDuration {...(rest as IFormMonthAndYearDurationProps)} />;

    case DynamicFormFieldType.SLIDER:
      return <FormSlider {...rest} />;

    default:
      return <FormTextField {...formatFieldProps(rest)} />;
  }
};

export default DynamicFormField;
