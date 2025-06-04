// src/components/forms/form.tsx
"use client";

import React from 'react';
import { chakra, HTMLChakraProps } from '@chakra-ui/react';

interface FormProps extends HTMLChakraProps<'form'> {
  children: React.ReactNode;
}

// Use React.forwardRef to correctly pass the ref
const Form = React.forwardRef<HTMLFormElement, FormProps>(({ children, ...rest }, ref) => {
  return (
    <chakra.form ref={ref} {...rest}>
      {children}
    </chakra.form>
  );
});

Form.displayName = 'Form'; // Good practice for components created with forwardRef

export default Form;