import React from "react";
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
import { useState } from "react";
import { useEffect } from "react";
import "./malfunctionLocks.css";
import CommonLayoutJSON from "../../GlobalVariable/CommonLockersJSON.json";

import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  TextField,
} from "@mui/material";

import { useAuth } from "../../utils/Auth";
import GALLayout from "../layoutsAccorsingTerminalId/GALLayout";
import FalconUptonLulub2 from "../layoutsAccorsingTerminalId/FalconUptownLulub2Layout";
import GarudaLayout from "../layoutsAccorsingTerminalId/GarudaLayout";
import NexusLayout from "../layoutsAccorsingTerminalId/NexusLayout";
import { useLogDetails } from "../../utils/UserLogDetails";
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
import HLCALIGFlayout from "../layoutsAccorsingTerminalId/HLCALIGFlayout";
import FMCALIGFlayout from "../layoutsAccorsingTerminalId/FMCALIGFlayout";
import MOAEAST1layout from "../layoutsAccorsingTerminalId/MOAEAST1layout";
import MOAWEST2layout from "../layoutsAccorsingTerminalId/MOAWEST2layout";
import MOALUXLLlayout from "../layoutsAccorsingTerminalId/MOALUXLLlayout";
import MOAEDENB1layout from "../layoutsAccorsingTerminalId/MOAEDENB1layout";
import NXSNKNB1layout from "../layoutsAccorsingTerminalId/NXSNKNB1layout";
import NXVCNB1layout from "../layoutsAccorsingTerminalId/NXVCNB1layout";
import NXVCJNRMlayout from "../layoutsAccorsingTerminalId/NXVCJNRMlayout";
import AHCEBGFlayout from "../layoutsAccorsingTerminalId/AHCEBGFlayout";
import AHCEB2Flayout from "../layoutsAccorsingTerminalId/AHCEB2Flayout";
import CommonLayoutForAll from "../layoutsAccorsingTerminalId/CommonLayoutForAll";
import LULUHYDUGlayout from "../layoutsAccorsingTerminalId/LULUHYDUGlayout";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="standard" {...props} />;
});

