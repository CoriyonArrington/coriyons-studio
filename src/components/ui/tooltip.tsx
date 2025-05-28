// src/components/ui/tooltip.tsx
"use client";

import * as React from "react";
import {
  Tooltip as ChakraUITooltip, // Import Chakra's Tooltip with an alias
  TooltipProps as ChakraBaseTooltipProps, // Import Chakra's TooltipProps with an alias
  // Portal, // Import Portal if you need to handle portalRef manually
} from "@chakra-ui/react";

// Your custom TooltipProps interface
export interface TooltipProps extends ChakraBaseTooltipProps {
  /**
   * If true, the tooltip will show an arrow pointer.
   * Maps to `hasArrow` on the Chakra UI Tooltip.
   */
  showArrow?: boolean;
  /**
   * If true, the tooltip will be portalled to the end of the document body.
   * Maps to `usePortal` on the Chakra UI Tooltip.
   */
  portalled?: boolean;
  /**
   * A ref to a DOM element where the tooltip should be appended if `portalled` is true.
   * Note: Chakra UI's Tooltip `usePortal` prop typically appends to a PortalManager or document.body.
   * Directly using portalRef as a container for the Tooltip's portal requires more specific handling,
   * potentially by wrapping the trigger with `<Portal containerRef={portalRef}>`.
   * This prop is kept for interface compatibility but its direct effect on ChakraUITooltip via `usePortal` is limited.
   */
  portalRef?: React.RefObject<HTMLElement>; // Kept for interface, see note above.
  // children and label are part of ChakraBaseTooltipProps
}

/**
 * Custom Tooltip component that wraps Chakra UI's Tooltip.
 * It maps `showArrow` to `hasArrow` and `portalled` to `usePortal`.
 */
export const Tooltip = React.forwardRef<HTMLElement, TooltipProps>(
  (
    {
      children,
      label,
      showArrow,
      portalled,
      portalRef, // This prop is accepted but not directly passed to ChakraUITooltip in a way that sets its container.
      // ChakraUITooltip's `usePortal` handles portalling to its managed container.
      ...rest // Spread the rest of the ChakraBaseTooltipProps
    },
    ref
  ) => {
    if (!label) {
      // Tooltip requires a label to be functional
      return <>{children}</>;
    }

    // If portalRef is provided and portalled is true, you might consider
    // manually using the Portal component around the children if ChakraUITooltip's
    // default portalling doesn't suffice. However, for most cases, usePortal is enough.
    // Example (more complex, if needed):
    // if (portalled && portalRef) {
    //   return (
    //     <>
    //       {children} {/* Trigger */}
    //       <Portal containerRef={portalRef}>
    //         <ChakraUITooltip
    //           ref={ref as React.RefObject<HTMLDivElement>} // Tooltip ref is usually for the trigger, not the tooltip itself
    //           label={label}
    //           hasArrow={showArrow}
    //           // usePortal should be true if we are manually portalling, or let Tooltip handle it.
    //           // This example becomes complex because Tooltip also tries to portal.
    //           {...rest}
    //         >
    //           {/* This structure is not quite right for manual portal + Tooltip's own portal */}
    //           {/* The Tooltip should wrap the trigger, not be in the portal itself usually */}
    //         </ChakraUITooltip>
    //       </Portal>
    //     </>
    //   );
    // }

    return (
      <ChakraUITooltip
        ref={ref as React.RefObject<HTMLDivElement>} // Note: Tooltip ref is typically for internal use or specific scenarios.
                                                     // The trigger usually gets the ref if you are forwarding to it.
                                                     // For a simple wrapper, you might not need to forward ref to ChakraUITooltip itself.
        label={label}
        hasArrow={showArrow}
        usePortal={portalled}
        {...rest}
      >
        {children}
      </ChakraUITooltip>
    );
  }
);

Tooltip.displayName = "Tooltip";