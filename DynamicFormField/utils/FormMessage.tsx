import styled from '@emotion/styled';
import {FormHelperText} from '@material-ui/core';
import React from 'react';
import {IconNames} from '../../../../icons/IconNameConstants';
import {TenantVector} from '../../../../icons/TenantVector/TenantVector.component';

interface IMessageProps {
  message?: React.ReactNode;
  isBold?: boolean;
  isLarge?: boolean;
}

export interface IFormMessageProps extends IMessageProps {
  id?: string;
  Icon?: IconNames;
  component?: React.ElementType;
  margin?: 'dense';
  isError?: boolean;
  hideIcon?: boolean;
}

const FormMessage = ({id = '', Icon, message, component, margin, isBold, isLarge, hideIcon, isError = true}: IFormMessageProps) =>
  message ? (
    <FormHelperText id={id} error={!!isError} component={component || 'div'} margin={margin}>
      <FormMessageWrapper>
        {!hideIcon && (
          <span id={id + '_icon'}>
            <TenantVector tenantVectorName={Icon || (isError ? IconNames.FieldError : IconNames.Info)} />
          </span>
        )}
        <Message id={id + '_message'} isBold={!!isBold} isLarge={!!isLarge}>
          {message}
        </Message>
      </FormMessageWrapper>
    </FormHelperText>
  ) : null;

const FormMessageWrapper = styled.span`
  display: flex;
  flex-direction: row;
  & svg {
    margin-top: 0.2rem;
    margin-right: 0.5rem;
  }
  word-break: break-word;
`;

const Message = styled.span<IMessageProps>`
  font-weight: ${({isBold}) => (isBold ? 'bold' : 400)};
  font-size: ${({isLarge}) => (isLarge ? '1rem' : '0.875rem')};
`;

export default FormMessage;
