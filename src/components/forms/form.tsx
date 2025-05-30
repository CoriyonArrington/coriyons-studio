// src/components/forms/form.tsx
"use client";

import React from 'react';
// 'Box' import removed from here
import { chakra, HTMLChakraProps } from '@chakra-ui/react';

interface FormProps extends HTMLChakraProps<'form'> {
  children: React.ReactNode;
  // onSubmit is already correctly typed in HTMLChakraProps<'form'>
}

const Form: React.FC<FormProps> = ({ children, ...rest }) => {
  return (
    <chakra.form {...rest}>
      {children}
    </chakra.form>
  );
};

export default Form;