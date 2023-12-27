import React from 'react';
import styled from '@emotion/styled';
import {Grid, InputLabel, Input} from '@material-ui/core';
import ReactHtmlParser from 'react-html-parser';
import {getLabel, IDynamicFormFieldProps} from '../../DynamicFormField';
import {Typography} from '../../../../../atoms/Typography';
import FormMessage from '../../utils/FormMessage';
import SelectField, {ISelectOption} from '../FormSelect/SelectField';
import {IconNames} from '../../../../../icons/IconNameConstants';
import {getDurationDate} from '../../../../../../helpers/DateUtils';
import {getNumberFromString} from '../../../../../../helpers/HelperUtils';

interface ICalendarDuration {
  number: number;
  name: string;
}

export interface IFormCalendarDurationProps extends Omit<IDynamicFormFieldProps, 'inputType'> {
  infoLabel: string;
  validityLabel: string;
  isDirty?: boolean;
  errorMessage?: string;
  ariaLabelCalendarNumber?: string;
  ariaLabelCalendarName?: string;
}

export const DEFAULT_MAX_NUMBER = 1;

const getNumbers = (value: number | string) => {
  const keys = Array.from(Array(getNumberFromString(value as string, DEFAULT_MAX_NUMBER)).keys()) ?? [];
  return keys.map((key) => ({label: key + 1, value: key + 1}));
};

const getNames = (options: ISelectOption[]): ISelectOption[] => options;

const getMaxNumberOption = (options: ISelectOption[], name: string): number =>
  options?.find((option: any) => option?.value === name)?.max ?? DEFAULT_MAX_NUMBER;

const useCalendarDuration = (selectedValue: any, options: ISelectOption[], handleChange: (date: any) => void) => {
  const handleChangeNumber = (event: React.ChangeEvent<{name?: string; value: unknown}>) => {
    const numberValue = event.target.value as string;
    const number = getNumberFromString(numberValue, DEFAULT_MAX_NUMBER);

    handleChange({...(selectedValue || {}), number});
  };

  const handleChangeName = (event: React.ChangeEvent<{name?: string; value: unknown}>) => {
    const name = (event.target.value as string) ?? '';

    handleChange({number: 1, name});
  };

  const renderCaledarDates = (
    isRequired: boolean,
    isDisabled: boolean,
    isDirty: boolean,
    id: string,
    ariaLabelCalendarNumber: string,
    ariaLabelCalendarName: string
  ) => (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <SelectField
          id={id + '_number'}
          required={isRequired}
          disabled={isDisabled}
          value={selectedValue?.number}
          onChange={handleChangeNumber}
          options={getNumbers(getMaxNumberOption(options, selectedValue?.name))}
          ariaLabel={`${ariaLabelCalendarNumber} ${selectedValue?.name}`}
          isDirty={isDirty}
        />
      </Grid>
      <Grid item xs={9}>
        <SelectField
          id={id + '_name'}
          disabled={isDisabled}
          value={selectedValue?.name}
          onChange={handleChangeName}
          options={getNames(options)}
          ariaLabel={ariaLabelCalendarName}
          isDirty={isDirty}
        />
      </Grid>
    </Grid>
  );

  return {renderCaledarDates};
};

const FormCalendarDurationComponent = React.forwardRef<IFormCalendarDurationProps, any>((props, ref) => {
  const {
    id = '',
    label,
    labelId,
    title,
    name: inputName,
    infoLabel,
    validityLabel,
    isRequired = false,
    isDisabled = false,
    isDirty = false,
    hideAsterisk = false,
    errorMessage = '',
    options,
    value,
    startDate,
    ariaLabelCalendarNumber,
    ariaLabelCalendarName,
    ...rest
  } = props;

  const handleChange = ({name, number}: ICalendarDuration) => {
    if (name && number) {
      props.onChange({name, number});
    }
  };

  const {renderCaledarDates} = useCalendarDuration(value, options, handleChange);

  return (
    <>
      <Divider />
      <>
        {title && (
          <Title variant="subtitle2" id={`${id}_title`}>
            {title}
          </Title>
        )}
        {label && (
          <InputLabel htmlFor={inputName} className={errorMessage && 'error'} id={labelId}>
            {getLabel(label, !!isRequired, hideAsterisk)}
          </InputLabel>
        )}
        {renderCaledarDates(isRequired, isDisabled, isDirty, id, ariaLabelCalendarNumber, ariaLabelCalendarName)}
        <HiddenInput
          id={id}
          inputRef={ref}
          type="hidden"
          name={inputName}
          value={JSON.stringify(value)}
          disabled={isDisabled}
          readOnly={isDisabled}
          {...rest}
        />
        <FormMessage id={`${id}_info_label`} message={infoLabel} isLarge isError={false} />
        <FormMessage id={`${id}_error`} message={errorMessage} />
      </>
      <Divider />
      <FormMessage id={`${id}_validity_label`} message={ReactHtmlParser(validityLabel)} isLarge isError={false} hideIcon />
      <FormMessage id={`${id}_date`} message={getDurationDate(value, startDate)} Icon={IconNames.Event} isLarge isBold isError={false} />
    </>
  );
});

const Title = styled(Typography)`
  margin-bottom: 1.5rem;
`;

const Divider = styled.div`
  margin: 0.5rem 0 1.5rem 0;
  border-bottom: 1px solid #c7ced6;
`;

const HiddenInput = styled(Input)`
  display: none;
`;

export default FormCalendarDurationComponent;
