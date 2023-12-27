import React, {Fragment, ReactNode, RefObject, useRef, useEffect, useState, Dispatch, SetStateAction} from 'react';
import styled from '@emotion/styled';
import Autocomplete, {AutocompleteProps, RenderInputParams, RenderOptionState} from '@material-ui/lab/Autocomplete';
import {Paper, FormControl, FormControlLabel, TextField, Checkbox, CircularProgress, Chip} from '@material-ui/core';
import ReactHtmlParser from 'react-html-parser';
import {Controller, ControllerRenderProps, FieldValues, useFormContext} from 'react-hook-form';
import {IFormTextFieldProps} from '../FormTextField/FormTextField';
import FormMessage from '../../utils/FormMessage';
import {IconNames} from '../../../../../icons/IconNameConstants';
import {TenantVector} from '../../../../../icons/TenantVector/TenantVector.component';
import {Typography} from '../../../../../atoms/Typography';
import {getLabel} from '../../DynamicFormField';
import {CheckedIcon} from '../../../../../icons/global/checkbox/Checked';
import {UncheckedIcon} from '../../../../../icons/global/checkbox/Unchecked';
import {CustomPopper} from '../../utils/CustomPopper';
import {ISelectOption} from '../FormSelect';
import {calculateMaxInputHeight, isMobileApp} from '../../../../../../helpers/HelperUtils';
import {SharedSliceStore} from '../../../../../../store/sharedSlice';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../../../store/root-reducer';

const DEFAULT_LIMIT_TAGS = 1;

// ----------------------------------------------------------------------------
// Props
// ----------------------------------------------------------------------------
export type IFormAutocompleteProps<T extends Record<string, any>> = Omit<IFormTextFieldProps, 'variant'> & {
  options?: T;
  Icon?: IconNames;
  isMultiSelect?: boolean;
  noBorder?: boolean;
  freeSoloTextInput?: boolean;
  onInputChange?: (event: any, newInputValue: string) => void;
  onChangeExtra?: (event: any, newValue: string | null) => void;
  filterSelectedOptions?: boolean;
  forceError?: boolean;
  customErrorMessage?: string;
  onCloseIconClick?: () => void;
  additionalTags?: string;
} & Omit<AutocompleteProps<T>, 'options' | 'renderInput'>;

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------
const getNoOptionsText = (text?: ReactNode) =>
  text && (
    <NoOptionsText variant="body2">
      <TenantVector tenantVectorName={IconNames.FieldError} />
      <span>{text}</span>
    </NoOptionsText>
  );

const getMultiSelectClassName = (isMultiSelect: boolean) => (isMultiSelect ? 'multiple' : '');

const getFormControlLabelClassName = (isError: boolean) => (isError ? 'error' : '');

const getTextFieldClassName = (isDirty: boolean) => (isDirty ? 'dirty' : '');

const CustomPaperComponent = ({
  children,
  noOptionsText,
  inputListMaxHeight,
}: {
  children?: ReactNode;
  noOptionsText?: ReactNode;
  inputListMaxHeight?: string;
}) => (
  <OptionsWrapper elevation={0} noOptionsText={noOptionsText} inputListMaxHeight={inputListMaxHeight}>
    {children}
  </OptionsWrapper>
);

const getMatchLabel = (option: string, regex: RegExp | string): string => {
  const matches = option.match(regex);
  let matchLabel: any = option;
  matches?.forEach((match: any) => {
    matchLabel = ReactHtmlParser(option.replace(match, `<strong>${match}</strong>`));
  });
  return matchLabel;
};

const getOptionLabel = (option: any, value: string): string => {
  let regex: RegExp | string = '';
  try {
    regex = new RegExp(value, 'gi') as RegExp;
  } catch (e) {}
  return getMatchLabel(typeof option === 'string' ? option : option?.label, regex);
};

const renderOptionLabel = (option: any, inputValue: string): ReactNode => {
  const label = getOptionLabel(option, inputValue);
  return (
    <OptionLabel aria-label={typeof option === 'string' ? option : option?.label} variant="body2">
      {label}
    </OptionLabel>
  );
};

const renderOption = (option: any, {inputValue}: RenderOptionState) => renderOptionLabel(option, inputValue);

