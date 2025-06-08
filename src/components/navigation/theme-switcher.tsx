/*
 FINAL VERSION - Key Changes:
 - Added the `sx` prop directly to the MenuList and MenuItemOption components.
 - This applies the theme tokens with the highest priority to override any conflicting
   default styles, definitively fixing the theming issue.
*/
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

  const menuButtonIconColor = useColorModeValue("gray.700", "gray.300");
  const menuListBg = useColorModeValue('popover.DEFAULT', 'card.DEFAULT');
  const hoverBg = useColorModeValue('blackAlpha.50', 'whiteAlpha.50');
  const checkedBg = useColorModeValue('primary.50', 'green.900');

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
      <MenuList
        minW="150px"
        sx={{
          bg: menuListBg,
          color: 'popover.foreground',
          borderWidth: '1px',
          borderColor: 'border',
          shadow: 'lg',
        }}
      >
        <MenuOptionGroup
          value={theme}
          title="Theme"
          type="radio"
          onChange={(value) => {
            if (typeof value === 'string') {
              setTheme(value);
            }
          }}
        >
          <MenuItemOption 
            value="light" 
            display="flex" 
            alignItems="center"
            sx={{ _hover: { bg: hoverBg }, _focus: { bg: hoverBg }, _checked: { bg: checkedBg, '.chakra-menu__icon-wrapper': { color: 'primary.500' } } }}
          >
            <Icon as={Sun} boxSize={ICON_SIZE} mr="2" />
            <Text as="span">Light</Text>
          </MenuItemOption>
          <MenuItemOption 
            value="dark" 
            display="flex" 
            alignItems="center"
            sx={{ _hover: { bg: hoverBg }, _focus: { bg: hoverBg }, _checked: { bg: checkedBg, '.chakra-menu__icon-wrapper': { color: 'primary.500' } } }}
          >
            <Icon as={Moon} boxSize={ICON_SIZE} mr="2" />
            <Text as="span">Dark</Text>
          </MenuItemOption>
          <MenuItemOption 
            value="system" 
            display="flex" 
            alignItems="center"
            sx={{ _hover: { bg: hoverBg }, _focus: { bg: hoverBg }, _checked: { bg: checkedBg, '.chakra-menu__icon-wrapper': { color: 'primary.500' } } }}
          >
            <Icon as={Laptop} boxSize={ICON_SIZE} mr="2" />
            <Text as="span">System</Text>
          </MenuItemOption>
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
};