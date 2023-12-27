import React from 'react';
import styled from '@emotion/styled';
import {Box, Button, Grid, GridProps} from '@material-ui/core';
import DynamicFormField from '../../DynamicFormField';
import {IDynamicFormProps} from '../../DynamicForm';
import {useFormContext} from 'react-hook-form';
import {css} from '@emotion/core';
import {getIsDisabled} from '../FormHelper';

// ----------------------------------------------------------------------------
// Props
// ----------------------------------------------------------------------------
export interface IDynamicFormElements extends Omit<IDynamicFormProps, 'methods' | 'onSubmit'> {}

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------
const DynamicFormElements: React.FC<IDynamicFormElements> = ({fields, submitButton, showSubmitButton}: IDynamicFormElements) => {
  const {
    buttonText,
    enabled,
    variant = 'contained',
    color = 'primary',
    size = 'large',
    withBorderTop,
    hide = false,
    sticky = true,
    disabled = false,
    ...other
  } = submitButton || {};
  const {
    formState: {isValid, isDirty, isSubmitting, errors},
  } = useFormContext();
  const addPadding = showSubmitButton && !hide && sticky;

  const isSubmitDisabled = enabled !== undefined ? !enabled : getIsDisabled(isDirty, isValid, isSubmitting, disabled, errors);

  return (
    <DynamicFormElementsWrapper>
      <DynamicFormElementsContainer container direction="column" spacing={2} gutter={addPadding?.toString()}>
        {fields?.map(({isDisabled = false, gutter, ...field}, idX) => (
          <DynamicFormFieldWrapper gutter={gutter} item key={idX.toString()}>
            <DynamicFormField {...field} isDisabled={isDisabled || isSubmitting} />
          </DynamicFormFieldWrapper>
        ))}
      </DynamicFormElementsContainer>
      {showSubmitButton && (
        <DynamicFormElementsFooter hide={hide} withBorderTop={withBorderTop} sticky={sticky} item>
          <Box width={'100%'} textAlign={'center'}>
            <FormButtonStyled type="submit" variant={variant} color={color} size={size} {...other} disabled={isSubmitDisabled}>
              {buttonText}
            </FormButtonStyled>
          </Box>
        </DynamicFormElementsFooter>
      )}
    </DynamicFormElementsWrapper>
  );
};

interface IDynamicFormElementsFooter {
  withBorderTop?: boolean;
  hide?: boolean;
  sticky?: boolean;
}

interface IDynamicFormFieldWrapper extends GridProps {
  gutter?: boolean;
}
interface IDynamicFormElementsContainer extends GridProps {
  gutter?: string;
}

const DynamicFormElementsContainer = styled(Grid)<IDynamicFormElementsContainer>`
  padding-bottom: ${({gutter}) => (gutter === 'true' ? '6rem' : '0')};
`;

const DynamicFormFieldWrapper = styled(Grid)<IDynamicFormFieldWrapper>`
  margin-bottom: ${({gutter}) => (gutter ? '1rem' : '0')};
  max-width: 100%;
`;
const DynamicFormElementsFooter = styled(({hide, sticky, withBorderTop, ...rest}) => <Grid {...rest} />)<IDynamicFormElementsFooter>`
  padding: 1rem 0;
  margin-top: 0.5rem;
  border-top: ${({withBorderTop}) => (withBorderTop ? '0.063rem solid #DBDBDB' : 'none')};
  ${({sticky}) =>
    sticky &&
    css`
      padding: 1rem;
      position: fixed;
      width: 100%;
      left: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      justify-content: end;
      background-color: #fff;
      align-items: center;
    `}

  ${({hide}) =>
    hide &&
    css`
      border-top: 0;
      padding-top: 0;
      margin-top: 0;
      visibility: hidden;
      height: 0;

      & button {
        height: 0;
        padding: 0;
        & span {
          font-size: 0;
        }
      }
    `}
`;

const DynamicFormElementsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
`;
const FormButtonStyled = styled(Button)`
  @media only screen and (min-width: 900px) {
    max-width: 25rem;
  }
`;
export default DynamicFormElements;
