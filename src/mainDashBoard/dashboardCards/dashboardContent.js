import "./dashboardContent.css";
import "bootstrap/dist/css/bootstrap.min.css";

import React from "react";
import SideNavbarComp from "../sideNavbar/SideNavbar";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useAuth } from "../../utils/Auth";
import { useEffect, useState } from "react";
import DashBoardOperationItems from "./DashBoardOperationItems";
import TransactionDashboardCom from "../../transactionDashboard/TransactionDashboardCom";

import { Alert, Backdrop, Box, Switch } from "@mui/material";

import LockerOperations from "../../lockerOperations/LockerOperations";
import LockerStatus from "../../lockerStatus/LockerStatus";
import TerminalStatus from "../../loginPage/terminalStatus/TerminalStatus";
import { Button, IconButton } from "@mui/material";

import PathUrl from "../../GlobalVariable/urlPath.json";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import TransactionOperations from "../../transactionDashboard/TransactionOperations";

import Snackbar from "@mui/material/Snackbar";
import CloseIcon from "@mui/icons-material/Close";
import AlertSound from "../../audio/alertSound.wav";
import RefundHandler from "../../transactionDashboard/amountRefund/RefundHandler";
import AlertIcon from "../../assets/images/alert.png";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import CircularProgress from "@mui/material/CircularProgress";
import ButtonGroup from "@mui/material/ButtonGroup";
import { commonApiForGetConenction } from "../../GlobalVariable/GlobalModule";
import { useLogDetails } from "../../utils/UserLogDetails";

