import { jsx, css } from '@emotion/react';
import React, { useContext, useCallback, useState } from 'react';

import * as styles from './styles';
import { Button } from '../Button';
import UserContext from '../../dataManagement/UserProvider/UserContext';
import { Input } from '../Input/Input';
import { FormattedMessage, useIntl } from 'react-intl';
import { Menu, MenuAction } from '../Menu';
import { DialogContent, Modal } from '../Modal/Modal';

// login component
export function Login({ onSuccessfulLogin = () => { } }) {
  const intl = useIntl();
  const { user, login, logout } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [invalid, setInvalid] = useState(false);

  const usernamePlaceholder = intl.formatMessage({ id: 'profile.username', defaultMessage: 'Username' });
  const passwordPlaceholder = intl.formatMessage({ id: 'profile.password', defaultMessage: 'Password' });

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    login({ username, password }).
      then(() => {
        onSuccessfulLogin();
        setInvalid(false);
        setPassword('');
      }).catch(err => {
        setInvalid(true);
        console.log('error logging in', err);
      });
  }, [onSuccessfulLogin, password, username])

  return <div>
    <form onSubmit={handleSubmit} css={styles.loginForm}>
      <div css={styles.loginFormRow}>
        <label htmlFor="username" style={{ display: 'none' }}>Username</label>
        <Input placeholder={usernamePlaceholder} type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
      </div>
      <div css={styles.loginFormRow}>
        <label htmlFor="password" style={{ display: 'none' }}>Password</label>
        <Input id="password" type="password" placeholder={passwordPlaceholder} value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      {invalid && (
        <div css={styles.loginFormRow} style={{ color: 'tomato' }}>
          <FormattedMessage id="invalid.credentials" defaultMessage="Invalid username or password" />
        </div>
      )}
      <div css={styles.loginFormRow}>
        <Button look="primary" type="submit">Login</Button>
      </div>
    </form>
  </div>
}

export function LoginButton(props) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useContext(UserContext);
  
  if (user) {
    return <Menu
      style={{ display: 'inline-block' }}
      aria-label="User menu"
      trigger={<Button {...props} className="gbif-button-logout" look="primaryOutline">{user.userName}</Button>}
      items={menuState => [
        <MenuAction onClick={e => { logout(); menuState.hide(); }}>
          <FormattedMessage id="profile.logout" defaultMessage="Logout" />
        </MenuAction>
      ]}
    />
  }

  return <Modal open={open} onClose={() => setOpen(false)} disclosure={<Button {...props} className="gbif-button-login" onClick={() => setOpen(!open)}>Login</Button>}>
    <DialogContent open={open} onCancel={() => setOpen(false)} title={<FormattedMessage id="profile.login" defaultMessage="Login" />} style={{ minWidth: 400 }}>
      <Login onSuccessfulLogin={() => setOpen(false)} />
    </DialogContent>
  </Modal>
}