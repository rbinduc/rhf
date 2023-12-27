import React from 'react';
import {Popper, PopperProps} from '@material-ui/core';

export const CustomPopper = ({placement = 'bottom', ...rest}: PopperProps) => <Popper {...rest} placement={placement} />;
