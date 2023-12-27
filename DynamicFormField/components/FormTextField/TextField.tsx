import React from 'react';
import {TextField as MuiTextField, TextFieldProps} from '@material-ui/core';

const TextField = React.forwardRef<TextFieldProps, any>((props, ref) => {
  return (
    <MuiTextField
      variant="outlined"
      InputLabelProps={{
        disableAnimation: true,
        shrink: false,
      }}
      inputRef={ref}
      {...props}
    />
  );
});

export default TextField;
