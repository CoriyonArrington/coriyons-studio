// src/components/theme-switcher.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  Icon,
  useColorModeValue,
  Text,
} from "@chakra-ui/react";
import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  const menuButtonIconColor = useColorModeValue("gray.700", "gray.300"); // Adjusted for potentially darker header in dark mode
  // Icon color for items within the menu will inherit from MenuList's color (popover.foreground)
  // or can be set explicitly if needed (e.g. useColorModeValue("gray.600", "gray.400"))

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Button variant="ghost" size={"sm"} width="40px" isLoading aria-label="Loading theme switcher" />;
  }

  const ICON_SIZE = "1rem"; 

  let currentIcon;
  if (theme === "light") {
    currentIcon = <Icon as={Sun} boxSize={ICON_SIZE} color={menuButtonIconColor} />;
  } else if (theme === "dark") {
    currentIcon = <Icon as={Moon} boxSize={ICON_SIZE} color={menuButtonIconColor} />;
  } else {
    currentIcon = <Icon as={Laptop} boxSize={ICON_SIZE} color={menuButtonIconColor} />;
  }

  return (
    <Menu strategy="fixed"> 
      <MenuButton
        as={Button}
        variant="ghost"
        size={"sm"}
        aria-label="Switch color theme"
        px={2}
      >
        {currentIcon}
      </MenuButton>
      {/* MenuList bg and color are now controlled by the theme override in src/lib/theme.ts */}
      <MenuList minW="150px"> 
        <MenuOptionGroup
          value={theme}
          title="Theme" // Title color will inherit from MenuList
          type="radio"
          onChange={(value) => {
            if (typeof value === 'string') {
              setTheme(value);
            }
          }}
        >
          <MenuItemOption value="light" display="flex" alignItems="center">
            <Icon as={Sun} boxSize={ICON_SIZE} mr="2" /* color will inherit or use specific if needed */ />
            <Text as="span">Light</Text> {/* Text color should inherit */}
          </MenuItemOption>
          <MenuItemOption value="dark" display="flex" alignItems="center">
            <Icon as={Moon} boxSize={ICON_SIZE} mr="2" />
            <Text as="span">Dark</Text>
          </MenuItemOption>
          <MenuItemOption value="system" display="flex" alignItems="center">
            <Icon as={Laptop} boxSize={ICON_SIZE} mr="2" />
            <Text as="span">System</Text>
          </MenuItemOption>
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
};