const renderMultipleOption = (option: any, {selected, inputValue}: RenderOptionState) => (
  <>
    <CheckboxStyled icon={<UncheckedIcon />} checkedIcon={<CheckedIcon />} checked={selected} style={{marginRight: 4}} color={'primary'} />
    {renderOptionLabel(option, inputValue)}
  </>
);

const isValid = (value: string | string[] | ISelectOption) =>
  typeof value === 'string' ? !!value : Array.isArray(value) ? !!value?.length : !!(value as ISelectOption)?.value;

const renderPopupIcon = (value: string | string[], Icon: IconNames) => (!isValid(value) ? <TenantVector tenantVectorName={Icon} /> : null);

const renderCloseIcon = (value: string | string[] | ISelectOption, callback?: () => void) =>
  isValid(value) ? (
    <CloseIcon onClick={() => callback && callback()}>
      <TenantVector tenantVectorName={IconNames.CloseFilled} />
    </CloseIcon>
  ) : null;

const getMainContent = () => {
  let mainContent: HTMLElement | null = null;
  let mainContentDrawer: HTMLElement | null = null;
  let mainContentTop: number = 0;
  mainContent = isMobileApp()
    ? (document.querySelector('.MuiDrawer-root .main_content') as HTMLElement) ?? (document.querySelector('.main_content') as HTMLElement)
    : (document.querySelector('.MuiDrawer-root .main_content div') as HTMLElement) ??
      (document.querySelector('.main_content div') as HTMLElement);
  mainContentDrawer = document.querySelector('.MuiDrawer-root .MuiPaper-root') as HTMLElement;
  mainContentTop = mainContent?.getBoundingClientRect()?.top ?? 0;
  return {mainContent, mainContentTop, mainContentDrawer};
};

const renderInput = (
  params: RenderInputParams,
  label: ReactNode,
  labelId: string,
  errorMessage: string,
  isRequired: boolean,
  isDisabled: boolean,
  isDirty: boolean,
  placeholder: string,
  autocompleteInputRef?: RefObject<HTMLInputElement>,
  isMultiSelect?: boolean,
  loading?: boolean
) => (
  <FormControlLabelStyled
    control={
      <TextField
        {...params}
        inputRef={autocompleteInputRef}
        key={labelId}
        fullWidth
        variant="outlined"
        placeholder={placeholder}
        error={Boolean(errorMessage)}
        helperText={<FormMessage message={errorMessage} component={'span'} />}
        required={isRequired}
        disabled={isDisabled}
        InputProps={{
          ...params.InputProps,
          readOnly: isDisabled,
          className: getTextFieldClassName(isDirty),
          endAdornment: !isDisabled ? (
            <Fragment>
              {loading && (
                <AutocompleteLoader>
                  <CircularProgress size={20} style={{position: 'initial'}} />
                </AutocompleteLoader>
              )}
              {params.InputProps.endAdornment}
            </Fragment>
          ) : null,
        }}
        InputLabelProps={{
          ...params.InputLabelProps,
          disableAnimation: true,
          shrink: false,
        }}
        inputProps={{
          ...params.inputProps,
          'aria-label': label && typeof label === 'string' ? label : placeholder,
          'aria-hidden': isDisabled,
        }}
      />
    }
    labelPlacement="top"
    label={getLabel(label, !!isRequired)}
    id={labelId}
    className={`${getMultiSelectClassName(!!isMultiSelect)} ${getFormControlLabelClassName(!!errorMessage)}`}
  />
);