const MalfunctionLockers = (props) => {
  const [submitBtnHeight, setSubmitBtnHeight] = useState(400);

  const Auth = useAuth();
  const [malfunctionLocksObj, setMalfunctionLoksObj] = useState({
    PacketType: "getmalflocks",
    lockType: "",
    LockerNo: "",
    terminalID: "",
    userName: Auth.user,
  });

  const [selectedTerminalID, setSelectedTerminalID] = useState(null);

  const [openAddMalfun, setOpenAddMalfun] = useState(false);
  const [openRemMalfun, setOpenRemMalfun] = useState(false);

  const [loading, setLoading] = useState(false);
  const [lockerNo, setLockerNo] = useState();

  const [malfucntionLocks, setMalfunctionLocks] = useState([]);

  const [openErrorAlert, setOpenErrorAlert] = useState(false);
  const [lockerWarning, setLockerWarning] = useState(false);
  const [mobileNumberWarning, setMobileNumberWarning] = useState(false);
  const [openSuccessAlert, setOpenSuccessAlert] = useState(false);

  const userLogs = useLogDetails();
  const [state, setState] = useState({
    vertical: "top",
    horizontal: "center",
  });

  const { vertical, horizontal } = state;

  const [terminalIds, setTdTerminalIds] = useState([]);

  // useEffect(() => {
  //   getTerminalIdsOfTransactionDetails();
  // }, []);

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

  const handleClose = () => {
    setOpenAddMalfun(false);

    setOpenRemMalfun(false);
  };

  // to get all ther terminalids from the present transaction details

  const getTerminalIdsOfTransactionDetails = () => {
    setLoading(true);
    const getLocksObj = {
      PacketType: "gettermid",
      type: "ALL",
    };
    // fetch(urlPath.localServerPath + "FetchTransactionDetails", {
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

          // setTdTerminalIds(data.terminalID);

          setSelectedTerminalID(data.terminalID[0]);

          const termIdArr = data.terminalID[0].split(",");
          const termId = termIdArr[1].replace(/\s+g/, "").trim();

          if (data.terminalID[0]) {
            setMalfunctionLoksObj({
              ...malfunctionLocksObj,
              terminalID: termId,
            });

            setSubmitBtnHeight(CommonLayoutJSON[termId].noofrows * 100);

            getMalfunctionLockers(termId);
          }
        } else if (data.responseCode === "notd-201") {
          // alert("no terminalId in transaction details");
        }
        setLoading(false);
      })

      .catch((err) => {
        console.log("err : " + err);
        setLoading(false);
      });
  };

  const terminalIDHandler = (e, value) => {
    // setMalfunctionLoksObj({
    //   ...malfunctionLocksObj,
    //   terminalID: e.target.value,
    //   LockerNo: "",
    // });
    // getMalfunctionLockers(e.target.value);
    // // getInProgressLocks(e.target.value);

    if (value !== null) {
      const termIdArr = value.split(",");
      const termId = termIdArr[1].replace(/\s+g/, "").trim();

      setSelectedTerminalID(value);

      setMalfunctionLoksObj({
        ...malfunctionLocksObj,
        terminalID: termId,
        LockerNo: "",
      });

      getMalfunctionLockers(termId);
    }
  };

  const getMalfunctionLockers = (terminalId) => {
    const getMulfunctionLockers = {
      PacketType: malfunctionLocksObj.PacketType,
      terminalID: terminalId,
    };

    fetch(serverPaths.localAdminPath + "FetchMalfunctioningLocks", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify(getMulfunctionLockers),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data.responseCode === "mallocks") {
          setMalfunctionLocks(data.mlocks);
        } else if (data.responseCode === "nolocks") {
          setMalfunctionLocks([]);
        }
      })

      .catch((err) => {
        console.log("err : " + err);
      });
  };

  //To send this locker to the server

  const sendMalfunctionLockoServer = () => {
    setLoading(true);

    if (malfunctionLocksObj.LockerNo === "") {
      alert("please Choose a locker");
    } else if (malfunctionLocksObj.lockType === "") {
      alert("please enter the type");
    } else {
      const malFunObj = {
        PacketType:
          malfunctionLocksObj.lockType === "block"
            ? "blocklocker"
            : "unblocklocker",
        LockerNo: malfunctionLocksObj.LockerNo,
        terminalID: malfunctionLocksObj.terminalID,
      };

      console.log(malFunObj);

      fetch(serverPaths.serverUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: JSON.stringify(malFunObj),
      })
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data);
          if (
            data.responseCode === "BLCOKER-200" ||
            data.responseCode === "UBLCOKER-200"
          ) {
            storeMalfunctionLocker(malFunObj);
            setLoading(false);
          } else if (
            data.responseCode === "BLCOKER-201" ||
            data.responseCode === "UBLCOKER-201"
          ) {
            setOpenErrorAlert(true);
            setLoading(false);
          } else {
            setOpenErrorAlert(true);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log("err : " + err);
          setLoading(false);
        });
    }
  };

  const storeMalfunctionLocker = (malFunctionObj) => {
    if (malfunctionLocksObj.LockerNo === "") {
      alert("please Choose a locker");
    } else if (malfunctionLocksObj.lockType === "") {
      alert("please enter the type");
    } else {
      const malFunObj = {
        ...malFunctionObj,
        userName: malfunctionLocksObj.userName,
      };
      console.log("----- storing in db --------");
      console.log(malFunObj);

      fetch(serverPaths.localAdminPath + "FetchMalfunctioningLocks", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: JSON.stringify(malFunObj),
      })
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data);
          if (data.responseCode === "strmalfun") {
            // fetchDataInDatabase();

            const userLog = {
              eventType: "addMalFunction",
              remarks:
                malfunctionLocksObj.LockerNo +
                " is added as malfunction from terminalID " +
                malfunctionLocksObj.terminalID,
            };

            userLogs.storeUserLogs(userLog);
            setLockerNo(malfunctionLocksObj.LockerNo);
            setMalfunctionLoksObj({
              ...malfunctionLocksObj,
              LockerNo: "",
              lockType: "",
            });
            getMalfunctionLockers(malfunctionLocksObj.terminalID);
            setOpenAddMalfun(true);
            setOpenSuccessAlert(true);
          } else if (data.responseCode === "remmalfun") {
            // fetchDataInDatabase();

            const userLog = {
              eventType: "remMalFunction",
              remarks:
                malfunctionLocksObj.LockerNo +
                " is removed as malfunction from terminalID " +
                malfunctionLocksObj.terminalID,
            };

            userLogs.storeUserLogs(userLog);

            setLockerNo(malfunctionLocksObj.LockerNo);
            setMalfunctionLoksObj({
              ...malfunctionLocksObj,
              LockerNo: "",
              lockType: "",
            });
            getMalfunctionLockers(malfunctionLocksObj.terminalID);
            setOpenRemMalfun(true);
            setOpenSuccessAlert(true);
          } else {
            setOpenErrorAlert(true);
          }
        })
        .catch((err) => {
          console.log("err : " + err);
          setOpenErrorAlert(true);
          setLoading(false);
        });
    }
  };

  const userSelectedLockFun = (lock) => {
    if (lock !== "QR") {
      setMalfunctionLoksObj({
        ...malfunctionLocksObj,
        LockerNo: lock,
        lockType: "",
      });
    }
  };

  const malfunctionStatusHandler = (type) => {
    setMalfunctionLoksObj({
      ...malfunctionLocksObj,
      lockType: type,
    });
  };

  return (
    <div className="malfunction-cotnainer">
      <h2 className="page-title">Malfunction Lockers</h2>
      <div className="terminalId-dropdown-container">
        <Box sx={{ width: "100%" }}>
          {/* <Collapse in={openErrorAlert}>
          <Alert severity="error" onClose={() => {setOpenErrorAlert(false)}}>Somthing went Wrong ! please try again</Alert>
        </Collapse>

        <Collapse in={lockerWarning}>
          <Alert severity="warning" onClose={() => {setLockerWarning(false)}}> Please Choose a Locker ! </Alert>
        </Collapse>

        <Collapse in={mobileNumberWarning}>
          <Alert severity="warning" onClose={() => {setMobileNumberWarning(false)}}>Please provide Valid mobile Number !</Alert>
        </Collapse>     

        <Collapse in={openSuccessAlert}>
          <Alert severity="success" onClose={() => {setOpenSuccessAlert(false)}}>This is a success alert — check it out!</Alert>
        </Collapse> */}

          <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={lockerWarning}
            autoHideDuration={6000}
            onClose={() => {
              setLockerWarning(false);
            }}
          >
            <Alert
              onClose={() => {
                setLockerWarning(false);
              }}
              severity="warning"
            >
              Please Choose a Locker !
            </Alert>
          </Snackbar>

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
            open={mobileNumberWarning}
            autoHideDuration={6000}
            onClose={() => {
              setMobileNumberWarning(false);
            }}
          ></Snackbar>

          <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={openSuccessAlert}
            autoHideDuration={6000}
            onClose={() => {
              setOpenSuccessAlert(false);
            }}
          >
            <Alert
              onClose={() => {
                setOpenSuccessAlert(false);
              }}
              severity="success"
            >
              malfunction operation is success !
            </Alert>
          </Snackbar>
        </Box>

        <Box>
          <FormControl sx={{ m: 1 }} focused fullWidth>
            {/* <InputLabel variant="standard " htmlFor="uncontrolled-native">
              Choose terminalId
            </InputLabel>
            <NativeSelect
              defaultValue={30}
              inputProps={{
                name: "Choose terminalId",
                id: "uncontrolled-native",
              }}
              value={malfunctionLocksObj.terminalID}
              onChange={(e) => terminalIDHandler(e)}
            >
              {terminalIds.map((termID, index) => (
                <option className="option-container" value={termID} key={index}>
                  {termID}
                </option>
              ))}
            </NativeSelect> */}

            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={terminalIds}
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

      {malfunctionLocksObj.terminalID === "ORN" ? ( //  ORNLayout  AHCEB2Flayout
        <>
          <ORNLayout
            isMalfunction={true}
            lockersInUse={malfucntionLocks}
            userSelectedLock={malfunctionLocksObj.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
            malfunctionTypeHandler={malfunctionStatusHandler.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendMalfunctionLockoServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : malfunctionLocksObj.terminalID === "LULU" ? (
        <>
          <LULULayout
            isMalfunction={true}
            lockersInUse={malfucntionLocks}
            userSelectedLock={malfunctionLocksObj.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
            malfunctionTypeHandler={malfunctionStatusHandler.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendMalfunctionLockoServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : malfunctionLocksObj.terminalID === "PSITPL" ? (
        <>
          <GALLayout
            isMalfunction={true}
            lockersInUse={malfucntionLocks}
            userSelectedLock={malfunctionLocksObj.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
            malfunctionTypeHandler={malfunctionStatusHandler.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendMalfunctionLockoServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : malfunctionLocksObj.terminalID === "FALCON" ||
        malfunctionLocksObj.terminalID === "G21" ||
        malfunctionLocksObj.terminalID === "UPTOWN" ||
        malfunctionLocksObj.terminalID === "NXWFLD" ||
        malfunctionLocksObj.terminalID === "LULUB2" ||
        malfunctionLocksObj.terminalID === "MJMJPN" ||
        malfunctionLocksObj.terminalID === "NXHYD1" ||
        malfunctionLocksObj.terminalID === "ORN1" ||
        malfunctionLocksObj.terminalID === "AMRHYD" ||
        malfunctionLocksObj.terminalID === "DSLHYD1" ||
        malfunctionLocksObj.terminalID === "HLCALIB2" ||
        malfunctionLocksObj.terminalID === "GGCALILG" ||
        malfunctionLocksObj.terminalID === "LULUHYD" ||
        malfunctionLocksObj.terminalID === "ORNUTUB" ||
        // malfunctionLocksObj.terminalID === "DECATHLON" ||
        malfunctionLocksObj.terminalID === "LULUB1" ? (
        <>
          <FalconUptonLulub2
            isMalfunction={true}
            lockersInUse={malfucntionLocks}
            userSelectedLock={malfunctionLocksObj.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
            malfunctionTypeHandler={malfunctionStatusHandler.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendMalfunctionLockoServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : malfunctionLocksObj.terminalID === "NXSNKN" ? (
        <>
          <NXSNKNlayoutUpdate
            isMalfunction={true}
            lockersInUse={malfucntionLocks}
            userSelectedLock={malfunctionLocksObj.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
            malfunctionTypeHandler={malfunctionStatusHandler.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendMalfunctionLockoServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : malfunctionLocksObj.terminalID === "ORN2" ||
        malfunctionLocksObj.terminalID === "FALCON1" ? (
        <>
          <ORN2Layout
            isMalfunction={true}
            lockersInUse={malfucntionLocks}
            userSelectedLock={malfunctionLocksObj.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
            malfunctionTypeHandler={malfunctionStatusHandler.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendMalfunctionLockoServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : malfunctionLocksObj.terminalID === "NXFIZA" ||
        malfunctionLocksObj.terminalID === "NCCMYS" ||
        malfunctionLocksObj.terminalID === "GAL" ? (
        <>
          <NXSNKNlayout
            isMalfunction={true}
            lockersInUse={malfucntionLocks}
            userSelectedLock={malfunctionLocksObj.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
            malfunctionTypeHandler={malfunctionStatusHandler.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendMalfunctionLockoServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : malfunctionLocksObj.terminalID === "MMBLR3" ? (
        <>
          <MMBLR3Layout
            isMalfunction={true}
            lockersInUse={malfucntionLocks}
            userSelectedLock={malfunctionLocksObj.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
            malfunctionTypeHandler={malfunctionStatusHandler.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendMalfunctionLockoServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : malfunctionLocksObj.terminalID === "GARUDA" ? (
        <>
          <GarudaLayout
            isMalfunction={true}
            lockersInUse={malfucntionLocks}
            userSelectedLock={malfunctionLocksObj.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
            malfunctionTypeHandler={malfunctionStatusHandler.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendMalfunctionLockoServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : malfunctionLocksObj.terminalID === "NEXUS" ? (
        <>
          <NexusLayout
            isMalfunction={true}
            lockersInUse={malfucntionLocks}
            userSelectedLock={malfunctionLocksObj.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
            malfunctionTypeHandler={malfunctionStatusHandler.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendMalfunctionLockoServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : malfunctionLocksObj.terminalID === "NXHYD2" ? (
        <>
          <NexusHyd2Layout
            isMalfunction={true}
            lockersInUse={malfucntionLocks}
            userSelectedLock={malfunctionLocksObj.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
            malfunctionTypeHandler={malfunctionStatusHandler.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendMalfunctionLockoServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : malfunctionLocksObj.terminalID === "MMBLR1" ||
        malfunctionLocksObj.terminalID === "DSLHYD2" ||
        malfunctionLocksObj.terminalID === "FORUMKOLG" ||
        malfunctionLocksObj.terminalID === "NXVIJM" ||
        malfunctionLocksObj.terminalID === "MMBLR2" ? (
        <>
          <MMBLR1Layout
            isMalfunction={true}
            lockersInUse={malfucntionLocks}
            userSelectedLock={malfunctionLocksObj.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
            malfunctionTypeHandler={malfunctionStatusHandler.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendMalfunctionLockoServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : malfunctionLocksObj.terminalID === "PMCBB1" ||
        malfunctionLocksObj.terminalID === "VEGCITB1" ? (
        <>
          <PMCBB1Layout
            isMalfunction={true}
            lockersInUse={malfucntionLocks}
            userSelectedLock={malfunctionLocksObj.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
            malfunctionTypeHandler={malfunctionStatusHandler.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendMalfunctionLockoServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : malfunctionLocksObj.terminalID === "NXSNKNLG" ? (
        <>
          <MMBLR3Layout
            isMalfunction={true}
            lockersInUse={malfucntionLocks}
            userSelectedLock={malfunctionLocksObj.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
            malfunctionTypeHandler={malfunctionStatusHandler.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendMalfunctionLockoServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : malfunctionLocksObj.terminalID === "NXPAVMZ" ? (
        <>
          <NXPAVMZupdatedLayout
            isMalfunction={true}
            lockersInUse={malfucntionLocks}
            userSelectedLock={malfunctionLocksObj.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
            malfunctionTypeHandler={malfunctionStatusHandler.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendMalfunctionLockoServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : malfunctionLocksObj.terminalID === "NXSWLG" ? (
        <>
          <NXPAVMZLayout
            isMalfunction={true}
            lockersInUse={malfucntionLocks}
            userSelectedLock={malfunctionLocksObj.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
            malfunctionTypeHandler={malfunctionStatusHandler.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendMalfunctionLockoServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : malfunctionLocksObj.terminalID === "NXSWB1" ? (
        <>
          <NXSWB1Layout
            isMalfunction={true}
            lockersInUse={malfucntionLocks}
            userSelectedLock={malfunctionLocksObj.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
            malfunctionTypeHandler={malfunctionStatusHandler.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendMalfunctionLockoServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : malfunctionLocksObj.terminalID === "PMCCNGF" ||
        malfunctionLocksObj.terminalID === "MOALPE" ||
        malfunctionLocksObj.terminalID === "NXWESTG2" ? (
        <>
          <PMCCNGFLayout
            isMalfunction={true}
            lockersInUse={malfucntionLocks}
            userSelectedLock={malfunctionLocksObj.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
            malfunctionTypeHandler={malfunctionStatusHandler.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendMalfunctionLockoServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : malfunctionLocksObj.terminalID === "PMCCNBL" ||
        malfunctionLocksObj.terminalID === "NXWESTUB" ||
        malfunctionLocksObj.terminalID === "ELPROCST" ||
        malfunctionLocksObj.terminalID === "ELPROCSL" ||
        malfunctionLocksObj.terminalID === "NXSW2F" ||
        malfunctionLocksObj.terminalID === "NXSWUG" ? (
        <>
          <PMCCNBLLayout
            isMalfunction={true}
            lockersInUse={malfucntionLocks}
            userSelectedLock={malfunctionLocksObj.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
            malfunctionTypeHandler={malfunctionStatusHandler.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendMalfunctionLockoServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : malfunctionLocksObj.terminalID === "MOAEDENB1" ? (
        <>
          <MOAEDENB1layout
            isMalfunction={true}
            lockersInUse={malfucntionLocks}
            userSelectedLock={malfunctionLocksObj.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
            malfunctionTypeHandler={malfunctionStatusHandler.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendMalfunctionLockoServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : malfunctionLocksObj.terminalID === "MOALUXLL" ||
        malfunctionLocksObj.terminalID === "MOAWEST1" ? (
        <>
          <MOALUXLLlayout
            isMalfunction={true}
            lockersInUse={malfucntionLocks}
            userSelectedLock={malfunctionLocksObj.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
            malfunctionTypeHandler={malfunctionStatusHandler.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendMalfunctionLockoServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : malfunctionLocksObj.terminalID === "MOAWEST2" ||
        malfunctionLocksObj.terminalID === "LULUHYDLG" ? (
        <>
          <MOAWEST2layout
            isMalfunction={true}
            lockersInUse={malfucntionLocks}
            userSelectedLock={malfunctionLocksObj.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
            malfunctionTypeHandler={malfunctionStatusHandler.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendMalfunctionLockoServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : malfunctionLocksObj.terminalID === "MOAEAST1" ? (
        <>
          <MOAEAST1layout
            isMalfunction={true}
            lockersInUse={malfucntionLocks}
            userSelectedLock={malfunctionLocksObj.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
            malfunctionTypeHandler={malfunctionStatusHandler.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendMalfunctionLockoServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : malfunctionLocksObj.terminalID === "FMCALIGF" ? (
        <>
          <FMCALIGFlayout
            isMalfunction={true}
            lockersInUse={malfucntionLocks}
            userSelectedLock={malfunctionLocksObj.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
            malfunctionTypeHandler={malfunctionStatusHandler.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendMalfunctionLockoServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : malfunctionLocksObj.terminalID === "NXSNKNB1" ? (
        <>
          <NXSNKNB1layout
            isMalfunction={true}
            lockersInUse={malfucntionLocks}
            userSelectedLock={malfunctionLocksObj.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
            malfunctionTypeHandler={malfunctionStatusHandler.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendMalfunctionLockoServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : malfunctionLocksObj.terminalID === "HLCALIGF" ? (
        <>
          <HLCALIGFlayout
            isMalfunction={true}
            lockersInUse={malfucntionLocks}
            userSelectedLock={malfunctionLocksObj.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
            malfunctionTypeHandler={malfunctionStatusHandler.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendMalfunctionLockoServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : malfunctionLocksObj.terminalID === "NXVCNB1" ? (
        <>
          <NXVCNB1layout
            isMalfunction={true}
            lockersInUse={malfucntionLocks}
            userSelectedLock={malfunctionLocksObj.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
            malfunctionTypeHandler={malfunctionStatusHandler.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendMalfunctionLockoServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : malfunctionLocksObj.terminalID === "NXVCJNRM" ||
        malfunctionLocksObj.terminalID === "NXVCARCR" ? (
        <>
          <NXVCJNRMlayout
            isMalfunction={true}
            lockersInUse={malfucntionLocks}
            userSelectedLock={malfunctionLocksObj.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
            malfunctionTypeHandler={malfunctionStatusHandler.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendMalfunctionLockoServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : malfunctionLocksObj.terminalID === "AHCEBGF" ? (
        <>
          <AHCEBGFlayout
            isMalfunction={true}
            lockersInUse={malfucntionLocks}
            userSelectedLock={malfunctionLocksObj.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
            malfunctionTypeHandler={malfunctionStatusHandler.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendMalfunctionLockoServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : malfunctionLocksObj.terminalID === "AHCEB2F" ? (
        <>
          <AHCEB2Flayout
            isMalfunction={true}
            lockersInUse={malfucntionLocks}
            userSelectedLock={malfunctionLocksObj.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
            malfunctionTypeHandler={malfunctionStatusHandler.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendMalfunctionLockoServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : malfunctionLocksObj.terminalID === "LULUHYDUG" ? (
        <>
          <LULUHYDUGlayout
            isMalfunction={true}
            lockersInUse={malfucntionLocks}
            userSelectedLock={malfunctionLocksObj.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
            malfunctionTypeHandler={malfunctionStatusHandler.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendMalfunctionLockoServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : (
        <>
          <CommonLayoutForAll
            terminalID={malfunctionLocksObj.terminalID}
            isMalfunction={true}
            lockersInUse={malfucntionLocks}
            userSelectedLock={malfunctionLocksObj.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
            malfunctionTypeHandler={malfunctionStatusHandler.bind(this)}
          />

          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendMalfunctionLockoServer()}
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

      {/* <div className="releaselock-button-container">
        <Button
          variant="contained"
          color="info"
          onClick={() => sendReleaseLockToServer()}
          fullWidth
        >
          submit
        </Button>
      </div> */}

      <Dialog
        open={openAddMalfun}
        // onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {lockerNo + " set as malfunction"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>ok</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openRemMalfun}
        // onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {lockerNo + " is removed from malfunction status"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>ok</Button>
        </DialogActions>
      </Dialog>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
        onClick={() => handleClose()}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default MalfunctionLockers;
