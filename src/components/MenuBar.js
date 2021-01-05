import { useState, useContext } from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/auth';

const MenuBar = () => {
  const pathname = window.location.pathname;
  const path = pathname === '/' ? 'home' : pathname.substr(1);
  const [activeItem, setActiveItem] = useState(path);
  const { user, logout } = useContext(AuthContext);

  const handleClickItem = (e, { name }) => setActiveItem(name);

  const menuBar = user ? (
    <Menu pointing secondary size="massive" color="teal">
      <Menu.Item
        name={user.username}
        active
        onClick={handleClickItem}
        as={Link}
        to="/"
      />
      <Menu.Menu position='right'>
        <Menu.Item
          name='logout'
          onClick={logout}
        />
      </Menu.Menu>
    </Menu>
  ) : (
        <Menu pointing secondary size = "massive" color = "teal">
          <Menu.Item
            name = 'home'
            active = {activeItem === 'home'}
            onClick = { handleClickItem }
            as = { Link }
            to = "/"
              />
        <Menu.Menu position='right'>
          <Menu.Item
            name='login'
            active={activeItem === 'login'}
            onClick={handleClickItem}
            as={Link}
            to="/login"
          />
          <Menu.Item
            name='register'
            active={activeItem === 'register'}
            onClick={handleClickItem}
            as={Link}
            to="/register"
          />
        </Menu.Menu>
      </Menu >
  )

  return menuBar
}

export default MenuBar;