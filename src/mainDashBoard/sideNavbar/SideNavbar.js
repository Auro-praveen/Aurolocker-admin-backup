import "./sideNavbar.css";
import "../dashboardMain/dashboardMain.css";
import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/Auth";
import { IoMdCloseCircle } from "react-icons/io";
import { BsExclamationTriangle } from "react-icons/bs";
import { GiConfirmed } from "react-icons/gi";
import PathUrl from "../../GlobalVariable/urlPath.json";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useLogDetails } from "../../utils/UserLogDetails";

function SideNavbarComp(props) {
  const Auth = useAuth();
  const navigate = useNavigate();
  const userPermissions = props.userPermissions;
  const [hideWindow, setHideWindow] = useState("hide-window");
  const [changePass, setChangePass] = useState({
    userName: Auth.user,
    currentPwd: "",
    newPwd: "",
    confirmPwd: "",
  });


  const [serverPaths, setServePaths] = useState({
    serverUrl: Auth.accessAppType === "TEMPLE-LOCKERS" ? PathUrl.templeServerUrl : Auth.accessAppType === "STATION-LOCKERS" ? PathUrl.stationServerUrl : PathUrl.serverUrl,
    localAdminPath: Auth.accessAppType === "TEMPLE-LOCKERS" ? PathUrl.templeLocalServerPath : Auth.accessAppType === "STATION-LOCKERS" ? PathUrl.stationLocalServerPath : PathUrl.localServerPath
  })

  useEffect(() => {
    setServePaths({
      serverUrl: Auth.accessAppType === "TEMPLE-LOCKERS" ? PathUrl.templeServerUrl : Auth.accessAppType === "STATION-LOCKERS" ? PathUrl.stationServerUrl : PathUrl.serverUrl,
      localAdminPath: Auth.accessAppType === "TEMPLE-LOCKERS" ? PathUrl.templeLocalServerPath : Auth.accessAppType === "STATION-LOCKERS" ? PathUrl.stationLocalServerPath : PathUrl.localServerPath
    })
  }, [Auth.accessAppType])

  const [menuIconClick, setMenuIconClick] = useState(false);
  const useLogs = useLogDetails();

  let changeDisplayStatus = () => {
    let sideNavId = document.getElementById("rightNavbarId");
    const mediaWidth = window.matchMedia("(min-width: 600px)");
    const matchTabWidth = window.matchMedia(
      "(min-width: 600px) and (max-width: 900px)"
    );

    if (matchTabWidth.matches) {
      if (sideNavId.style.marginLeft === "64%") {
        // sideNavId.style.display = 'none'
        sideNavId.style.marginLeft = "130%";
        setMenuIconClick(false);
      } else {
        // sideNavId.style.display = 'block';
        sideNavId.style.marginLeft = "64%";
        setMenuIconClick(true);
      }
    } else if (mediaWidth.matches) {
      console.log(mediaWidth.matches);
      if (sideNavId.style.marginLeft === "78%") {
        // sideNavId.style.display = 'none'
        sideNavId.style.marginLeft = "120%";
        setMenuIconClick(false);
      } else {
        // sideNavId.style.display = 'block';
        sideNavId.style.marginLeft = "78%";
        setMenuIconClick(true);
      }
    } else {
      if (sideNavId.style.marginLeft === "48%") {
        // sideNavId.style.display = 'none'
        sideNavId.style.marginLeft = "140%";
        setMenuIconClick(false);
      } else {
        // sideNavId.style.display = 'block';
        sideNavId.style.marginLeft = "48%";
        setMenuIconClick(true);
      }
    }
  };

  const logout = () => {
    const logoutObj = {
      eventType: "logout",
      remarks: "logged out successfully",
    };

    useLogs.storeUserLogs(logoutObj);
    Auth.logoutHandler();
    navigate("/");
  };

  const hideWindowFunction = () => {
    setChangePass({
      ...changePass,
      currentPwd: "",
      confirmPwd: "",
      newPwd: "",
    });

    const windId = document.getElementById("change-pass-window-id");
    setHideWindow("hide-window");
    windId.style.marginLeft = "132%";
  };

  const openPassWindow = () => {
    const windId = document.getElementById("change-pass-window-id");
    setHideWindow("display-window");
    windId.style.marginLeft = "32%";
    // windId.style.display='block'
  };

  const changeUserPasswordForm = (e) => {
    e.preventDefault();
    // const baseUrl = "http://192.168.0.198:8080/AuroAutoLocker/UpdateUserPassword";

    console.log(changePass);
    if (changePass.newPwd !== changePass.confirmPwd) {
      alert("password doesnt match");
    } else {
      fetch(serverPaths.localAdminPath+ "UpdateUserPassword", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: JSON.stringify(changePass),
      })
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data);
          if (data.status === "success") {
            alert("Changed successfully");
            hideWindowFunction();
          } else {
            e.preventDefault();
            alert("Something went wrong please provide valid credentials !");
          }
        })
        .catch((err) => console.log("err : " + err));
    }
  };

  const formEventHandler = (e) => {
    e.preventDefault();
    const name = e.target.name;

    setChangePass({
      ...changePass,
      [name]: e.target.value,
    });
  };

  const scrollToTopFun = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  // const closeSideNavWindow = () => {
  //   let sideNavId = document.getElementById("rightNavbarId");
  //   if (sideNavId.style.marginLeft === "60%") {
  //     // sideNavId.style.display = 'none'
  //     sideNavId.style.marginLeft = "140%";
  //     setMenuIconClick(false);
  //   }
  // }

  return (
    <div>
      <div className="main-container">
        <div className="dashboardMain">
          <div className="logo-container" onClick={() => scrollToTopFun()}>
            <h2>Tuckit.In</h2>
          </div>

          <div className="account-container main-navbar">
            <h5 className="mainNavbar-header"> {changePass.userName} </h5>

            <a onClick={() => logout()}>
              <h5 className="mainNavbar-header">logOut</h5>
            </a>

            <div className="menu-icon-container">
              {menuIconClick ? (
                <CloseIcon
                  onClick={() => changeDisplayStatus()}
                  className="menu-icon-navbar"
                  fontSize="large"
                  sx={{
                    mt: -6,
                    cursor: "pointer",
                  }}
                />
              ) : (
                <MenuIcon
                  onClick={() => changeDisplayStatus()}
                  className="menu-icon-navbar"
                  fontSize="large"
                  sx={{
                    mt: -6,
                    cursor: "pointer",
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="side-navbar-container">
        <div className="right-navbar" id="rightNavbarId">
          <ul>
            <div className="right-navbar-content">
              <li>
                <Link
                  to={
                    userPermissions.indexOf("user_creation") > -1
                      ? "/users"
                      : "#"
                  }
                  onClick={
                    userPermissions.indexOf("user_creation") > -1
                      ? ""
                      : () => alert("Access Restricted")
                  }
                >
                  <a href="#">
                    <h6
                      className={
                        userPermissions.indexOf("user_creation") > -1
                          ? "sideNav-header"
                          : "access-perm"
                      }
                    >
                      create user
                    </h6>
                  </a>
                </Link>
              </li>

              <li>
                <Link
                  to={
                    userPermissions.indexOf("site_registration") > -1
                      ? "/siteRegistraion"
                      : "#"
                  }
                  onClick={
                    userPermissions.indexOf("site_registration") > -1
                      ? ""
                      : () => alert("Access Restricted")
                  }
                >
                  <a href="#">
                    <h6
                      className={
                        userPermissions.indexOf("site_registration") > -1
                          ? "sideNav-header"
                          : "access-perm"
                      }
                    >
                      Site-Registration
                    </h6>
                  </a>
                </Link>
              </li>
              <li>
                <Link
                  to={
                    userPermissions.indexOf("locker_category") > -1
                      ? "/lockerCatagory"
                      : ""
                  }
                  onClick={
                    userPermissions.indexOf("locker_category") > -1
                      ? ""
                      : () => alert("Access Restricted")
                  }
                >
                  <a href="#">
                    <h6
                      className={
                        userPermissions.indexOf("locker_category") > -1
                          ? "sideNav-header"
                          : "access-perm"
                      }
                    >
                      Locks-Catagory
                    </h6>
                  </a>
                </Link>
              </li>

              <li>
                <a onClick={() => openPassWindow()} href="#">
                  <h6 className="sideNav-header">Change Password</h6>
                </a>
              </li>

              <li>
                <Link
                  to={
                    userPermissions.indexOf("firmware_update") > -1
                      ? "/firmware_update"
                      : ""
                  }
                  onClick={
                    userPermissions.indexOf("firmware_update") > -1
                      ? ""
                      : () => alert("Access Restricted")
                  }
                >
                  <a href="#">
                    <h6
                      className={
                        userPermissions.indexOf("firmware_update") > -1
                          ? "sideNav-header"
                          : "access-perm"
                      }
                    >
                      Firmware_Update
                    </h6>
                  </a>
                </Link>
              </li>

              <li>
                <Link
                  to={userPermissions.indexOf("charts") > -1 ? "/charts" : ""}
                  onClick={
                    userPermissions.indexOf("charts") > -1
                      ? ""
                      : () => alert("Access Restricted")
                  }
                >
                  <a href="#">
                    <h6
                      className={
                        userPermissions.indexOf("charts") > -1
                          ? "sideNav-header"
                          : "access-perm"
                      }
                    >
                      Charts
                    </h6>
                  </a>
                </Link>
              </li>

              <li>
                <Link
                  to={
                    userPermissions.indexOf("xl_access") > -1
                      ? "/to-xlsheet"
                      : ""
                  }
                  onClick={
                    userPermissions.indexOf("xl_access") > -1
                      ? ""
                      : () => alert("Access Restricted")
                  }
                >
                  <a href="#">
                    <h6
                      className={
                        userPermissions.indexOf("xl_access") > -1
                          ? "sideNav-header"
                          : "access-perm"
                      }
                    >
                      Download as xlsheet
                    </h6>
                  </a>
                </Link>
              </li>

              {/* <li>
                <a href="#">
                  <h5 className="side-nav-userName">{changePass.userName}</h5>
                </a>
              </li> */}
            </div>
          </ul>
        </div>
      </div>

      <div className={hideWindow}></div>

      <div className="change-pass-window" id="change-pass-window-id">
        <h1 className="changepass-wind-header">Change password</h1>
        <IoMdCloseCircle
          onClick={() => hideWindowFunction()}
          className="close-changepass-wind"
          size={30}
        />
        <form onSubmit={(e) => changeUserPasswordForm(e)}>
          <table>
            <tr>
              <td>
                <label htmlFor="userName" className="change-pass-label">
                  user Name :
                </label>
              </td>
              <td>
                <input
                  type="text"
                  name="userName"
                  className="form-intput change-pass-input"
                  value={changePass.userName}
                  readOnly
                />
              </td>
            </tr>

            <tr>
              <td>
                <label htmlFor="currentPwd" className="change-pass-label">
                  current password:
                </label>
              </td>
              <td>
                <input
                  onChange={(e) => {
                    formEventHandler(e);
                  }}
                  type="password"
                  name="currentPwd"
                  value={changePass.currentPwd}
                  className="form-intput change-pass-input"
                  required
                  autoComplete="new-password"
                />
              </td>
            </tr>

            <tr>
              <td>
                <label htmlFor="newPwd" className="change-pass-label">
                  Enter new password:
                </label>
              </td>
              <td>
                <input
                  onChange={(e) => {
                    formEventHandler(e);
                  }}
                  type="password"
                  name="newPwd"
                  value={changePass.newPwd}
                  className="form-intput change-pass-input"
                  required
                />
              </td>
            </tr>
            <tr>
              <td>
                <label htmlFor="confirmPwd" className="change-pass-label">
                  confirm password:
                </label>
              </td>
              <td>
                <input
                  onChange={(e) => {
                    formEventHandler(e);
                  }}
                  type="password"
                  className="form-intput change-pass-input"
                  value={changePass.confirmPwd}
                  name="confirmPwd"
                  required
                />
                {changePass.confirmPwd === "" ? (
                  <BsExclamationTriangle className="invalid-icon" size={20} />
                ) : (
                  <>
                    {changePass.newPwd === changePass.confirmPwd ? (
                      <GiConfirmed className="valid-icon" size={20} />
                    ) : (
                      <BsExclamationTriangle
                        className="invalid-icon"
                        size={20}
                      />
                    )}
                  </>
                )}
              </td>
            </tr>
          </table>
          <input type="submit" className="btn submit-btn" value={"Submit"} />
        </form>
      </div>
    </div>
  );
}

export default SideNavbarComp;
