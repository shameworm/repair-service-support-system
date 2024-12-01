import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';

import { AuthContext } from '../../context/auth-context';
import './NavLinks.css';

const NavLinks = props => {
  const auth = useContext(AuthContext);

  return (
    <ul className="nav-links">
      {auth.isLoggedIn && (
        <>
          <li>
            <NavLink to="/technicians" exact>
              Техніки
            </NavLink>
          </li>
          <li>
            <NavLink to="/equipments" exact>
              Обладнання
            </NavLink>
          </li>
          <li>
            <NavLink to="/maintance" exact>
              Обслуговування
            </NavLink>
          </li>
          <li>
            <NavLink to="/reports" exact>
              Звіти
            </NavLink>
          </li>
          <li>
            <NavLink to="/inventory" exact>
              Інвентаризація
            </NavLink>
          </li>
        </>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">Увійти</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout}>Вийти</button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
