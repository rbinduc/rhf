import React, {useState} from 'react';
import FormAutocomplete, {IFormAutocompleteProps} from '../FormAutocomplete';
import {ISelectOption} from '../FormSelect';

export type IFormAsyncAutocompleteProps<T extends Record<string, any>> = IFormAutocompleteProps<T> & {
  asyncFunction: (containsStr: string) => Promise<any[]>;
};

const MIN_AUTO_FILL_LENGTH = 3;

const isValidInput = (value: string) => value?.length >= MIN_AUTO_FILL_LENGTH;

const getUniqueOptions = (options: ISelectOption[] = []) => {
  const seen = new Set();
  return options?.filter(({value}) => {
    const duplicate = seen.has(value);
    seen.add(value);
    return !duplicate;
  });
};

const FormAsyncAutocomplete = (props: IFormAsyncAutocompleteProps<Record<string, any>>) => {
  const {asyncFunction, noOptionsText, ...rest} = props ?? {};
  const [value, setValue] = useState<string | null>(null);
  const [options, setOptions] = useState<ISelectOption[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>('');

  if (typeof asyncFunction !== 'function') {
    return null;
  }

  return (
    <FormAutocomplete
      {...rest}
      loading={isLoading}
      value={!!options?.length ? value : ''}
      noOptionsText={!isLoading && isValidInput(inputValue) && !options?.length ? noOptionsText : ''}
      options={isValidInput(inputValue) ? options : []}
      freeSoloTextInput={false}
      onKeyDown={(e: any) => {
        if (e.keyCode === 13 && !options?.length) {
          e.preventDefault();
        }
      }}
      onChangeExtra={(event: any, newValue: any) => {
        const newOptions = newValue ? [newValue, ...options] : options;
        setOptions(getUniqueOptions(newOptions));
        setValue(newValue as string);
      }}
      onInputChange={async (event: any, newInputValue: string) => {
        setInputValue(newInputValue);
        if (isValidInput(newInputValue)) {
          setIsLoading(true);
          const options = await asyncFunction(newInputValue);
          setIsLoading(false);
          setOptions(getUniqueOptions(options));
        }
      }}
    />
  );
};

export default FormAsyncAutocomplete;
