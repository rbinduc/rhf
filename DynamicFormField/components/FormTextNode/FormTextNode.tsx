import {Typography} from '@material-ui/core';
import React from 'react';
export interface IFormTextNodeProps {
  label: React.ReactNode;
}

const FormTextNode: React.FC<IFormTextNodeProps> = ({label, ...other}) => {
  return <Typography variant="subtitle2">{label}</Typography>;
};

export default FormTextNode;
