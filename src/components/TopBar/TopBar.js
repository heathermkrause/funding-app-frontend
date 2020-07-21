import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { Icon } from '../Icon';
import { logout } from '../../screens/auth/redux/actions';
import { isAdmin } from '../../utils/permission';
import Logo from '../../assets/company-logo.png';
import Avatar from '../../assets/avatar.png';

const TopBar = ({ currentUser }) => {
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
  };
  const { firstName, lastName, role } = currentUser;
  return (
      <Navbar collapseOnSelect expand="lg" style={{ 'backgroundColor': '#151515'}} variant="dark">
      <Navbar.Brand
        as={Link}
        to="/"
        className="d-inline-flex align-items-center"
      >
        <img
          src={Logo}
          width="50"
          height="50"
          className="d-inline-block align-top mr-2"
          alt="React Bootstrap logo"
        />
        Funding App
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          {isAdmin(currentUser) && (
            <>
              <Nav.Link as={Link} to={'/users'}>
                Users
              </Nav.Link>
            </>
          )}
        </Nav>
        <Nav className="flex-item">
          <div className="flex-item">
            <img src={Avatar} alt="" className="avatar"/>
            <Nav.Link as={Link} to="/profile"><span className="capitalize">{firstName} {lastName}</span> {`(${role})`}</Nav.Link>
          </div> 
          {/* <div style={{color: 'white'}}> | </div> */}
          <Nav.Link as={Link} to="/logout" onClick={handleLogout}>
            <Icon name="sign-out" />&nbsp;Logout
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export { TopBar };
