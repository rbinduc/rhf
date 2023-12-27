import React, {useRef, useState, CSSProperties, SyntheticEvent} from 'react';
import {createStyles, makeStyles, MenuItem, Select, SelectProps} from '@material-ui/core';
import {ArrowExpand} from '../../../../../icons/global/common/ArrowExpand';
import {useTheme} from 'emotion-theming';
import {ISelectElementPaper, ITenantTheme} from '../../../../../../models';
import {ControllerRenderProps, FieldValues} from 'react-hook-form';
import {baseImageURL} from '../../../../../../helpers/HelperUtils';
import styled from '@emotion/styled';
import {Typography} from '../../../../../atoms/Typography';
import {Keyboard} from '@ionic-native/keyboard';

export interface ISelectOption {
  label: any;
  value: any;
  hasFlag?: boolean;
  max?: number;
  groupBy?: string;
}

export interface ISelectFieldProps extends SelectProps {
  options?: ISelectOption[];
  ariaLabel?: string;
  field?: ControllerRenderProps<FieldValues, any>;
  isDirty?: boolean;
}

interface ISelectFieldCSSProps extends ISelectElementPaper {
  backgroundColor: CSSProperties['backgroundColor'];
}

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      position: 'relative',
    },
    list: {
      padding: 0,
      border: ({border}: ISelectFieldCSSProps) => border,
      boxSizing: 'border-box',
      borderRadius: ({borderRadius}: ISelectFieldCSSProps) => borderRadius,
    },
    rootMenuItem: {
      '&.MuiListItem-root.Mui-selected, .MuiListItem-root.Mui-selected': {
        backgroundColor: ({selectedColor}: ISelectFieldCSSProps) => selectedColor,
        '&:first-of-type': {
          borderRadius: '0.313rem 0.313rem 0 0',
        },
        '&:last-of-type': {
          borderBottom: 'unset',
          borderRadius: '0 0 0.313rem 0.313rem',
        },
        '&.MuiButtonBase-root:active': {
          backgroundColor: ({backgroundColor}: ISelectFieldCSSProps) => backgroundColor,
        },
      },

      borderBottom: ({borderBottom}: ISelectFieldCSSProps) => borderBottom,
    },
    rootSelect: {
      display: 'flex',
      justifyContent: 'flex-start',
      '&.MuiSelect-select:focus': {
        backgroundColor: 'unset',
      },
    },
  })
);

const SelectField = ({
  id,
  label,
  labelId,
  placeholder,
  ariaLabel,
  options,
  required,
  disabled,
  field,
  isDirty,
  ...rest
}: ISelectFieldProps) => {
  const selectFieldref = useRef<HTMLDivElement>(null);
  const theme: ITenantTheme = useTheme();
  const {border, borderRadius, borderBottom, selectedColor}: ISelectElementPaper = theme?.designSystem?.atoms?.formSelectElementPaper ?? {};
  const {backgroundColor} = theme.designSystem.atoms.button.hover;
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    !disabled && setOpen(false);
  };

  const handleOpen = () => {
    if (!disabled) {
      if (selectFieldref?.current && typeof selectFieldref.current.scrollIntoView === 'function') {
        selectFieldref.current.scrollIntoView({block: 'center'});
      }
      if (Keyboard.isVisible) {
        setTimeout(() => {
          setOpen(true);
        }, 600);
      } else {
        setOpen(true);
      }
    }
  };

  const classes = useStyles({border, borderRadius, borderBottom, selectedColor, backgroundColor});
  return !!options?.length ? (
    <div ref={selectFieldref} className={classes.root}>
      <Select
        {...rest}
        {...field}
        labelId={labelId}
        placeholder={placeholder}
        IconComponent={!disabled ? ArrowExpand : () => <span />}
        classes={{root: classes.rootSelect}}
        className={isDirty ? 'dirty' : ''}
        variant="outlined"
        fullWidth
        disabled={disabled}
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
        inputProps={{
          id,
          required,
          disabled,
          readOnly: disabled,
          'aria-label': ariaLabel || (label && typeof label === 'string' ? label : placeholder),
          'aria-hidden': disabled,
          ...rest?.inputProps,
        }}
        MenuProps={{
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
          elevation: 0,
          getContentAnchorEl: null,
          transformOrigin: {
            vertical: 'top',
            horizontal: 'left',
          },
          classes: {list: classes.list},
          transitionDuration: 800,
        }}
      >
        {options?.map(({label: optionLabel, value: optionValue, hasFlag}: ISelectOption) => (
          <MenuItem disabled={!open} button key={optionValue} selected value={optionValue} classes={{root: classes.rootMenuItem}}>
            {hasFlag && (
              <FlagStyled>
                <ImgStyled
                  src={`${baseImageURL}/countries/${optionLabel}.svg`}
                  onError={(event: SyntheticEvent<HTMLImageElement, Event>) => {
                    if ((event?.target as HTMLImageElement)?.src) {
                      (event.target as HTMLImageElement).src = `${baseImageURL}/countries/default.svg`;
                    }
                  }}
                />
              </FlagStyled>
            )}
            <Label variant="h4">{optionLabel}</Label>
          </MenuItem>
        ))}
      </Select>
      {!field?.value && <Placeholder onClick={handleOpen}>{placeholder}</Placeholder>}
    </div>
  ) : null;
};

const FlagStyled = styled.div`
  padding-right: 1.875rem;
  width: 1.5rem;
  height: 1.5rem;
  box-sizing: border-box;
`;

const ImgStyled = styled.img`
  width: 1.25rem;
  border-radius: 50%;
`;

const Label = styled(Typography)`
  margin-top: 0.125rem;
  height: auto;
  overflow: hidden;
  min-height: 1.1876em;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const Placeholder = styled(Typography)`
  position: absolute;
  left: 0;
  right: 0;
  opacity: 0.3;
  padding: 1rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

export default SelectField;
