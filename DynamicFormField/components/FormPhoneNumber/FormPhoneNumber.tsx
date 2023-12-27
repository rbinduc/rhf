import React from 'react';
import {Box, InputLabel} from '@material-ui/core';
import {Controller, useFormContext, Message} from 'react-hook-form';
import {IDynamicFormFieldCommonProps, getLabel} from '../../DynamicFormField';
import styled from '@emotion/styled';
import {useTheme} from 'emotion-theming';
import {ITenantTheme, IFormElement} from '../../../../../../models';
import PhoneInput from 'react-phone-input-2';
import libphonenumber from 'google-libphonenumber';
import 'react-phone-input-2/lib/high-res.css';
import es from 'react-phone-input-2/lang/es.json';
import fr from 'react-phone-input-2/lang/fr.json';
import ru from 'react-phone-input-2/lang/ru.json';
import FormMessage from '../../utils/FormMessage';

const PLUS_SYMBOL = '+';
const FALLBACK_COUNTRY_CODE = '001';

// ----------------------------------------------------------------------------
// Props
// ----------------------------------------------------------------------------
export interface IFormPhoneNumberProps extends IDynamicFormFieldCommonProps {
  languageCode?: string;
  allowItalianLeadingZero?: boolean;
}

export type IKey = {
  [key: string]: any;
};

const isValidItalianNumber = (phoneNumberInput: libphonenumber.PhoneNumber): boolean => {
  const hasItalianLeadingZero = phoneNumberInput.hasItalianLeadingZero();
  const phoneNumber = phoneNumberInput.getNationalNumber();
  const count = String(phoneNumber)?.length >= 9;

  return !hasItalianLeadingZero && count;
};

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------
const FormPhoneNumber: React.FC<IFormPhoneNumberProps> = (props: IFormPhoneNumberProps) => {
  const {
    validations,
    label,
    name,
    languageCode,
    placeholder,
    isDisabled,
    isRequired,
    defaultValue,
    id,
    labelId = '',
    allowItalianLeadingZero = false,
  } = props;
  const {
    control,
    formState: {errors, dirtyFields},
  } = useFormContext();
  const errorMessage = errors[name]?.message;
  const isDirty = !!dirtyFields[name];
  const phoneUtil = libphonenumber.PhoneNumberUtil.getInstance();
  const theme: ITenantTheme = useTheme();
  const errorClass = !!errorMessage ? 'phone-number-format-error' : '';
  const dirtyClass = isDirty ? 'dirty' : '';
  let containerClass = `phone-number-format ${errorClass} ${dirtyClass}`;

  const rules = {
    ...validations,
    validate: (value: any) => {
      let isValid: Message | boolean = validations?.validateMessage as Message;
      try {
        const inputVal = value?.startsWith(PLUS_SYMBOL) ? value : PLUS_SYMBOL + value;
        const phoneNumberInput = phoneUtil.parseAndKeepRawInput(inputVal);
        const isValidPhoneNumber = phoneUtil.isValidNumber(phoneNumberInput);
        const countryCode = phoneUtil.getRegionCodeForNumber(phoneNumberInput) ?? FALLBACK_COUNTRY_CODE;
        if (isValidPhoneNumber && isNaN(parseInt(countryCode, 10))) {
          isValid = true as boolean;
        }
        if (!allowItalianLeadingZero && countryCode === 'IT') {
          isValid = isValidItalianNumber(phoneNumberInput) || (validations?.validateMessage as Message);
        }
      } catch (e) {}
      return isValid;
    },
  };

  const localeCodes: IKey = {es, fr, ru};
  const lngCode = languageCode?.toLowerCase() ?? 'us';
  const formElement = theme?.designSystem?.atoms?.formElement ?? {};
  return (
    <BoxStyled {...formElement}>
      <InputLabel htmlFor={name} className={errorMessage && 'error'} id={labelId}>
        {getLabel(label, !!isRequired)}
      </InputLabel>
      <Controller
        name={name}
        control={control}
        rules={rules}
        defaultValue={defaultValue}
        render={({field}) => (
          <PhoneInput
            {...field}
            placeholder={placeholder}
            inputProps={{
              id,
              name,
              disabled: isDisabled,
              readOnly: isDisabled,
              required: isRequired,
              'aria-label': label && typeof label === 'string' ? label : placeholder,
              'aria-hidden': isDisabled,
            }}
            containerClass={containerClass}
            localization={localeCodes[lngCode]}
            onChange={(e, country, value, formattedValue) => field.onChange(formattedValue)}
          />
        )}
      />
      <FormMessage message={errorMessage} />
    </BoxStyled>
  );
};

