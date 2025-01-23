import React, { useEffect, useState } from "react";
import { Autocomplete, Button, TextField } from "@mui/material";
import "./releaseLock.css";
import { useAuth } from "../../utils/Auth";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import LoadingButton from "@mui/lab/LoadingButton";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import PathUrl from "../../GlobalVariable/urlPath.json";

import lockers from "../../GlobalVariable/lockers.json";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import Snackbar from "@mui/material/Snackbar";

import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import NativeSelect from "@mui/material/NativeSelect";
import MuiAlert from "@mui/material/Alert";
import ORNLayout from "../layoutsAccorsingTerminalId/ORNLayout";
import LULULayout from "../layoutsAccorsingTerminalId/LULULayout";
import GALLayout from "../layoutsAccorsingTerminalId/GALLayout";
import { useLogDetails } from "../../utils/UserLogDetails";
import FalconUptownLulub2Layout from "../layoutsAccorsingTerminalId/FalconUptownLulub2Layout";
import NexusLayout from "../layoutsAccorsingTerminalId/NexusLayout";
import GarudaLayout from "../layoutsAccorsingTerminalId/GarudaLayout";
import NXSNKNlayout from "../layoutsAccorsingTerminalId/NXSNKNlayout";
import NXSNKNlayoutUpdate from "../layoutsAccorsingTerminalId/NXSNKNlayoutUpdate";
import NexusHyd2Layout from "../layoutsAccorsingTerminalId/NexusHyd2Layout";
import MMBLR1Layout from "../layoutsAccorsingTerminalId/MMBLR1Layout";
import ORN2Layout from "../layoutsAccorsingTerminalId/ORN2Layout";
import MMBLR3Layout from "../layoutsAccorsingTerminalId/MMBLR3Layout";
import PMCBB1Layout from "../layoutsAccorsingTerminalId/PMCBB1Layout";
import PMCCNBLLayout from "../layoutsAccorsingTerminalId/PMCCNBLLayout";
import PMCCNGFLayout from "../layoutsAccorsingTerminalId/PMCCNGFLayout";
import NXPAVMZLayout from "../layoutsAccorsingTerminalId/NXPAVMZLayout";
import NXPAVMZupdatedLayout from "../layoutsAccorsingTerminalId/NXPAVMZupdatedLayout";
import NXSWB1Layout from "../layoutsAccorsingTerminalId/NXSWB1Layout";
import MOAEDENB1layout from "../layoutsAccorsingTerminalId/MOAEDENB1layout";
import MOALUXLLlayout from "../layoutsAccorsingTerminalId/MOALUXLLlayout";
import MOAWEST2layout from "../layoutsAccorsingTerminalId/MOAWEST2layout";
import MOAEAST1layout from "../layoutsAccorsingTerminalId/MOAEAST1layout";
import FMCALIGFlayout from "../layoutsAccorsingTerminalId/FMCALIGFlayout";
import HLCALIGFlayout from "../layoutsAccorsingTerminalId/HLCALIGFlayout";
import NXSNKNB1layout from "../layoutsAccorsingTerminalId/NXSNKNB1layout";
import NXVCNB1layout from "../layoutsAccorsingTerminalId/NXVCNB1layout";
import NXVCJNRMlayout from "../layoutsAccorsingTerminalId/NXVCJNRMlayout";
import AHCEBGFlayout from "../layoutsAccorsingTerminalId/AHCEBGFlayout";
import AHCEB2Flayout from "../layoutsAccorsingTerminalId/AHCEB2Flayout";
import LULUHYDUGlayout from "../layoutsAccorsingTerminalId/LULUHYDUGlayout";
import CommonLayoutForAll from "../layoutsAccorsingTerminalId/CommonLayoutForAll";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="standard" {...props} />;
});

