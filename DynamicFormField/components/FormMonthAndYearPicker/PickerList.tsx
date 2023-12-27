import React from 'react';
import styled from '@emotion/styled';
import {MenuList, MenuItem} from '@material-ui/core';
import {Typography} from '../../../../../atoms/Typography';

// ----------------------------------------------------------------------------
// Props
// ----------------------------------------------------------------------------
interface IPickerListProps<V = any> {
  id?: string;
  options: V[];
  selected: V;
  isDisabled?: (option: any) => boolean;
  handleSelected: (event: React.MouseEvent<HTMLElement>, option: V) => void;
}

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------
const PickerList: React.FC<IPickerListProps> = ({id = '', options = [], selected, isDisabled, handleSelected}: IPickerListProps) => (
  <MenuListStyled>
    {options?.map((option) => (
      <MenuItemStyled
        ref={(ref: any) => {
          if (ref && option === selected) {
            ref?.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'center'});
          }
        }}
        id={`${id}_${option}`}
        key={option}
        disabled={isDisabled && isDisabled(option)}
        selected={option === selected}
        onClick={(event) => handleSelected(event, option)}
        disableRipple
        autoFocus={option === selected}
      >
        <Typography variant="body2">{option}</Typography>
      </MenuItemStyled>
    ))}
  </MenuListStyled>
);

// ----------------------------------------------------------------------------
// Styles
// ----------------------------------------------------------------------------
const MenuListStyled = styled(MenuList)`
  height: 300px;
  overflow-y: auto;
  display: block;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  outline: none;
`;

const MenuItemStyled = styled(MenuItem)`
  height: 56px;
  display: flex;
  justify-content: center;
  text-transform: capitalize;
  outline: none;
  &:hover {
    background-color: transparent;
  }
  &.MuiListItem-root.Mui-focusVisible {
    background-color: transparent;
  }
  &.Mui-selected {
    background-color: transparent !important;
  }
  &.Mui-selected p {
    color: #273446;
    font-weight: 700;
    font-size: 21px;
  }
`;

export default PickerList;
