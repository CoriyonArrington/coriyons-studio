// src/components/submit-button.tsx
"use client";

import { Button, ButtonProps } from "@chakra-ui/react"; // Use Chakra UI Button
import { useFormStatus } from "react-dom";
// Removed: import { type ComponentProps } from "react"; // Not needed if extending ButtonProps from Chakra

// Extend Chakra's ButtonProps
type Props = ButtonProps & {
  pendingText?: string;
};

export function SubmitButton({
  children,
  pendingText = "Submitting...",
  ...props // These are Chakra ButtonProps
}: Props) {
  const { pending } = useFormStatus(); // 'data' has been removed

  return (
    <Button
      type="submit"
      aria-disabled={pending}
      isLoading={pending} // Use Chakra's isLoading prop
      loadingText={pendingText} // Chakra's prop for text during loading
      {...props}
    >
      {/* Children are automatically handled by Button when not isLoading */}
      {!pending && children}
    </Button>
  );
}