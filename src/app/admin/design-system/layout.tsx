/*
 FINAL VERSION - Key Changes:
 - This layout has been simplified to be a pass-through for its children.
 - It no longer renders its own SiteHeader or SiteFooter, which resolves the
   duplicate components issue. The page will now correctly inherit the
   header and footer from the main root layout.
*/
import React from 'react';

export default function DesignSystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout only needs to render the page content.
  // The main header and footer will be provided by the root layout.
  return <>{children}</>;
}