const renderAutocomplete = (
  id: string,
  name: string,
  options: Record<string, any>,
  field: ControllerRenderProps<FieldValues, string>,
  label: ReactNode,
  labelId: string,
  errorMessage: string,
  isRequired: boolean,
  isDisabled: boolean,
  isDirty: boolean,
  value: any,
  Icon: IconNames,
  placeholder: string,
  isMultiSelect?: boolean,
  noBorder?: boolean,
  freeSoloTextInput?: boolean,
  autocompleteInputRef?: RefObject<HTMLInputElement>,
  onChangeExtra?: (event: any, newValue: string | null) => void,
  onInputChange?: (event: any, newInputValue: string) => void,
  noOptionsText?: ReactNode,
  limitTags?: number,
  onFocus?: (event: any) => void,
  onBlur?: (event: any) => void,
  getOptionSelected?: (option: any, value: any) => boolean,
  loading?: boolean,
  loadingText?: ReactNode,
  onKeyDown?: (event: any) => void,
  onChange?: (event: any) => void,
  onCloseIconClick?: () => void,
  setInputListMaxHeight?: Dispatch<SetStateAction<string>>,
  keyboardToolbarHeight?: number,
  inputListMaxHeight?: string,
  isOpen?: boolean,
  setIsOpen?: any,
  additionalTags?: string,
  keyboardHeightLayout?: number,
  setKeyboardHeightLayout?: Dispatch<SetStateAction<number>>
) => {
  return (
    <Autocomplete
      open={!!isOpen}
      id={id}
      {...field}
      blurOnSelect={!isMultiSelect}
      multiple={isMultiSelect}
      freeSolo={freeSoloTextInput}
      filterSelectedOptions={isMultiSelect}
      limitTags={limitTags}
      forcePopupIcon={!isValid(value)}
      autoSelect={!isMultiSelect}
      options={options as any[]}
      disabled={isDisabled}
      renderOption={isMultiSelect ? renderMultipleOption : renderOption}
      groupBy={(option) => option?.groupBy}
      getOptionLabel={(option) => (typeof option === 'string' ? option : option?.label ?? '')}
      renderTags={(tagValue, getTagProps) =>
        tagValue?.map((option, index) => <Chip label={option + additionalTags} {...getTagProps({index})} />)
      }
      getOptionSelected={(option: any, value: any) => (typeof option !== 'string' ? option?.value === value?.value : option === value)}
      PaperComponent={({children}: {children?: ReactNode}) => {
        return (
          <CustomPaperComponent noOptionsText={noOptionsText} inputListMaxHeight={inputListMaxHeight}>
            {children}
          </CustomPaperComponent>
        );
      }}
      PopperComponent={CustomPopper}
      loading={loading}
      renderInput={(params: RenderInputParams) => (
        <TextFieldWrapper noBorder={noBorder}>
          {renderInput(
            params,
            label,
            labelId,
            errorMessage,
            isRequired,
            isDisabled,
            isDirty,
            placeholder,
            autocompleteInputRef,
            isMultiSelect,
            loading
          )}
        </TextFieldWrapper>
      )}
      onChange={(e: any, value: any) => {
        if (isMobileApp()) {
          setTimeout(() => {
            const element = autocompleteInputRef?.current?.offsetParent as HTMLElement | any;
            const elementBottom = element?.getBoundingClientRect()?.bottom;
            if (keyboardHeightLayout) {
              setInputListMaxHeight?.(calculateMaxInputHeight(elementBottom, keyboardHeightLayout, keyboardToolbarHeight ?? 0));
            }
          }, 100);
        }
        if (onChange && !isMultiSelect && value) {
          onChange(e);
        }
        if (typeof onChangeExtra === 'function') {
          onChangeExtra(e, value);
        }
        field.onChange(value);
      }}
      closeIcon={renderCloseIcon(value, onCloseIconClick)}
      popupIcon={renderPopupIcon(value, Icon)}
      onInputChange={onInputChange}
      noOptionsText={getNoOptionsText(noOptionsText)}
      loadingText={loadingText}
      onFocus={(e: any) => {
        if (isMobileApp()) {
          const form = e.target.form as HTMLElement;
          const element = e.target.labels[0] as HTMLElement | any;
          let keyboardMaxHeight = 0;
          const {mainContentDrawer} = getMainContent();
          if (mainContentDrawer) {
            mainContentDrawer.style.height = '100%';
            mainContentDrawer.style.borderTopRightRadius = '0';
            mainContentDrawer.style.borderTopLeftRadius = '0';
          }
          window.addEventListener('keyboardDidShow', (event: any) => {
            const {keyboardHeight} = event || {};
            keyboardMaxHeight = keyboardHeight;
          });
          setTimeout(() => {
            const {mainContent, mainContentTop} = getMainContent();
            if (form && element && mainContent) {
              const elementTop = element.getBoundingClientRect()?.top;
              const posTop = (elementTop - mainContentTop) * -1;
              form.style.top = `${posTop}px`;
              mainContent.style.overflowY = 'hidden';
            }
          }, 700);
          setTimeout(() => {
            const elementBottom = element?.firstChild?.firstChild?.getBoundingClientRect()?.bottom;
            if (keyboardMaxHeight) {
              setKeyboardHeightLayout?.(keyboardMaxHeight);
              setInputListMaxHeight?.(calculateMaxInputHeight(elementBottom, keyboardMaxHeight, keyboardToolbarHeight ?? 0));
            }
            setIsOpen?.(true);
          }, 1200);
          onFocus?.(e);
        } else {
          setIsOpen?.(true);
        }
      }}
      onBlur={(e: any) => {
        if (isMobileApp()) {
          const form = e.target.form as any;
          if (form) {
            form.style.top = '0px';
          }
          window.removeEventListener('keyboardDidShow', () => {});
          setIsOpen?.(false);
          onBlur?.(e);
        } else {
          setIsOpen?.(false);
        }
        const {mainContent} = getMainContent();
        if (mainContent) mainContent.style.overflowY = '';
      }}
      onKeyDown={(e: any) => {
        if (isMobileApp()) {
          onKeyDown?.(e);
          if (e.keyCode === 13) {
            e.target?.blur();
          }
        }
      }}
    />
  );
};

