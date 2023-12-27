import React, {ReactNode} from 'react';
import Switch, {SwitchProps} from '@material-ui/core/Switch';
import styled from '@emotion/styled';
import {ITenantTheme} from '../../../../../../models';
import {ControllerRenderProps, FieldValues} from 'react-hook-form';

export interface ISwitchFieldProps extends SwitchProps {
  label?: ReactNode;
  ariaLabel?: string;
  field?: ControllerRenderProps<FieldValues, any>;
  isDirty?: boolean;
  isDisabled?: boolean;
  checked?: boolean;
}

const SwitchField = ({label, checked, field, isDisabled, size, ariaLabel, ...rest}: ISwitchFieldProps) => {
  return (
    <StyledSwitch
      {...rest}
      inputProps={{
        'aria-label': ariaLabel ?? (label && typeof label === 'string' ? label : ''),
        'aria-hidden': isDisabled,
        ...rest.inputProps,
      }}
      checked={checked}
      disabled={isDisabled}
      size={size}
      onChange={(event) => {
        if (field) {
          field?.onChange((event.target as HTMLInputElement).checked);
        } else {
          rest?.onChange && rest.onChange(event, (event.target as HTMLInputElement).checked);
        }
      }}
    />
  );
};

type StyledSwitchCSS = {
  rootWidth?: string;
  rootHeight?: string;
  rootPadding?: string;
  switchOnLabel?: string;
  switchOffLabel?: string;
  theme?: ITenantTheme;
};

const StyledSwitch = styled(Switch)<StyledSwitchCSS>`
  .MuiSwitch-root {
    width: ${(props) => props.rootWidth};
    height: ${(props) => props.rootHeight};
  }
  .MuiSwitch-switchBase {
    color: ${({
      theme: {
        designSystem: {
          organisms: {
            formSwitch: {switchBaseColor = ''},
          },
        },
      },
    }) => switchBaseColor ?? ''};
  }
  .MuiSwitch-colorSecondary.Mui-checked + .MuiSwitch-track {
    background-color: ${({
      theme: {
        designSystem: {
          organisms: {
            formSwitch: {checkedBackgroundColor = ''},
          },
        },
      },
    }) => checkedBackgroundColor ?? ''};
  }
  .MuiSwitch-track {
    background-color: ${({
      theme: {
        designSystem: {
          organisms: {
            formSwitch: {unCheckedBackgroundColor = ''},
          },
        },
      },
    }) => unCheckedBackgroundColor ?? ''};;
    &:before {
      content: '${(props) => props.switchOnLabel}'
    }
    &:after {
      content: '${(props) => props.switchOffLabel}'
    }
  }
  .MuiSwitch-thumb {
    border: ${({
      theme: {
        designSystem: {
          organisms: {
            formSwitch: {unCheckedTrackBorder = ''},
          },
        },
      },
    }) => unCheckedTrackBorder};
  }
  .MuiSwitch-switchBase.Mui-checked .MuiSwitch-thumb {
    border: ${({
      theme: {
        designSystem: {
          organisms: {
            formSwitch: {checkedTrackBorder = ''},
          },
        },
      },
    }) => checkedTrackBorder};
  };
`;

export default SwitchField;
