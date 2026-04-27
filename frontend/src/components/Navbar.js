import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ adminUser, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1>MovieStore</h1>
        </Link>
        <div className="nav-links">
          {adminUser ? (
            <>
              <span>Admin: {adminUser.username}</span>
              <button className="logout-btn" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <Link to="/login">Admin Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
