import React from "react";
import "./dashboardMain.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MenuIcon from '@mui/icons-material/Menu';

function dashboardMainComp() {
  return (
    <div>
      <div className="main-container">
        <div className="dashboardMain">
          <div className="logo-container main-navbar">
            <h2>AuroLocker</h2>
          </div>

          <div className="account-container main-navbar">
            <a href="#">
              <h5>profile</h5>
            </a>

            <a href="#">
              <h5>log-out</h5>
            </a>

            <a href="#" className="admin-profile-dash">
              <MenuIcon 
              fontSize="medium" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default dashboardMainComp;
