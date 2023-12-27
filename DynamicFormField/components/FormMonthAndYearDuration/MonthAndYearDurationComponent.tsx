import React from 'react';
import styled from '@emotion/styled';
import {Grid, Input, InputLabel} from '@material-ui/core';
import SelectField from '../FormSelect/SelectField';
import {getLabel} from '../../DynamicFormField';
import FormMessage from '../../utils/FormMessage';
import {getNumberFromString} from '../../../../../../helpers/HelperUtils';
import {useTranslation} from 'react-i18next';
import {IFormMonthAndYearDurationProps, IMonthAndYearDuration} from './FormMonthAndYearDuration';

const getOptions = (max: number = 0) => [...Array(max + 1)].map((v, i) => ({label: i, value: i}));

const DEFAULT_MONTH = 0;
const DEFAULT_YEAR = 0;

const useMonthAndYearDuration = (selectedValue: any, maxMonths: number, maxYears: number, handleChange: (date: any) => void) => {
  const {t} = useTranslation(['common']);
  const handleChangeMonth = (event: React.ChangeEvent<{name?: string; value: unknown}>) => {
    const monthValue = event.target.value as string;
    const months = getNumberFromString(monthValue, DEFAULT_MONTH);
    handleChange({...(selectedValue || {}), months});
  };

  const handleChangeYear = (event: React.ChangeEvent<{name?: string; value: unknown}>) => {
    const yearValue = (event.target.value as string) ?? '';
    const years = getNumberFromString(yearValue, DEFAULT_YEAR);

    handleChange({...(selectedValue || {}), years});
  };

  const renderMonthAndYearDuration = (
    id: string,
    isRequired: boolean,
    isDisabled: boolean,
    isDirty: boolean,
    ariaLabelMonth: string,
    ariaLabelYear: string
  ) => (
    <Grid container spacing={3} wrap="nowrap">
      <Grid item xs={6}>
        <InputLabelStyled id={id + '_years'}>{getLabel(t('years'), !!isRequired, true)}</InputLabelStyled>
        <SelectField
          id={id + '_years_select'}
          labelId={id + '_years'}
          ariaLabel={`${ariaLabelYear} ${selectedValue?.years}`}
          options={getOptions(maxYears)}
          value={selectedValue?.years}
          onChange={handleChangeYear}
          required={isRequired}
          disabled={isDisabled}
          isDirty={isDirty}
        />
      </Grid>
      <Grid item xs={6}>
        <InputLabelStyled id={id + '_months'}>{getLabel(t('months'), !!isRequired, true)}</InputLabelStyled>
        <SelectField
          id={id + '_months_select'}
          labelId={id + '_months'}
          ariaLabel={`${ariaLabelMonth} ${selectedValue?.months}`}
          options={getOptions(maxMonths)}
          value={selectedValue?.months}
          onChange={handleChangeMonth}
          required={isRequired}
          disabled={isDisabled}
          isDirty={isDirty}
        />
      </Grid>
    </Grid>
  );

  return {renderMonthAndYearDuration};
};

const MonthAndYearDurationComponent = React.forwardRef<IFormMonthAndYearDurationProps, any>((props, ref) => {
  const {
    id,
    name,
    value,
    label,
    labelId,
    isDisabled,
    isRequired,
    hideAsterisk,
    errorMessage,
    isDirty,
    ariaLabelMonth,
    ariaLabelYear,
    maxMonths,
    maxYears,
    ...rest
  } = props;

  const handleChange = ({months, years}: IMonthAndYearDuration) => {
    if (!isNaN(months) && !isNaN(years)) {
      props.onChange({months, years});
    }
  };

  const {renderMonthAndYearDuration} = useMonthAndYearDuration(value, maxMonths, maxYears, handleChange);

  return (
    <>
      {label && (
        <InputLabel htmlFor={name} className={errorMessage && 'error'} id={labelId}>
          {getLabel(label, !!isRequired, hideAsterisk)}
        </InputLabel>
      )}
      {renderMonthAndYearDuration(id, isRequired, isDisabled, isDirty, ariaLabelMonth, ariaLabelYear)}
      <HiddenInput
        {...rest}
        id={id}
        inputRef={ref}
        type="hidden"
        name={name}
        value={JSON.stringify(value)}
        disabled={isDisabled}
        readOnly={isDisabled}
      />
      <FormMessage id={`${id}_error`} message={errorMessage} />
    </>
  );
});

const HiddenInput = styled(Input)`
  display: none;
`;

const InputLabelStyled = styled(InputLabel)`
  &.MuiFormLabel-root {
    font-size: 0.8rem;
    margin-bottom: 0;
  }
`;

export default MonthAndYearDurationComponent;
