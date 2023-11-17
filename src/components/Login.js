import {
  Avatar,
  Button,
  Dropdown,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Tooltip,
  ModalFooter,
  useDisclosure,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BiHide, BiShow, BiUser } from 'react-icons/bi';
import { useAuth } from '../lib/useAuth';
import { useTheme } from 'next-themes';

const Login = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { user, login, logout } = useAuth();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isVisible, setIsVisible] = useState(false);
  const { theme } = useTheme();

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <>
      {!user?.name && (
        <>
          <Tooltip content={t('header.login')}>
            <Button
              aria-label="login"
              className="bg-transparent  text-primary "
              auto
              shadow
              onPress={onOpen}
            >
              <BiUser size="2em" />
            </Button>
          </Tooltip>
          <Modal
            size="xl"
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="top-center"
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    {t('header.login_promote')}
                  </ModalHeader>
                  <ModalBody>
                    <Input
                      size="lg"
                      autoFocus
                      endContent={
                        <BiUser className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                      }
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      label={t('header.login_username')}
                      placeholder={t('header.login_username_placeholder')}
                      variant="bordered"
                    />
                    <Input
                      size="lg"
                      endContent={
                        <button
                          className="focus:outline-none"
                          type="button"
                          onClick={toggleVisibility}
                        >
                          {isVisible ? (
                            <BiHide className="text-2xl text-default-400 pointer-events-none" />
                          ) : (
                            <BiShow className="text-2xl text-default-400 pointer-events-none" />
                          )}
                        </button>
                      }
                      type={isVisible ? 'text' : 'password'}
                      label={t('header.login_token')}
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      placeholder={t('header.login_token_placeholder')}
                      variant="bordered"
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="flat" onPress={onClose}>
                      {t('header.close')}
                    </Button>
                    <Button
                      color="primary"
                      onPress={() => login(username, password)}
                    >
                      {t('header.login')}
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </>
      )}
      {user?.avatar_url
        ? user && (
            <Dropdown placement="bottom-left">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  showFallback
                  fallback={<BiUser />}
                  alt={user.name}
                  text={user.name}
                  src={user.avatar_url}
                />
              </DropdownTrigger>
              <DropdownMenu
                theme={theme === 'dark' ? 'dark' : 'light'}
                aria-label="Avatar Actions"
              >
                <DropdownItem key="email">
                  <p color="inherit">{user.email}</p>
                </DropdownItem>

                <DropdownItem
                  key="logout"
                  onClick={logout}
                  withDivider
                  color="error"
                >
                  {t('header.logout')}
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )
        : user && <p href="#"> {user.name} </p>}
    </>
  );
};

export default Login;
