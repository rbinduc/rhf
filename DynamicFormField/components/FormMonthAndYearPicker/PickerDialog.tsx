import React from 'react';
import styled from '@emotion/styled';
import {Dialog, DialogActions, DialogContent} from '@material-ui/core';
import {Typography} from '../../../../../atoms/Typography';
import {renderIcon, RenderIconProps} from '../../../../Header/headerHooks';
import {locators} from '../../../../../../automation/PageLocators';

const {aMonthPickerTitleLabel} = locators.commonLocators;

// ----------------------------------------------------------------------------
// Props
// ----------------------------------------------------------------------------
interface IPickerDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  confirmIconProps: RenderIconProps;
  children: React.ReactNode;
}

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------
const PickerDialog = ({open, onClose, title, confirmIconProps, children}: IPickerDialogProps) => (
  <Container open={open} onClose={onClose}>
    <Header>
      <Title variant="h1" id={aMonthPickerTitleLabel}>
        {title}
      </Title>
    </Header>
    <Content>{children}</Content>
    <Footer>{renderIcon(confirmIconProps)}</Footer>
  </Container>
);

// ----------------------------------------------------------------------------
// Styles
// ----------------------------------------------------------------------------
const Container = styled(Dialog)`
  & .MuiDialog-paper {
    width: 20rem;
    border-radius: 10px;
  }
`;

const Title = styled(Typography)`
  font-weight: 600;
  font-size: 1.2rem;
  @media (min-width: 360px) {
    font-size: 1.4rem;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  height: 75px;
  padding: 8px 24px;
  color: #fff;
  background: linear-gradient(103.18deg, #da291c 0%, #bf0d3e 100%);
`;

const Content = styled(DialogContent)`
  overflow: hidden;
  height: 100%;
`;

const Footer = styled(DialogActions)`
  height: 56px;
  border-top: 1px solid #c7ced6;
  display: flex;
  flex-direction: row;
  padding: 8px 24px;
`;

export default PickerDialog;
