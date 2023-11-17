'use client';
import React from 'react';
import 'react-toastify/dist/ReactToastify.css';
import {
  Navbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/react';
import { Link } from '@nextui-org/link';
import { Spacer } from '@nextui-org/spacer';
import { useTranslation } from 'react-i18next';
import { Image } from '@nextui-org/image';
import { BiChip, BiCog, BiDetail, BiHome } from 'react-icons/bi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './Login';
import { useTheme } from 'next-themes';
import { ThemeSwitch } from './ThemeSwitch';
import { LanguageSwitch } from './LanguageSwitch';
import { useAuth } from '../lib/useAuth';

/**
 * Renders a navigation bar with menu items and buttons.
 * @returns {JSX.Element} The rendered navigation bar.
 */
export const NavigationBar = () => {
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  return (
    <Navbar
      id="main_header"
      isBordered={theme === 'dark'}
      variant="sticky"
      css={{
        $$navbarBackgroundColor: 'transparent',
        $$navbarBlurBackgroundColor: 'transparent',
      }}
    >
      <NavbarBrand className="block">
        <Dropdown aria-label="main_dropdown">
          <DropdownTrigger>
            <Image
              src="/favicon.png"
              alt="brand"
              isZoomed
              width={64}
              height={64}
            />
          </DropdownTrigger>
          <DropdownMenu
            className="sm:block md:block lg:hidden font-bold text-inherit"
            aria-label="main_dropdown_menu"
            disallowEmptySelection
            selectionMode="single"
          >
            <DropdownItem>
              <Link href="/" underline="active">
                <BiHome size="2em" /> {t('header.home')}
              </Link>
            </DropdownItem>
            <DropdownItem>
              <Link href="/ai" underline="active">
                <BiChip size="2em" /> {t('header.ai')}
              </Link>
            </DropdownItem>
            {isAuthenticated() && (
              <DropdownItem>
                <Link href="/settings" underline="active">
                  <BiCog size="2em" /> {t('header.settings')}
                </Link>
              </DropdownItem>
            )}
            <DropdownItem>
              <Link href="/about" underline="active">
                <BiDetail size="2em" /> {t('header.about')}
              </Link>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarBrand>
      <NavbarContent className="font-bold text-inherit text-primary">
        <NavbarItem className="hidden lg:block ">
          <Link href="/">
            <BiHome size="2em" /> {t('header.home')}
          </Link>
        </NavbarItem>
        <NavbarItem className="hidden lg:block">
          <Link href="/ai" underline="active">
            <BiChip size="2em" /> {t('header.ai')}
          </Link>
        </NavbarItem>
        {isAuthenticated() && (
          <NavbarItem className="hidden lg:block">
            <Link href="/settings" underline="active">
              <BiCog size="2em" /> {t('header.settings')}
            </Link>
          </NavbarItem>
        )}
        <NavbarItem className="hidden lg:block">
          <Link href="/about" underline="active">
            <BiDetail size="2em" /> {t('header.about')}
          </Link>
        </NavbarItem>

        <Spacer x={2} className="sm:hidden lg:flex" />
        <NavbarItem className="hidden lg:block">
          <Login />
        </NavbarItem>
        <NavbarItem className=" lg:block">
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="lg:block">
          <LanguageSwitch />
        </NavbarItem>
        <ToastContainer
          position={toast.POSITION.TOP_CENTER}
          autoClose={5000}
          limit={3}
          pauseOnHover
          closeOnClick
          theme={theme === 'dark' ? 'dark' : 'light'}
          draggable
        />
      </NavbarContent>
    </Navbar>
  );
};