const FormAutocomplete = ({
  id = '',
  label,
  name,
  defaultValue,
  options = [],
  validations,
  isRequired,
  isDisabled,
  labelId = '',
  Icon = IconNames.SearchOutlined,
  placeholder = '',
  isMultiSelect,
  noBorder = false,
  freeSoloTextInput = true,
  noOptionsText,
  onChangeExtra,
  onInputChange,
  limitTags = DEFAULT_LIMIT_TAGS,
  onFocus,
  onBlur,
  getOptionSelected,
  loading,
  loadingText = '',
  onKeyDown,
  onChange,
  forceError,
  customErrorMessage,
  onCloseIconClick,
  additionalTags = '',
}: IFormAutocompleteProps<Record<string, any>>) => {
  const autocompleteInputRef = useRef<HTMLInputElement>(null);
  const {
    control,
    watch,
    setError,
    formState: {errors, dirtyFields},
  } = useFormContext();
  const {shared: {cutoutInfo: {keyboardToolbarHeight} = {}} = {} as SharedSliceStore} = useSelector((state: RootState) => state);
  const [inputListMaxHeight, setInputListMaxHeight] = useState<string>('');
  const [keyboardHeightLayout, setKeyboardHeightLayout] = useState<number>(0);
  const [isOpen, setIsOpen] = useState(false);
  const errorMessage = errors[name!]?.message;
  const isDirty = !!dirtyFields[name!];
  const value = watch(name!);

  useEffect(() => {
    if (forceError && customErrorMessage) {
      setError(name!, {
        type: 'manual',
        message: customErrorMessage,
      });
    }
  }, [customErrorMessage, forceError, name, setError]);

  return (
    <FormControlStyled error={Boolean(errorMessage)} required={isRequired}>
      <Controller
        render={({field}) =>
          renderAutocomplete(
            id,
            name!,
            options,
            field,
            label,
            labelId,
            errorMessage,
            !!isRequired,
            !!isDisabled,
            isDirty,
            value,
            Icon,
            placeholder,
            isMultiSelect,
            noBorder,
            freeSoloTextInput,
            autocompleteInputRef,
            onChangeExtra,
            onInputChange,
            noOptionsText,
            limitTags,
            onFocus,
            onBlur,
            getOptionSelected,
            loading,
            loadingText,
            onKeyDown,
            onChange,
            onCloseIconClick,
            setInputListMaxHeight,
            keyboardToolbarHeight,
            inputListMaxHeight,
            isOpen,
            setIsOpen,
            additionalTags,
            keyboardHeightLayout,
            setKeyboardHeightLayout
          )
        }
        name={name!}
        control={control}
        defaultValue={defaultValue}
        rules={validations}
      />
    </FormControlStyled>
  );
};

