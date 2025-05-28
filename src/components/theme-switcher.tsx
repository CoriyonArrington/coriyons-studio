// src/components/theme-switcher.tsx
"use client";

import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  Icon,
} from "@chakra-ui/react";
import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Button variant="ghost" size={"sm"} width="40px" aria-label="Loading theme switcher" />;
  }

  const ICON_SIZE = "1rem"; 

  let currentIcon;
  if (theme === "light") {
    currentIcon = <Icon as={Sun} boxSize={ICON_SIZE} color="gray.500" />;
  } else if (theme === "dark") {
    currentIcon = <Icon as={Moon} boxSize={ICON_SIZE} color="gray.500" />;
  } else {
    currentIcon = <Icon as={Laptop} boxSize={ICON_SIZE} color="gray.500" />;
  }

  return (
    // Corrected Gstrategy to strategy
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
      <MenuList minW="150px">
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
          <MenuItemOption value="light" display="flex" alignItems="center">
            <Icon as={Sun} boxSize={ICON_SIZE} mr="2" color="gray.500" />
            <span>Light</span>
          </MenuItemOption>
          <MenuItemOption value="dark" display="flex" alignItems="center">
            <Icon as={Moon} boxSize={ICON_SIZE} mr="2" color="gray.500" />
            <span>Dark</span>
          </MenuItemOption>
          <MenuItemOption value="system" display="flex" alignItems="center">
            <Icon as={Laptop} boxSize={ICON_SIZE} mr="2" color="gray.500" />
            <span>System</span>
          </MenuItemOption>
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
};

export { ThemeSwitcher };