// src/components/forms/form-field.tsx
"use client";

import React from 'react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  FormControlProps,
} from '@chakra-ui/react';

interface FormFieldProps extends FormControlProps {
  label: string;
  labelProps?: React.ComponentProps<typeof FormLabel>;
  error?: string | React.ReactNode; // Can be a string or a more complex node
  helperText?: string;
  children: React.ReactNode; // This will typically be the input, select, textarea, etc.
  id?: string; // Should match the id of the input for accessibility
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  labelProps,
  error,
  helperText,
  children,
  id,
  isRequired,
  isInvalid,
  ...rest // Spread remaining FormControlProps
}) => {
  return (
    <FormControl isRequired={isRequired} isInvalid={isInvalid ?? !!error} {...rest}>
      <FormLabel htmlFor={id} {...labelProps}>
        {label}
      </FormLabel>
      {children}
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
      {helperText && !error && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default FormField;