const BoxStyled = styled(({borderColor, borderColorFocused, borderColorError, ...rest}) => <Box {...rest} />)<IFormElement>`
  .phone-number-format {
    display: flex;
    flex-direction: row-reverse;
    justify-content: center;
    border-radius: 0.25rem;

    .form-control {
      height: 3.5rem;
      width: 100%;
      padding-left: 3.5rem;
      padding: 1.15625rem 0.875rem;
      margin-left: 0.5rem;
      border-radius: inherit;
      border-color: ${({borderColor}) => borderColor};
      & + .flag-dropdown {
        border-color: ${({borderColor}: IFormElement) => borderColor};
      }
    }
    .form-control:focus,
    &.dirty .form-control {
      border-width: 0.125rem;
      border-color: ${({borderColorFocused}: IFormElement) => borderColorFocused};
      & + .flag-dropdown {
        border-width: 0.125rem;
        border-color: ${({borderColorFocused}: IFormElement) => borderColorFocused};
      }
    }

    .flag-dropdown {
      border-radius: inherit;
      position: initial;
      background-color: transparent;
      .country-list {
        width: 100%;
        border: ${({borderColorFocused}: IFormElement) => `1px solid ${borderColorFocused}`};
        border-radius: 0.3125rem;
        box-shadow: 0rem 0.125rem 0.375rem #dbdbdb;
        .country {
          padding: 0.625rem 0.5625rem 0.625rem 3.125rem;
          position: relative;
          height: 2.5rem;
          border-bottom: 0.0625rem solid #dbdbdb;
          line-height: 1.4rem;
          font-weight: 400;
          font-size: 1rem;
          font-family: Nunito;
          display: flex;
          flex-direction: row;
          &:hover,
          &.highlight {
            background-color: #c7ced6;
          }
          .country-name {
            max-width: 200px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
        }
        .flag {
          left: 0.9375rem;
          top: 0.5rem;
          transform: scale(1.2);
        }
      }
    }

    .flag-dropdown.open .selected-flag {
      border-radius: inherit;
    }

    .selected-flag {
      width: 5.25rem;
      border-radius: inherit;
      padding: 0;
      display: flex;
      justify-content: center;
      .flag {
        margin-left: -0.9375rem;
        transform: scale(1.2);
      }
      [class='flag 0'] {
        margin-top: -0.625rem;
        background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15.9062 15.3906C17.3125 13.8906 18.0156 12.0938 18.0156 10C18.0156 8.34375 17.5469 6.84375 16.6094 5.5C15.7031 4.15625 14.5 3.1875 13 2.59375V3.01562C13 3.54688 12.7969 4.01562 12.3906 4.42188C11.9844 4.79688 11.5156 4.98438 10.9844 4.98438H9.01562V7C9.01562 7.28125 8.90625 7.51562 8.6875 7.70312C8.5 7.89062 8.26562 7.98438 7.98438 7.98438H6.01562V10H12.0156C12.2969 10 12.5312 10.0938 12.7188 10.2812C12.9062 10.4688 13 10.7031 13 10.9844V13.9844H13.9844C14.9219 13.9844 15.5625 14.4531 15.9062 15.3906ZM9.01562 17.9219V16C8.48438 16 8.01562 15.7969 7.60938 15.3906C7.20312 14.9844 7 14.5156 7 13.9844V13L2.21875 8.21875C2.0625 8.84375 1.98438 9.4375 1.98438 10C1.98438 12.0312 2.65625 13.7969 4 15.2969C5.375 16.7969 7.04688 17.6719 9.01562 17.9219ZM2.92188 2.96875C4.89062 1 7.25 0.015625 10 0.015625C12.75 0.015625 15.0938 1 17.0312 2.96875C19 4.90625 19.9844 7.25 19.9844 10C19.9844 12.75 19 15.1094 17.0312 17.0781C15.0938 19.0156 12.75 19.9844 10 19.9844C7.25 19.9844 4.89062 19.0156 2.92188 17.0781C0.984375 15.1094 0.015625 12.75 0.015625 10C0.015625 7.25 0.984375 4.90625 2.92188 2.96875Z' fill='%23273446'%3E%3C/path%3E%3C/svg%3E");
      }

      .arrow {
        border-left-width: 0.25rem;
        border-right-width: 0.25rem;
      }
    }
  }
  .phone-number-format-error,
  .phone-number-format-error.dirty {
    & .form-control {
      border-width: 0.125rem;
      border-color: ${({borderColorError}: IFormElement) => borderColorError};
      & + .flag-dropdown {
        border-width: 0.125rem;
        border-color: ${({borderColorError}: IFormElement) => borderColorError};
      }
      &:focus {
        border-color: ${({borderColorError}: IFormElement) => borderColorError};
        & + .flag-dropdown {
          border-color: ${({borderColorError}: IFormElement) => borderColorError};
        }
      }
    }
  }
`;

export default FormPhoneNumber;