function DashboardContentComp() {
  const [tuckitStationLockersEnabled, setTuckitStationLockersEnabled] =
    useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);

  const [openLockersStaus, setOpenLockersStatus] = useState({
    isLocksOpen: false,
    isIgnoreClicked: false,
  });

  const [terminalTypeSelected, setTerminalTypeSelected] =
    useState("MALL-LOCKERS");

  // for alert
  const [notificationActive, setNotificationActive] = useState(false);

  // for open status locker
  const [isLocksOpen, setIsLocksOpen] = useState(false);
  const [openLockersTid, setOpenLockersTid] = useState(null);

  // for inactive terminal id
  const [isTerminalInactive, setIsTerminalInactive] = useState(false);
  const [inactiveTerminalNames, setInactiveTerminalsName] = useState(null);

  // for transti lockers
  const [locksTransit, setLocksTransit] = useState(false);
  const [transitLockerTid, setTranstiLockTid] = useState(null);

  // const isIgnoreClicked = useRef(false);
  // const [transactionTransit, setTransactionTransit] = useState(null);

  const [visibleState, setVisibleState] = useState({
    transactionDetails: true,
    lockerOperations: false,
    refund: false,
    transactionHistory: false,
    deviceStatus: false,
    lockerStatus: false,
  });

  // const [transitLockTerminalId, setTransitLockTerminalId] = useState(false);
  const [transitTransactionArr, setTransitTransactionArr] = useState([]);
  // const [lockOpenDailogue, setLockOpenDailogue] = useState(false);
  // const [lockOpenTerminalId, setLockOpenTerminalId] = useState([]);

  const [inactiveTerminals, setInactiveTerminals] = useState([]);

  const [state, setState] = useState({
    vertical: "top",
    horizontal: "left",
  });

  const [appNotRespondigAlert, setAppNotRespondigAlert] = useState({
    verticalTop: "top",
    horizontalTop: "center",
  });

  const [dashboardContentClicked, setDashboardContentClicked] = useState(false);

  const [isRefundInitFromDiffComp, setIsRefundInitFromDiffComp] =
    useState(false);
  const [refundInitObject, setRefundInitObject] = useState({});
  const { vertical, horizontal } = state;
  const { verticalTop, horizontalTop } = appNotRespondigAlert;

  const [appInactive, setAppInactive] = useState(false);
  const [appSwitchedAlert, setAppSwitchedAlert] = useState(false);

  const [isWarning, setIsWarning] = useState(false);

  const [appSwitchData, setAppSwitchData] = useState({
    currentSelected: "MALL-LOCKERS",
    previoslySelected: "",
    changedTo: "MALL-LOCKERS",
  });

  // for ingnoring the alert to pop up,
  // const handleIgnoreClocked = () => {
  //   setOpenLockersStatus({
  //     ...openLockersStaus,
  //     isIgnoreClicked: true,
  //   });
  //   setLockOpenDailogue(false);

  //   isIgnoreClicked.current = true;
  // };

  // initiate to lockers status on click

  // const handleLockStatusClicked = () => {
  //   setLockOpenDailogue(false);
  //   setOpenLockersStatus({
  //     ...openLockersStaus,
  //     isIgnoreClicked: true,
  //   });
  //   isIgnoreClicked.current = true;
  //   handleVisibleStates("lockerStatus");
  // };

  // console.log(Auth.user)

  const Auth = useAuth();
  const navigate = useNavigate();
  const userLogDetails = useLogDetails();

  // const [serverPaths, setServePaths] = useState({
  //   serverUrl:
  //     Auth.accessAppType === "TEMPLE-LOCKERS"
  //       ? PathUrl.templeServerUrl
  //       : Auth.accessAppType === "STATION-LOCKERS"
  //       ? PathUrl.stationServerUrl
  //       : PathUrl.serverUrl,
  //   localAdminPath:
  //     Auth.accessAppType === "TEMPLE-LOCKERS"
  //       ? PathUrl.templeLocalServerPath
  //       : Auth.accessAppType === "STATION-LOCKERS"
  //       ? PathUrl.stationLocalServerPath
  //       : PathUrl.localServerPath,
  // });

  const [serverPaths, setServePaths] = useState({
    serverUrl: "",
    localAdminPath: "",
  });

  const serverRef = useRef(serverPaths);

  useEffect(() => {
    console.log("----------==========---------");

    console.log(Auth.accessAppType);

    setServePaths({
      serverUrl:
        Auth.accessAppType === "TEMPLE-LOCKERS"
          ? PathUrl.templeServerUrl
          : Auth.accessAppType === "STATION-LOCKERS"
          ? PathUrl.stationServerUrl
          : PathUrl.serverUrl,
      localAdminPath:
        Auth.accessAppType === "TEMPLE-LOCKERS"
          ? PathUrl.templeLocalServerPath
          : Auth.accessAppType === "STATION-LOCKERS"
          ? PathUrl.stationLocalServerPath
          : PathUrl.localServerPath,
    });
  }, [Auth.accessAppType]);

  useEffect(() => {
    serverRef.current = serverPaths;
  }, [serverPaths]);

  useEffect(() => {
    if (!Auth.user) {
      Auth.logoutHandler();
      navigate("/");
    }

    if (Auth.accessAppType) {
      setTerminalTypeSelected(Auth.accessAppType);
      setServePaths({
        serverUrl:
          Auth.accessAppType === "TEMPLE-LOCKERS"
            ? PathUrl.templeServerUrl
            : Auth.accessAppType === "STATION-LOCKERS"
            ? PathUrl.stationServerUrl
            : PathUrl.serverUrl,
        localAdminPath:
          Auth.accessAppType === "TEMPLE-LOCKERS"
            ? PathUrl.templeLocalServerPath
            : Auth.accessAppType === "STATION-LOCKERS"
            ? PathUrl.stationLocalServerPath
            : PathUrl.localServerPath,
      });
    }

    setIsRefundInitFromDiffComp(false);
  }, []);

  const permissions = Auth.permissions.userPermissions;
  // const allPermissions = Auth.permissions.allPermissions;
  JSON.parse('"' + permissions + '"');

  useEffect(() => {
    const inerval = setInterval(() => {
      if (serverPaths.localAdminPath) {
        console.log(
          "here inside =========--------------- calling urls in loop"
        );

        console.log(serverRef.current.localAdminPath);

        isLockerOpenFunction();
        checkIsTransactionDetails();
        checkIsTerminalIdInactive();
      }
    }, 60000);

    return () => clearInterval(inerval);
  }, []);

  // request to check wheather terminal id is active or not

  const checkIsTerminalIdInactive = () => {
    console.log("inside function again");

    const inactiveterminalStatusObj = {
      packetType: "termhealthstat",
    };
    fetch(serverRef.current.localAdminPath + "FetchDeviceHealth", {
      method: "POST",
      headers: {
        accept: "application/json",
      },
      body: JSON.stringify(inactiveterminalStatusObj),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data.responseCode === "inactive") {
          setIsTerminalInactive(true);
          setInactiveTerminalsName(data.terminals.join(", "));

          if (!notificationActive) {
            setNotificationActive(true);
          }
          // setInactiveTerminals([...data.terminals]);
        } else if (data.responseCode === "active") {
          setIsTerminalInactive(false);
          setInactiveTerminalsName(null);

          if (notificationActive) {
            setNotificationActive(false);
          }
        }
      })
      .catch((err) => {
        console.log("err : " + err);

        setNotificationActive(false);
      });
  };

  // for collecting the transit user from dashboard

  const checkIsTransactionDetails = () => {
    console.log("inside function again");

    const fetchLiveTransaction = {
      PacketType: "transitlocks",
    };
    fetch(serverRef.current.localAdminPath + "FetchTransactionDetails", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify(fetchLiveTransaction),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.responseCode === "transit-200") {
          const stringId = data.terminalId.join(", ");
          playTransitAlertSound();
          setTranstiLockTid(stringId);
          setLocksTransit(true);
          setTransitTransactionArr(data.terminalId);

          if (!notificationActive) {
            setNotificationActive(true);
          }
        } else {
          setLocksTransit(false);
          setTransitTransactionArr([]);
          setTranstiLockTid(null);

          if (notificationActive) {
            setNotificationActive(false);
          }
          // if (transitLockerTid != null) {
          //   // alert("no terminal Id's")
          //   setTransitTransactionArr([]);
          //   setTranstiLockTid(null);
          // }
        }
      })
      .catch((err) => {
        console.log("err : " + err);
        setNotificationActive(false);
      });
  };

  // to check wheather lockers are open for long time and not recieved close state

  // this was to pop up the alert every minute and handles the ignore alert for same locks and pops up again if there are
  // any new locks were open

  const isLockerOpenFunction1 = () => {
    const obj = {
      PacketType: "lockstatus",
    };

    // fetch(serverPaths.localAdminPath + "FetchLockerStatus", {
    //   method: "POST",
    //   headers: {
    //     accept: "application/json",
    //   },
    //   body: JSON.stringify(obj),
    // })
    //   .then((resp) => resp.json())
    //   .then((data) => {
    //     console.log(data);
    //     if (data.responseCode === "openlocker") {
    //       if (data.newOpenLocks) {
    //         console.log("different locks are open");

    //         setLockOpenTerminalId([...data.terminalId]);
    //         setOpenLockersStatus({
    //           ...openLockersStaus,
    //           isLocksOpen: true,
    //           isIgnoreClicked: false,
    //         });
    //         isIgnoreClicked.current = false;
    //         setLockOpenDailogue(true);
    //       } else {
    //         if (!isIgnoreClicked.current) {
    //           setLockOpenTerminalId([...data.terminalId]);
    //           setLockOpenDailogue(true);
    //         }

    //         // setLockOpenDailogue(true);
    //         // setLockOpenTerminalId([...data.terminalId]);

    //         setOpenLockersStatus({
    //           ...openLockersStaus,
    //           isLocksOpen: true,
    //         });
    //       }
    //     } else if (data.responseCode === "closelocker") {
    //       setLockOpenTerminalId([]);
    //       if (openLockersStaus.isLocksOpen) {
    //         setOpenLockersStatus({
    //           ...openLockersStaus,
    //           isLocksOpen: false,
    //         });
    //       }
    //     }
    //   })
    //   .catch((err) => {
    //     console.log("err : " + err);
    //   });
  };

  // this function does not handle any ignore button, pushes data to alert for every hit
  const isLockerOpenFunction = () => {
    const obj = {
      PacketType: "lockstatus",
    };

    fetch(serverRef.current.localAdminPath + "FetchLockerStatus", {
      method: "POST",
      headers: {
        accept: "application/json",
      },
      body: JSON.stringify(obj),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data.responseCode === "openlocker") {
          setIsLocksOpen(true);
          setOpenLockersTid(data.terminalId.join(", "));
          if (!notificationActive) {
            setNotificationActive(true);
          }
        } else if (data.responseCode === "closelocker") {
          setIsLocksOpen(false);
          setOpenLockersTid(null);

          if (notificationActive) {
            setNotificationActive(false);
          }
        }
      })
      .catch((err) => {
        console.log("err : " + err);
        setNotificationActive(false);
      });
  };
  //   if (userPermissions) {
  //     console.log('====================================');
  //     console.log(userPermissions);
  //     console.log('====================================');
  //   }

  const handleVisibleStates = (state) => {
    setDashboardContentClicked(!dashboardContentClicked);
    setIsRefundInitFromDiffComp(false);
    if (state === "transactionDetails") {
      setVisibleState({
        transactionDetails: true,
        lockerOperations: false,
        refund: false,
        transactionHistory: false,
        deviceStatus: false,
        lockerStatus: false,
      });
    } else if (state === "transactionHistory") {
      setVisibleState({
        transactionDetails: false,
        lockerOperations: false,
        refund: false,
        transactionHistory: true,
        deviceStatus: false,
        lockerStatus: false,
      });
    } else if (state === "refund") {
      setVisibleState({
        transactionDetails: false,
        lockerOperations: false,
        refund: true,
        transactionHistory: false,
        deviceStatus: false,
        lockerStatus: false,
      });
    } else if (state === "lockerOperation") {
      setVisibleState({
        transactionDetails: false,
        lockerOperations: true,
        refund: false,
        transactionHistory: false,
        deviceStatus: false,
        lockerStatus: false,
      });
    } else if (state === "deviceStatus") {
      setVisibleState({
        transactionDetails: false,
        lockerOperations: false,
        refund: false,
        transactionHistory: false,
        deviceStatus: true,
        lockerStatus: false,
      });
    } else if (state === "lockerStatus") {
      setVisibleState({
        transactionDetails: false,
        lockerOperations: false,
        refund: false,
        transactionHistory: false,
        deviceStatus: false,
        lockerStatus: true,
      });

      if (openLockersStaus.isLocksOpen) {
        setOpenLockersStatus({
          ...openLockersStaus,
          isLocksOpen: false,
        });
      }
    }
  };

  const clickedItemToView = () => {
    let ind = 0;
    let keyWord = null;
    // console.log(visibleState);
    Object.values(visibleState).map((value, index) => {
      if (value === true) {
        ind = index;
        // console.log(value + " " + index);
      }
    });
    Object.keys(visibleState).map((key, index) => {
      // console.log(key + " " + index + " : " + ind);
      if (ind === index) {
        keyWord = key;
        // console.log("value : " + key);
      }
    });

    return keyWord;
  };

  const handleClose = () => {
    setLocksTransit(false);
  };

  const playTransitAlertSound = () => {
    const transitSound = new Audio(AlertSound);
    transitSound.play();
  };

  const userAccessRestrictedFun = () => {
    setIsWarning(true);
  };

  const hideAlertFunction = () => {
    setIsWarning(false);
  };

  // for initiating refund from different component

  const refundInitiateFromDiffCompHandler = (refObj) => {
    console.log(refObj);
    setVisibleState({
      ...visibleState,
      transactionDetails: false,
      transactionHistory: false,
      refund: true,
    });
    setRefundInitObject({ ...refObj });
    setIsRefundInitFromDiffComp(true);
  };

  const closeInactiveTerminalsWindow = () => {
    setInactiveTerminals([]);
  };

  const handleSwitchBetweenLockers = async (selectionType) => {
    setOpenBackdrop(true);

    const appPermissions = Auth.appPermissions;

    if (!appPermissions.includes(selectionType)) {
      alert(`you are not authorized to change to  ${selectionType}`);
      setOpenBackdrop(false);
    } else {
      if (selectionType === "MALL-LOCKERS") {
        try {
          const result = await checkConnectionToOtherTerminalApp(
            PathUrl.localServerPath + "CheckConnection"
          );

          if (result === "STATUS-200") {
            Auth.handleAccessAppType("MALL-LOCKERS");
            setTerminalTypeSelected(selectionType);
            setAppSwitchedAlert(true);
            setOpenBackdrop(false);
            setAppSwitchData((prevApp) => ({
              currentSelected: "Tuckit Mall-Lockers",
              previoslySelected: prevApp.currentSelected,
              changedTo: "Tuckit Mall-Lockers",
            }));

            const userLogsObj = {
              eventType: "SWITCH_APP",
              remarks: `${appSwitchData.previoslySelected} to MALL-LOCKERS`,
            };

            userLogDetails.storeUserLogs(userLogsObj);
          } else {
            setAppInactive(true);
            setOpenBackdrop(false);
            // setAppSwitchData((prevApp) => ({
            //   currentSelected: "Tuckit Mall-Lockers",
            //   previoslySelected: prevApp.currentSelected,
            //   changedTo: "",
            // }));
          }
        } catch (error) {
          setOpenBackdrop(false);
          setAppInactive(true);
          // setAppSwitchData((prevApp) => ({
          //   currentSelected: "Tuckit Mall-Lockers",
          //   previoslySelected: prevApp.currentSelected,
          //   changedTo: "",
          // }));
        }
      } else if (selectionType === "TEMPLE-LOCKERS") {
        try {
          const result = await checkConnectionToOtherTerminalApp(
            PathUrl.templeLocalServerPath + "CheckConnection"
          );
          if (result === "STATUS-200") {
            Auth.handleAccessAppType("TEMPLE-LOCKERS");
            setTerminalTypeSelected(selectionType);
            setAppSwitchedAlert(true);
            setOpenBackdrop(false);
            setAppSwitchData((prevApp) => ({
              currentSelected: "Tuckit Temple-Lockers",
              previoslySelected: prevApp.currentSelected,
              changedTo: "Tuckit Temple-Lockers",
            }));

            const userLogsObj = {
              eventType: "SWITCH_APP",
              remarks: `${appSwitchData.previoslySelected} to TEMPLE_LOCKERS`,
            };

            userLogDetails.storeUserLogs(userLogsObj);
          } else {
            setAppInactive(true);
            setOpenBackdrop(false);
            // setAppSwitchData((prevApp) => ({
            //   currentSelected: "Tuckit TEMPLE-LOCKERS",
            //   previoslySelected: prevApp.currentSelected,
            //   changedTo: "",
            // }));
          }
        } catch (error) {
          setOpenBackdrop(false);
          setAppInactive(true);
          setOpenBackdrop(false);
          // setAppSwitchData((prevApp) => ({
          //   currentSelected: "Tuckit TEMPLE-LOCKERS",
          //   previoslySelected: prevApp.currentSelected,
          //   changedTo: "",
          // }));
        }
      } else if (selectionType === "STATION-LOCKERS") {
        try {
          const result = await checkConnectionToOtherTerminalApp(
            PathUrl.stationLocalServerPath + "CheckConnection"
          );
          if (result === "STATUS-200") {
            Auth.handleAccessAppType("STATION-LOCKERS");
            setTerminalTypeSelected(selectionType);
            setAppSwitchedAlert(true);
            setOpenBackdrop(false);

            setAppSwitchData((prevApp) => ({
              currentSelected: "Tuckit Station-Lockers",
              previoslySelected: prevApp.currentSelected,
              changedTo: "Tuckit Station-Lockers",
            }));

            const userLogsObj = {
              eventType: "SWITCH_APP",
              remarks: `${appSwitchData.previoslySelected} to STATION-LOCKERS`,
            };

            userLogDetails.storeUserLogs(userLogsObj);
          } else {
            setAppInactive(true);
            setOpenBackdrop(false);
            // setAppSwitchData((prevApp) => ({
            //   ...prevApp,
            //   currentSelected: "Tuckit Station-Lockers",
            //   previoslySelected: prevApp.currentSelected,
            //   changedTo: "",
            // }));
          }
        } catch (error) {
          setOpenBackdrop(false);
          setAppInactive(true);
          setOpenBackdrop(false);
          // setAppSwitchData((prevApp) => ({
          //   currentSelected: "Tuckit Station-Lockers",
          //   previoslySelected: prevApp.currentSelected,
          //   changedTo: "",
          // }));
        }
      }
    }
  };

  async function checkConnectionToOtherTerminalApp(path, type) {
    try {
      const result = await commonApiForGetConenction(path);

      if (result) {
        return "STATUS-200";
      } else {
        return "STATUS-404";
      }
    } catch (error) {
      return "STATUS-404";
    }
  }

  const handleBackdrop = (type) => {
    setOpenBackdrop(type);
  };

  const hideAppNotRespondingAlert = () => {
    if (appInactive) {
      setAppInactive(false);
    }

    if (appSwitchedAlert) {
      setAppSwitchedAlert(false);
    }
  };
  // action for the locker open alert

  const action = (
    <React.Fragment>
      {/* <Button color="secondary" size="small" onClick={handleVisibleStates("transactionDetails")}>
        UNDO
      </Button> */}
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );
  return (
    <>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={openBackdrop}
        // onClick={() => handleBackdrop(false)}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={appInactive}
        autoHideDuration={6000}
        onClose={() => hideAppNotRespondingAlert()}
      >
        <Alert onClose={() => hideAppNotRespondingAlert()} severity="error">
          {appSwitchData.currentSelected +
            " is not responding, try again later or contact admin"}
        </Alert>
      </Snackbar>

      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={appSwitchedAlert}
        autoHideDuration={6000}
        onClose={() => hideAppNotRespondingAlert()}
      >
        <Alert onClose={() => hideAppNotRespondingAlert()} severity="success">
          {"App has been Changed to :" + appSwitchData.changedTo + ""}
        </Alert>
      </Snackbar>

      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={isWarning}
        autoHideDuration={6000}
        onClose={() => hideAlertFunction()}
      >
        <Alert onClose={() => hideAlertFunction()} severity="warning">
          Access Restricted !!
        </Alert>
      </Snackbar>

      {/* {isTerminalDeviceInactiveClicked &&
        inactiveTerminals.length >
          0 && (
            <>
              <div className="wind-background"></div>

              <div className="inactive-terminalid-alert-container">
                <div className="inactive-terminal-alert">
                  <IconButton
                    variant="contained"
                    color="warning"
                    className="close-inactive-terminalwind"
                    onClick={() => closeInactiveTerminalsWindow()}
                  >
                    {" "}
                    <CloseIcon />{" "}
                  </IconButton>
                  <div className="inactive-term-logo-container">
                    <NotificationsActiveIcon className="inactive-termid-alerticon" />
                  </div>
                  <div className="inactive-term-content-container">
                    <p>
                      TerminalID's = {inactiveTerminals} status is inactive at
                      the moment{" "}
                    </p>

                    <Button onClick={() => setIsTerminalDeviceInactiveClicked(false)} color="secondary">
                      Ignore
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )} */}

      {/* {inactiveTerminals.length > 0  (
        <>
          <div className="wind-background"></div>

          <div className="inactive-terminalid-alert-container">
            <div className="inactive-terminal-alert">
            <IconButton
                  variant="contained"
                  color="warning"
                  className="close-inactive-terminalwind"
                  onClick={() => closeInactiveTerminalsWindow()}
                >
                  {" "}
                  <CloseIcon />{" "}
                </IconButton>
              <div className="inactive-term-logo-container">
                <NotificationsActiveIcon className="inactive-termid-alerticon" />
              </div>
              <div className="inactive-term-content-container">
                <p>
                  TerminalID's = {inactiveTerminals} status is inactive at the
                  moment{" "} 
                </p>

                <Button onClick={() => setInactiveTerminals(false)}>Ignore</Button>

              </div>
            </div>
          </div>
        </>
      )} */}

      <div className="dashboard-content-container">
        <SideNavbarComp userPermissions={permissions} />

        <div className="dashboard-content">
          <DashBoardOperationItems
            clickEventForItems={handleVisibleStates}
            count={
              0 +
              (isLocksOpen ? 1 : 0) +
              (isTerminalInactive ? 1 : 0) +
              (locksTransit ? 1 : 0)
            }
            ClickedItemToView={clickedItemToView()}
            userPermissions={permissions}
            lockersOpen={openLockersStaus.isLocksOpen}
            accessRestricted={userAccessRestrictedFun}
            isNotificationActive={notificationActive}
            isLocksOpen={isLocksOpen}
            isTerminalInactive={isTerminalInactive}
            transitLocks={locksTransit}
            tIdInWhichLocksOpen={openLockersTid}
            inactiveTerminalNames={inactiveTerminalNames}
            transitLocksId={transitLockerTid}
          />

          <div className="shift-lockers-type">
            <h4
              // style={
              //   !tuckitStationLockersEnabled
              //     ? { color: "blue", marginTop: "5px" }
              //     : { color: "red", marginTop: "5px" }
              // }
              style={{ color: "chocolate", marginTop: "5px" }}
            >
              currently selected : {Auth.accessAppType} operations
            </h4>
            {/* <Switch
              checked={tuckitStationLockersEnabled}
              onChange={(e) => handleSwitchBetweenLockers(e)}
              inputProps={{ 'aria-label': 'controlled' }}

            /> */}

            {visibleState.transactionDetails && (
              <ButtonGroup
                variant="contained"
                aria-label="Basic button group"
                style={{
                  textAlign: "center",
                  alignItems: "center",
                  margin: "auto",
                }}
              >
                <Button
                  className={
                    terminalTypeSelected === "MALL-LOCKERS"
                      ? "app-selected-btn"
                      : "app-non-selected-btn"
                  }
                  disabled={
                    terminalTypeSelected === "MALL-LOCKERS" ? true : false
                  }
                  onClick={() => handleSwitchBetweenLockers("MALL-LOCKERS")}
                >
                  MALL-TERMINALS
                </Button>
                <Button
                  className={
                    terminalTypeSelected === "STATION-LOCKERS"
                      ? "app-selected-btn"
                      : "app-non-selected-btn"
                  }
                  disabled={
                    terminalTypeSelected === "STATION-LOCKERS" ? true : false
                  }
                  onClick={() => handleSwitchBetweenLockers("STATION-LOCKERS")}
                >
                  STATION-TERMINALS
                </Button>
                <Button
                  className={
                    terminalTypeSelected === "TEMPLE-LOCKERS"
                      ? "app-selected-btn"
                      : "app-non-selected-btn"
                  }
                  disabled={
                    terminalTypeSelected === "TEMPLE-LOCKERS" ? true : false
                  }
                  onClick={() => handleSwitchBetweenLockers("TEMPLE-LOCKERS")}
                >
                  TEMPLE-TERMINALS
                </Button>
              </ButtonGroup>
            )}
          </div>

          <hr />

          <div className="all-item-container">
            {visibleState.transactionDetails ? (
              <TransactionDashboardCom
                appSwitchedTo={Auth.accessAppType}
                transitTerminalID={transitTransactionArr}
                onRefundClick={refundInitiateFromDiffCompHandler.bind(this)}
              />
            ) : visibleState.transactionHistory ? (
              <TransactionOperations
                appSwitchedTo={Auth.accessAppType}
                onCloseHandler={handleVisibleStates.bind(this)}
                onRefundClick={refundInitiateFromDiffCompHandler.bind(this)}
                status={dashboardContentClicked}
              />
            ) : visibleState.lockerOperations ? (
              <LockerOperations
                appSwitchedTo={Auth.accessAppType}
                onCloseHandler={handleVisibleStates.bind(this)}
                status={dashboardContentClicked}
                releasLocker={
                  permissions.indexOf("release_locker") > -1 ? true : false
                }
              />
            ) : visibleState.refund ? (
              <RefundHandler
                appSwitchedTo={Auth.accessAppType}
                onCloseHandler={handleVisibleStates.bind(this)}
                status={dashboardContentClicked}
                isRefundInitFromDiffComp={isRefundInitFromDiffComp}
                refundInitObj={isRefundInitFromDiffComp ? refundInitObject : {}}
              />
            ) : visibleState.lockerStatus ? (
              <LockerStatus appSwitchedTo={Auth.accessAppType} />
            ) : visibleState.deviceStatus ? (
              <TerminalStatus appSwitchedTo={Auth.accessAppType} />
            ) : null}
          </div>
        </div>
      </div>

      {/* <Dialog
        open={lockOpenDailogue}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Alert !!!"}</DialogTitle>
        <DialogContent>
          <div className="locker-open-alert">
            <p>
              Locker doars are open for a while in terminal id ={" "}
              {lockOpenTerminalId}
              <br />
              Please Close the locker doar
            </p>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleIgnoreClocked}>Ignore</Button>
          <Button onClick={handleLockStatusClicked} autoFocus>
            Lock status
          </Button>
        </DialogActions>
      </Dialog> */}

      <Snackbar
        open={locksTransit}
        autoHideDuration={6000}
        message={"Alert !! TRANSIT Lockers in terminalID: " + transitLockerTid}
        onClose={handleClose}
        action={action}
      ></Snackbar>
    </>
  );
}

export default DashboardContentComp;
