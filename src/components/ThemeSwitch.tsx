import React from 'react';
import { 
  MenuToggle, 
  Menu, 
  MenuList, 
  MenuItem, 
  Popper 
} from '@patternfly/react-core';
import { MoonIcon, SunIcon, DesktopIcon } from '@patternfly/react-icons';
import { useTheme } from '../contexts/ThemeContext';

const ThemeSwitch: React.FC = () => {
  const { theme, setTheme, isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);
  const toggleRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const handleMenuKeys = React.useCallback((event: KeyboardEvent) => {
    if (isOpen && event.key === 'Escape') {
      setIsOpen(false);
      toggleRef.current?.focus();
    }
  }, [isOpen]);

  const handleClickOutside = React.useCallback((event: MouseEvent) => {
    if (isOpen && !menuRef.current?.contains(event.target as Node) && 
        !toggleRef.current?.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }, [isOpen]);

  React.useEffect(() => {
    window.addEventListener('keydown', handleMenuKeys);
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleMenuKeys);
      window.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen, handleMenuKeys, handleClickOutside]);

  const toggle = (
    <MenuToggle
      ref={toggleRef}
      onClick={() => setIsOpen(!isOpen)}
      isExpanded={isOpen}
      variant="plain"
      aria-label="Theme selector"
    >
      {isDarkMode ? <MoonIcon /> : <SunIcon />}
    </MenuToggle>
  );

  const menu = (
    <Menu ref={menuRef} onSelect={() => setIsOpen(false)}>
      <MenuList>
        <MenuItem
          onClick={() => setTheme('light')}
          isSelected={theme === 'light'}
          icon={<SunIcon />}
        >
          Light
        </MenuItem>
        <MenuItem
          onClick={() => setTheme('dark')}
          isSelected={theme === 'dark'}
          icon={<MoonIcon />}
        >
          Dark
        </MenuItem>
        <MenuItem
          onClick={() => setTheme('system')}
          isSelected={theme === 'system'}
          icon={<DesktopIcon />}
        >
          System
        </MenuItem>
      </MenuList>
    </Menu>
  );

  return (
    <Popper
      trigger={toggle}
      popper={menu}
      isVisible={isOpen}
      position="end"
    />
  );
};

export default ThemeSwitch;