const ReleaseLock = (props) => {
  const locksMapping = {
    allLocks: lockers.ORN,
    seatNoA: ["S1", "S5", "S9", "S12", "L15", "L19"],
    seatNoB: ["S2", "S6", "QR", "L16", "L20"],
    seatNoC: ["M3", "M7", "L17", "L21"],
    seatNoD: ["S10", "S13", "XL18", "XL22"],
    seatNoE: ["M4", "M8", "M11", "M14"],
  };

  // const [terminalID, setTerminalID] = useState();

  // locks in the transaction details
  const [inProgressLocks, setInProgressLocks] = useState([]);
  const Auth = useAuth();

  const [releaseLockObject, setReleaseLockObject] = useState({
    PacketType: "releaselocker",
    MobileNo: "9900990099",
    terminalID: "",
    LockerNo: "",
    userId: Auth.user,
  });

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [selectedTerminalID, setSelectedTerminalID] = useState(null);

  const [isTerminalIdPresent, seIsTerminalIdPresent] = useState(true);
  const [openErrorAlert, setOpenErrorAlert] = useState(false);
  const [openWarningAlert, setOpenWarningAlert] = useState(false);

  const [tdTerminalIds, setTdTerminalIds] = useState([]);

  const userLogs = useLogDetails();

  const [state, setState] = useState({
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal } = state;

  const handleClose = () => {
    setOpen(false);
  };

  // asking admin wheather releaselock or uncondtionally open lock

  useEffect(() => {
    getTerminalIdsOfTransactionDetails();
  }, []);

  // useEffect(() => {
  //   getTerminalIdsOfTransactionDetails();
  // }, [props.appSwitchedTo]);

  const [serverPaths, setServePaths] = useState({
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

  useEffect(() => {
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

  // for selecting the lockers
  const userSelectedLockFun = (lock) => {
    if (lock !== "QR") {
      if (inProgressLocks.indexOf(lock) === -1) {
        setReleaseLockObject({
          ...releaseLockObject,
          LockerNo: lock,
        });
      }
    }
  };

  // const fetchUrl = "http://192.168.0.198:8080/AuroAutoLocker/SaveReleaseLocker";

  // const fetchTdLockers =
  //   "http://192.168.0.198:8080/AuroAutoLocker/FetchTransactionDetails";

  const getInProgressLocks = (terminalid) => {
    setLoading(true);
    const getLocksObj = {
      PacketType: "getprogresslock",
      terminalID: terminalid,
    };
    fetch(serverPaths.localAdminPath + "FetchTransactionDetails", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify(getLocksObj),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data.responseCode === "TDLOCK-200") {
          setInProgressLocks(data.LOCKERS);
        } else if (data.responseCode === "NOLOCK-201") {
          console.log("No locks present");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log("err : " + err);
        setLoading(false);
      });
  };

  // to get all ther terminalids from the present transaction details
  const getTerminalIdsOfTransactionDetails = () => {
    setLoading(true);
    const getLocksObj = {
      PacketType: "gettermid",
      type: "ALL",
    };
    fetch(serverPaths.localAdminPath + "FetchStates", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify(getLocksObj),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data.responseCode === "avltd-200") {
          setTdTerminalIds(data.terminalID);

          const termIdArr = data.terminalID[0].split(",");
          const termId = termIdArr[1].replace(/\s+g/, "").trim();

          setSelectedTerminalID(data.terminalID[0]);

          setReleaseLockObject({
            ...releaseLockObject,
            terminalID: termId,
          });
          if (data.terminalID[0]) {
            getInProgressLocks(termId);
          }
        } else if (data.responseCode === "notd-201") {
          alert("no terminalId in transaction details");
          seIsTerminalIdPresent(false);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log("err : " + err);
        setLoading(false);
      });
  };

  const sendReleaseLockToServer = () => {
    if (releaseLockObject.LockerNo === "") {
      setOpenWarningAlert(true);
    } else {
      setLoading(true);
      const serverObj = {
        ...releaseLockObject,
      };
      delete serverObj.userId;
      console.log(serverObj);

      fetch(serverPaths.serverUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: JSON.stringify(serverObj),
      })
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data);
          if (data.responseCode === "RALOP-200") {
            submitReleaseLock();
          } else if (data.responseCode === "RFLOP-201") {
            alert("something went wrong");
          }
          setLoading(false);
        })
        .catch((err) => {
          console.log("err : " + err);
          setLoading(false);
        });
    }
  };

  const submitReleaseLock = () => {
    fetch(serverPaths.localAdminPath + "SaveReleaseLocker", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify(releaseLockObject),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data.status === "success") {
          const userLog = {
            eventType: "releaseLock",
            remarks:
              "Release Lock of lockerNo : " +
              releaseLockObject.LockerNo +
              " Success from terminalID " +
              releaseLockObject.terminalID,
          };

          userLogs.storeUserLogs(userLog);
          setOpen(true);
        } else {
          const userLog = {
            eventType: "releaseLock",
            remarks:
              "Release Lock of " +
              releaseLockObject.LockerNo +
              "in terminalID " +
              releaseLockObject.terminalID +
              "is failed",
          };
          userLogs.storeUserLogs(userLog);
        }
        setOpen(true);
      })
      .catch((err) => {
        console.log("err : " + err);
        setLoading(false);
      });
  };

  const handleLoadingClose = () => {
    setLoading(false);
  };

  // to get the lockers from the selected terminal id
  const terminalIDHandler = (e, value) => {
    // setReleaseLockObject({
    //   ...releaseLockObject,
    //   terminalID: e.target.value,
    //   LockerNo: "",
    // });
    // getInProgressLocks(e.target.value);
    // alert(e.target.value);

    if (value !== null) {
      const termIdArr = value.split(",");
      const termId = termIdArr[1].replace(/\s+g/, "").trim();

      setSelectedTerminalID(value);

      setReleaseLockObject({
        ...releaseLockObject,
        terminalID: termId,
        LockerNo: "",
      });

      getInProgressLocks(termId);
      // alert(value);
    }
  };

  return (
    <div className="release-lock-container">
      <h2 className="page-title">Release Lock</h2>
      {isTerminalIdPresent ? (
        <>
          <div className="terminalId-dropdown-container">
            <Snackbar
              anchorOrigin={{ vertical, horizontal }}
              open={openErrorAlert}
              autoHideDuration={6000}
              onClose={() => {
                setOpenErrorAlert(false);
              }}
            >
              <Alert
                onClose={() => {
                  setOpenErrorAlert(false);
                }}
                severity="error"
              >
                Somthing went Wrong ! please try again
              </Alert>
            </Snackbar>

            <Snackbar
              anchorOrigin={{ vertical, horizontal }}
              open={openWarningAlert}
              autoHideDuration={6000}
              onClose={() => {
                setOpenWarningAlert(false);
              }}
            >
              <Alert
                onClose={() => {
                  setOpenWarningAlert(false);
                }}
                severity="warning"
              >
                Please Choose a Locker !
              </Alert>
            </Snackbar>

            <Box>
              <FormControl sx={{ m: 1, width: "80%" }} focused>
                {/* <InputLabel variant="standard " htmlFor="uncontrolled-native">
                  Choose terminalId
                </InputLabel>
                <NativeSelect
                  defaultValue={30}
                  inputProps={{
                    name: "Choose terminalId",
                    id: "uncontrolled-native",
                  }}
                  value={releaseLockObject.terminalID}
                  onChange={(e) => terminalIDHandler(e)}
                >
                  {tdTerminalIds.map((termID, index) => (
                    <option
                      className="option-container"
                      value={termID}
                      key={index}
                    >
                      {termID}
                    </option>
                  ))}
                </NativeSelect> */}

                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={tdTerminalIds}
                  value={selectedTerminalID}
                  sx={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Choose terminalId" />
                  )}
                  onChange={(e, value) => terminalIDHandler(e, value)}
                  focused
                />
              </FormControl>
            </Box>
          </div>

          {releaseLockObject.terminalID === "ORNLAYOUT" ? ( //  ORNLayout     AHCEB2Flayout
            <>
              <ORNLayout
                isMalfunction={false}
                lockersInUse={inProgressLocks}
                userSelectedLock={releaseLockObject.LockerNo}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
              <div className="releaselock-button-container">
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => sendReleaseLockToServer()}
                  fullWidth
                >
                  submit
                </Button>
              </div>
            </>
          ) : releaseLockObject.terminalID === "LULU" ? (
            <>
              <MOAEAST1layout
                isMalfunction={false}
                lockersInUse={inProgressLocks}
                userSelectedLock={releaseLockObject.LockerNo}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
              <div className="releaselock-button-container">
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => sendReleaseLockToServer()}
                  fullWidth
                >
                  submit
                </Button>
              </div>
            </>
          ) : releaseLockObject.terminalID === "PSITPL" ? (
            <>
              <GALLayout
                isMalfunction={false}
                lockersInUse={inProgressLocks}
                userSelectedLock={releaseLockObject.LockerNo}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
              <div className="releaselock-button-container">
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => sendReleaseLockToServer()}
                  fullWidth
                >
                  submit
                </Button>
              </div>
            </>
          ) : releaseLockObject.terminalID === "FALCON" ||
            releaseLockObject.terminalID === "G21" ||
            releaseLockObject.terminalID === "UPTOWN" ||
            releaseLockObject.terminalID === "LULUB2" ||
            releaseLockObject.terminalID === "NXWFLD" ||
            releaseLockObject.terminalID === "NXHYD1" ||
            releaseLockObject.terminalID === "ORN1" ||
            releaseLockObject.terminalID === "AMRHYD" ||
            releaseLockObject.terminalID === "DSLHYD1" ||
            releaseLockObject.terminalID === "LULUHYD" ||
            releaseLockObject.terminalID === "MJMJPN" ||
            releaseLockObject.terminalID === "ORNUTUB" ||
            releaseLockObject.terminalID === "HLCALIB2" ||
            releaseLockObject.terminalID === "GGCALILG" ||
            releaseLockObject.terminalID === "LULUB1" ? (
            <>
              <FalconUptownLulub2Layout
                isMalfunction={false}
                lockersInUse={inProgressLocks}
                userSelectedLock={releaseLockObject.LockerNo}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
              <div className="releaselock-button-container">
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => sendReleaseLockToServer()}
                  fullWidth
                >
                  submit
                </Button>
              </div>
            </>
          ) : releaseLockObject.terminalID === "NXFIZA" ||
            releaseLockObject.terminalID === "NCCMYS" ||
            releaseLockObject.terminalID === "GAL" ? (
            <>
              <NXSNKNlayout
                isMalfunction={false}
                lockersInUse={inProgressLocks}
                userSelectedLock={releaseLockObject.LockerNo}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
              <div className="releaselock-button-container">
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => sendReleaseLockToServer()}
                  fullWidth
                >
                  submit
                </Button>
              </div>
            </>
          ) : releaseLockObject.terminalID === "NEXUS" ? (
            <>
              <NexusLayout
                isMalfunction={false}
                lockersInUse={inProgressLocks}
                userSelectedLock={releaseLockObject.LockerNo}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
              <div className="releaselock-button-container">
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => sendReleaseLockToServer()}
                  fullWidth
                >
                  submit
                </Button>
              </div>
            </>
          ) : releaseLockObject.terminalID === "ORN2" ||
            releaseLockObject.terminalID === "FALCON1" ? (
            <>
              <ORN2Layout
                isMalfunction={false}
                lockersInUse={inProgressLocks}
                userSelectedLock={releaseLockObject.LockerNo}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
              <div className="releaselock-button-container">
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => sendReleaseLockToServer()}
                  fullWidth
                >
                  submit
                </Button>
              </div>
            </>
          ) : releaseLockObject.terminalID === "GARUDA" ? (
            <>
              <GarudaLayout
                isMalfunction={false}
                lockersInUse={inProgressLocks}
                userSelectedLock={releaseLockObject.LockerNo}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
              <div className="releaselock-button-container">
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => sendReleaseLockToServer()}
                  fullWidth
                >
                  submit
                </Button>
              </div>
            </>
          ) : releaseLockObject.terminalID === "NXSNKN" ? (
            <>
              <NXSNKNlayoutUpdate
                isMalfunction={false}
                lockersInUse={inProgressLocks}
                userSelectedLock={releaseLockObject.LockerNo}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
              <div className="releaselock-button-container">
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => sendReleaseLockToServer()}
                  fullWidth
                >
                  submit
                </Button>
              </div>
            </>
          ) : releaseLockObject.terminalID === "NXHYD2" ? (
            <>
              <NexusHyd2Layout
                isMalfunction={false}
                lockersInUse={inProgressLocks}
                userSelectedLock={releaseLockObject.LockerNo}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
              <div className="releaselock-button-container">
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => sendReleaseLockToServer()}
                  fullWidth
                >
                  submit
                </Button>
              </div>
            </>
          ) : releaseLockObject.terminalID === "PMCBB1" ||
            releaseLockObject.terminalID === "VEGCITB1" ? (
            <>
              <PMCBB1Layout
                isMalfunction={false}
                lockersInUse={inProgressLocks}
                userSelectedLock={releaseLockObject.LockerNo}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
              <div className="releaselock-button-container">
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => sendReleaseLockToServer()}
                  fullWidth
                >
                  submit
                </Button>
              </div>
            </>
          ) : releaseLockObject.terminalID === "MMBLR3" ||
            releaseLockObject.terminalID === "NXSNKNLG" ? (
            <>
              <MMBLR3Layout
                isMalfunction={false}
                lockersInUse={inProgressLocks}
                userSelectedLock={releaseLockObject.LockerNo}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
              <div className="releaselock-button-container">
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => sendReleaseLockToServer()}
                  fullWidth
                >
                  submit
                </Button>
              </div>
            </>
          ) : releaseLockObject.terminalID === "PMCCNGF" ||
            releaseLockObject.terminalID === "MOALPE" ||
            releaseLockObject.terminalID === "NXWESTG2" ? (
            <>
              <PMCCNGFLayout
                isMalfunction={false}
                lockersInUse={inProgressLocks}
                userSelectedLock={releaseLockObject.LockerNo}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
              <div className="releaselock-button-container">
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => sendReleaseLockToServer()}
                  fullWidth
                >
                  submit
                </Button>
              </div>
            </>
          ) : releaseLockObject.terminalID === "NXPAVMZ" ? (
            <>
              <NXPAVMZupdatedLayout
                isMalfunction={false}
                lockersInUse={inProgressLocks}
                userSelectedLock={releaseLockObject.LockerNo}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
              <div className="releaselock-button-container">
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => sendReleaseLockToServer()}
                  fullWidth
                >
                  submit
                </Button>
              </div>
            </>
          ) : releaseLockObject.terminalID === "NXSWLG" ? (
            <>
              <NXPAVMZLayout
                isMalfunction={false}
                lockersInUse={inProgressLocks}
                userSelectedLock={releaseLockObject.LockerNo}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
              <div className="releaselock-button-container">
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => sendReleaseLockToServer()}
                  fullWidth
                >
                  submit
                </Button>
              </div>
            </>
          ) : releaseLockObject.terminalID === "NXSWB1" ? (
            <>
              <NXSWB1Layout
                isMalfunction={false}
                lockersInUse={inProgressLocks}
                userSelectedLock={releaseLockObject.LockerNo}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
              <div className="releaselock-button-container">
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => sendReleaseLockToServer()}
                  fullWidth
                >
                  submit
                </Button>
              </div>
            </>
          ) : releaseLockObject.terminalID === "PMCCNBL" ||
            releaseLockObject.terminalID === "NXWESTUB" ||
            releaseLockObject.terminalID === "ELPROCST" ||
            releaseLockObject.terminalID === "ELPROCSL" ||
            releaseLockObject.terminalID === "NXSWUG" ||
            releaseLockObject.terminalID === "NXSW2F" ? (
            <>
              <PMCCNBLLayout
                isMalfunction={false}
                lockersInUse={inProgressLocks}
                userSelectedLock={releaseLockObject.LockerNo}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
              <div className="releaselock-button-container">
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => sendReleaseLockToServer()}
                  fullWidth
                >
                  submit
                </Button>
              </div>
            </>
          ) : releaseLockObject.terminalID === "MMBLR1" ||
            releaseLockObject.terminalID === "FORUMKOLG" ||
            releaseLockObject.terminalID === "DSLHYD2" ||
            releaseLockObject.terminalID === "NXVIJM" ||
            releaseLockObject.terminalID === "MMBLR2" ? (
            <>
              <MMBLR1Layout
                isMalfunction={false}
                lockersInUse={inProgressLocks}
                userSelectedLock={releaseLockObject.LockerNo}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
              <div className="releaselock-button-container">
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => sendReleaseLockToServer()}
                  fullWidth
                >
                  submit
                </Button>
              </div>
            </>
          ) : releaseLockObject.terminalID === "MOAEDENB1" ? (
            <>
              <MOAEDENB1layout
                isMalfunction={false}
                lockersInUse={inProgressLocks}
                userSelectedLock={releaseLockObject.LockerNo}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
              <div className="releaselock-button-container">
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => sendReleaseLockToServer()}
                  fullWidth
                >
                  submit
                </Button>
              </div>
            </>
          ) : releaseLockObject.terminalID === "MOALUXLL" ||
            releaseLockObject.terminalID === "MOAWEST1" ? (
            <>
              <MOALUXLLlayout
                isMalfunction={false}
                lockersInUse={inProgressLocks}
                userSelectedLock={releaseLockObject.LockerNo}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
              <div className="releaselock-button-container">
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => sendReleaseLockToServer()}
                  fullWidth
                >
                  submit
                </Button>
              </div>
            </>
          ) : releaseLockObject.terminalID === "MOAWEST2" ||
            releaseLockObject.terminalID === "LULUHYDLG" ? (
            <>
              <MOAWEST2layout
                isMalfunction={false}
                lockersInUse={inProgressLocks}
                userSelectedLock={releaseLockObject.LockerNo}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
              <div className="releaselock-button-container">
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => sendReleaseLockToServer()}
                  fullWidth
                >
                  submit
                </Button>
              </div>
            </>
          ) : releaseLockObject.terminalID === "MOAEAST1" ? (
            <>
              <MOAEAST1layout
                isMalfunction={false}
                lockersInUse={inProgressLocks}
                userSelectedLock={releaseLockObject.LockerNo}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
              <div className="releaselock-button-container">
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => sendReleaseLockToServer()}
                  fullWidth
                >
                  submit
                </Button>
              </div>
            </>
          ) : releaseLockObject.terminalID === "FMCALIGF" ? (
            <>
              <FMCALIGFlayout
                isMalfunction={false}
                lockersInUse={inProgressLocks}
                userSelectedLock={releaseLockObject.LockerNo}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
              <div className="releaselock-button-container">
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => sendReleaseLockToServer()}
                  fullWidth
                >
                  submit
                </Button>
              </div>
            </>
          ) : releaseLockObject.terminalID === "NXSNKNB1" ? (
            <>
              <NXSNKNB1layout
                isMalfunction={false}
                lockersInUse={inProgressLocks}
                userSelectedLock={releaseLockObject.LockerNo}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
              <div className="releaselock-button-container">
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => sendReleaseLockToServer()}
                  fullWidth
                >
                  submit
                </Button>
              </div>
            </>
          ) : releaseLockObject.terminalID === "HLCALIGF" ? (
            <>
              <HLCALIGFlayout
                isMalfunction={false}
                lockersInUse={inProgressLocks}
                userSelectedLock={releaseLockObject.LockerNo}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
              <div className="releaselock-button-container">
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => sendReleaseLockToServer()}
                  fullWidth
                >
                  submit
                </Button>
              </div>
            </>
          ) : releaseLockObject.terminalID === "NXVCNB1" ? (
            <>
              <NXVCNB1layout
                isMalfunction={false}
                lockersInUse={inProgressLocks}
                userSelectedLock={releaseLockObject.LockerNo}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
              <div className="releaselock-button-container">
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => sendReleaseLockToServer()}
                  fullWidth
                >
                  submit
                </Button>
              </div>
            </>
          ) : releaseLockObject.terminalID === "NXVCJNRM" ||
            releaseLockObject.terminalID === "NXVCARCR" ? (
            <>
              <NXVCJNRMlayout
                isMalfunction={false}
                lockersInUse={inProgressLocks}
                userSelectedLock={releaseLockObject.LockerNo}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
              <div className="releaselock-button-container">
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => sendReleaseLockToServer()}
                  fullWidth
                >
                  submit
                </Button>
              </div>
            </>
          ) : releaseLockObject.terminalID === "AHCEBGF" ? (
            <>
              <AHCEBGFlayout
                isMalfunction={false}
                lockersInUse={inProgressLocks}
                userSelectedLock={releaseLockObject.LockerNo}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
              <div className="releaselock-button-container">
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => sendReleaseLockToServer()}
                  fullWidth
                >
                  submit
                </Button>
              </div>
            </>
          ) : releaseLockObject.terminalID === "AHCEB2F" ? (
            <>
              <AHCEB2Flayout
                isMalfunction={false}
                lockersInUse={inProgressLocks}
                userSelectedLock={releaseLockObject.LockerNo}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
              <div className="releaselock-button-container">
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => sendReleaseLockToServer()}
                  fullWidth
                >
                  submit
                </Button>
              </div>
            </>
          ) : releaseLockObject.terminalID === "LULUHYDUG" ? (
            <>
              <LULUHYDUGlayout
                isMalfunction={false}
                lockersInUse={inProgressLocks}
                userSelectedLock={releaseLockObject.LockerNo}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
              <div className="releaselock-button-container">
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => sendReleaseLockToServer()}
                  fullWidth
                >
                  submit
                </Button>
              </div>
            </>
          ) : (
            <>
              <CommonLayoutForAll
                isMalfunction={false}
                terminalID={releaseLockObject.terminalID}
                lockersInUse={inProgressLocks}
                userSelectedLock={releaseLockObject.LockerNo}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
              <div className="releaselock-button-container">
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => sendReleaseLockToServer()}
                  fullWidth
                >
                  submit
                </Button>
              </div>

              {/* <p className="text-paragraph">
                No Layout For the Selected Terminal Id Please Select the valid
                Terminal Id
              </p> */}
            </>
          )}

          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {releaseLockObject.LockerNo + " is released Successfully"}
            </DialogTitle>
            <DialogActions>
              <Button onClick={handleClose}>ok</Button>
            </DialogActions>
          </Dialog>

          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
            onClick={() => handleLoadingClose()}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </>
      ) : (
        <h2>No active Terminal Id's are present currently. Try again</h2>
      )}
    </div>
  );
};

export default ReleaseLock;