// ----------------------------------------------------------------------------
// Styles
// ----------------------------------------------------------------------------
const FormControlStyled = styled(FormControl)`
  width: 100%;
`;

const FormControlLabelStyled = styled(FormControlLabel)`
  width: 100%;
  margin: 0;
  align-items: flex-start;
  & .MuiFormControlLabel-label {
    margin-bottom: 0.3125rem;
  }

  & .MuiOutlinedInput-adornedEnd {
    padding-right: 0;
    display: flex;
  }

  & .MuiAutocomplete-endAdornment {
    position: relative;
    top: unset;
    right: unset;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 0 0 2.25rem;
    align-self: stretch;

    & > button {
      position: absolute;
      height: 100%;
      width: 100%;
      border-radius: 0;
      padding: 0;

      & > span {
        height: 100%;
      }
    }
  }

  & .MuiAutocomplete-clearIndicator {
    padding: 0;
  }

  & .MuiAutocomplete-clearIndicatorDirty {
    visibility: visible;
  }

  & .MuiAutocomplete-popupIndicator {
    color: #4a5666;
  }

  & .MuiAutocomplete-popupIndicatorOpen {
    transform: none;
  }
`;

const CheckboxStyled = styled(Checkbox)`
  &.MuiCheckbox-colorPrimary.Mui-checked {
    color: #273446;
  }
`;

type OptionsWrapperCSS = {
  inputListMaxHeight?: string;
  noOptionsText?: ReactNode;
};

const OptionsWrapper = styled(({inputListMaxHeight, noOptionsText, ...rest}) => <Paper {...rest} />)<OptionsWrapperCSS>`
  & .MuiAutocomplete-groupLabel {
    border-bottom: 1px solid #c7ced6;
    color: #273446;
    font-size: 1rem;
  }
  & .MuiAutocomplete-option {
    border-bottom: 1px solid #c7ced6;
  }

  & .MuiAutocomplete-noOptions {
    display: ${({noOptionsText}) => (noOptionsText ? 'flex' : 'none')};
    border: 1px solid #4a5666;
    border-radius: 4px;
    color: rgba(39, 52, 70, 1);
    padding: 0 1rem;
    align-items: center;
    justify-content: flex-start;
    height: 48px;
  }

  & .MuiAutocomplete-loading {
    display: none;
    padding: 0;
  }

  & .MuiAutocomplete-listbox {
    padding: 0;
    border: 1px solid #4a5666;
    border-radius: 4px;
    z-index: 2;
    max-height: ${({inputListMaxHeight}) => inputListMaxHeight || '15rem'};
  }

  & .MuiAutocomplete-option:hover,
  & .MuiAutocomplete-option[data-selected='true'] {
    background-color: #c7ced6;
  }
`;

type TextWrapperStyledCSS = {
  noBorder?: boolean;
};

const TextFieldWrapper = styled.div<TextWrapperStyledCSS>`
  & .MuiOutlinedInput-root {
    background: #ffffff;
    height: auto;
    min-height: 3.5rem;
    opacity: ${(props) => (props.noBorder ? 0.75 : 1)};
    & fieldset {
      border-width: ${(props) => (props.noBorder ? 0 : 1)};
    }
  }
  & .multiple .MuiOutlinedInput-root {
    flex-wrap: wrap;
    padding: 0 2.5rem 0 0.375rem;

    input {
      padding: 0.5rem;
    }

    .MuiAutocomplete-endAdornment {
      position: absolute;
      right: 4px;
      top: calc(50% - 14px);
      width: 24px;
      height: 24px;
    }
  }

  & .MuiOutlinedInput-root.dirty,
  & .MuiOutlinedInput-root.Mui-focused,
  & .MuiOutlinedInput-root.dirty .MuiOutlinedInput-notchedOutline,
  & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    opacity: 1;
    border-width: ${(props) => (props.noBorder ? 0 : 1)};
  }
`;

const OptionLabel = styled(Typography)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #273446;
`;

const AutocompleteLoader = styled.div`
  height: 100%;
  padding-left: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NoOptionsText = styled(Typography)`
  display: flex;
  align-items: center;
  & svg {
    margin-right: 0.5rem;
  }
`;

const CloseIcon = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default FormAutocomplete;
