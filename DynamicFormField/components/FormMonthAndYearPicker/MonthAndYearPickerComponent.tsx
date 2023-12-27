import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Grid} from '@material-ui/core';
import PickerDialog from './PickerDialog';
import PickerList from './PickerList';
import PickerField, {IPickerFieldProps} from './PickerField';
import {IconNames} from '../../../../../icons/IconNameConstants';
import {
  generateYears,
  generateMonths,
  getFormattedMonthAndYear,
  getDateFromMonthAndYear,
  getMonthAndYear,
  IMonthAndYear,
  getMonthNumber,
  getCurrentMonth,
} from '../../../../../../helpers/DateUtils';
import {locators} from '../../../../../../automation/PageLocators';

const {aMonthPickerConfirmButton} = locators.commonLocators;

// ----------------------------------------------------------------------------
// Props
// ----------------------------------------------------------------------------
export type IMonthAndYearPickerComponentProps = IPickerFieldProps & {
  startYear?: number;
  endYear?: number;
  disableFutureDates?: boolean;
};

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------
function useToggle() {
  const [open, setOpen] = useState(false);
  const [touched, setTouched] = useState(false);

  const handleOpen = () => {
    if (!touched) {
      setTouched(true);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return {open, touched, handleOpen, handleClose};
}

const getIsMonthDisabled = (
  month: string,
  year: string | number,
  selectedMonth: string,
  handleMonth: (event: React.MouseEvent<HTMLElement> | undefined, item: string) => void
): boolean => {
  if (year === new Date().getFullYear()) {
    const currentMonthNumber = getCurrentMonth();
    const monthNumber = getMonthNumber(month);
    const selectedMonthNumber = getMonthNumber(selectedMonth);

    if (selectedMonthNumber > currentMonthNumber) {
      handleMonth(undefined, '');
    }

    return monthNumber > currentMonthNumber;
  }
  return false;
};

const renderPickerList = (
  id: string,
  month: string,
  year: number | '',
  months: string[],
  years: number[],
  disableFutureDates: boolean,
  handleMonth: (event: React.MouseEvent<HTMLElement> | undefined, item: string) => void,
  handleYear: (event: React.MouseEvent<HTMLElement> | undefined, item: number) => void
) => (
  <Grid container>
    <Grid item xs={6}>
      <PickerList
        id={id + 'Month'}
        options={months}
        selected={month}
        handleSelected={handleMonth}
        isDisabled={(option: string) => disableFutureDates && getIsMonthDisabled(option, year, month, handleMonth)}
      />
    </Grid>
    <Grid item xs={6}>
      <PickerList
        id={id + 'Year'}
        options={years}
        selected={year}
        handleSelected={handleYear}
        isDisabled={(option: number) => disableFutureDates && option > new Date().getFullYear()}
      />
    </Grid>
  </Grid>
);

const getMonthAndYearFormatted = (value: string) => getMonthAndYear(getDateFromMonthAndYear(value));

function useMonthAndYear(
  selectedValue: any,
  months: string[],
  years: number[],
  disableFutureDates: boolean,
  handleChange: (date: IMonthAndYear) => void,
  id: string
) {
  const {t} = useTranslation(['common']);
  const {open, touched, handleOpen, handleClose} = useToggle();
  const [{month, year} = getMonthAndYearFormatted(selectedValue), setState] = useState<IMonthAndYear>(
    getMonthAndYearFormatted(selectedValue)
  );
  const handleUpdateMonth = (_event: React.MouseEvent<HTMLElement> | undefined, newMonth: string) =>
    setState((preState) => ({...preState, month: newMonth}));

  const handleUpdateYear = (_event: React.MouseEvent<HTMLElement> | undefined, newYear: number) =>
    setState((preState) => ({...preState, year: newYear}));

  const handleUpdateDate = (date: IMonthAndYear) => handleChange(date);

  const renderPickerDialog = () => (
    <PickerDialog
      title={t('monthPicker.title')}
      open={!!open}
      onClose={handleClose}
      confirmIconProps={{
        id: aMonthPickerConfirmButton,
        icon: true,
        text: t('monthPicker.confirm'),
        name: IconNames.ArrowForward,
        disabled: !month || !year,
        onClick: () => {
          handleUpdateDate({month, year});
          handleClose();
        },
        reverse: true,
      }}
    >
      {renderPickerList(id, month, year, months, years, disableFutureDates, handleUpdateMonth, handleUpdateYear)}
    </PickerDialog>
  );

  return {month, year, renderPickerDialog, touched, handleOpen};
}

const MonthAndYearPickerComponent = React.forwardRef<IMonthAndYearPickerComponentProps, any>((props, ref) => {
  const {
    id = '',
    label,
    labelId,
    name,
    placeholder,
    validations,
    isRequired = false,
    isDisabled = false,
    disableFutureDates = true,
    startYear,
    endYear,
    isDirty = false,
    errorMessage = '',
    ...rest
  } = props;
  const handleChange = async (date: IMonthAndYear) => {
    if (props.value !== getFormattedMonthAndYear(date)) {
      props.onChange(getFormattedMonthAndYear(date));
    }
  };

  const {renderPickerDialog, handleOpen} = useMonthAndYear(
    props.value,
    generateMonths(),
    generateYears(startYear, endYear),
    disableFutureDates,
    handleChange,
    id
  );

  return (
    <>
      <PickerField
        {...{
          ...rest,
          inputRef: ref,
          id,
          label,
          labelId,
          name,
          placeholder,
          validations,
          isRequired,
          isDisabled,
          isDirty,
          errorMessage,
          inputProps: {
            'aria-label': label && typeof label === 'string' ? label : placeholder,
            'aria-hidden': isDisabled,
            ...rest.inputProps,
          },
          onClick: () => {
            !isDisabled && handleOpen();
          },
        }}
      />
      {renderPickerDialog()}
    </>
  );
});

export default MonthAndYearPickerComponent;
