import React, { useEffect } from 'react'
import "./navbar.css"
import { useAuth } from '../utils/Auth';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {

  const Auth = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!Auth.user) {
      Auth.logoutHandler();
    }

  }, []);

  const navigateToHomepage = () => {
    navigate("/")
  }

  return (
    <div className='side-nav-header'>
        <div className="side-nav-head-container">
            <div className="side-nav-rightContent">
                <h2 onClick={() => navigateToHomepage()}>Home</h2>
            </div>
            <div className="side-nav-leftContent">
                <h6>{Auth.user}</h6>
                <h6>logout</h6>
            </div>
        </div>
    </div>
  )
}

export default Navbar