import React, { useEffect, useState } from "react";
import { Autocomplete, Button, TextField } from "@mui/material";
// import "./releaseLock.css";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import urlPath from "../../GlobalVariable/urlPath.json";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";

import FormControl from "@mui/material/FormControl";

import NativeSelect from "@mui/material/NativeSelect";

// import Alert from "@mui/material/Alert";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import pathUrl from "../../GlobalVariable/urlPath.json";
import ORNLayout from "../layoutsAccorsingTerminalId/ORNLayout";
import LULULayout from "../layoutsAccorsingTerminalId/LULULayout";
import GALLayout from "../layoutsAccorsingTerminalId/GALLayout";
import { useLogDetails } from "../../utils/UserLogDetails";
import FalconUptownLulub2Layout from "../layoutsAccorsingTerminalId/FalconUptownLulub2Layout";
import GarudaLayout from "../layoutsAccorsingTerminalId/GarudaLayout";
import NexusLayout from "../layoutsAccorsingTerminalId/NexusLayout";
import NXSNKNlayout from "../layoutsAccorsingTerminalId/NXSNKNlayout";
import NXSNKNlayoutUpdate from "../layoutsAccorsingTerminalId/NXSNKNlayoutUpdate";
import NexusHyd2Layout from "../layoutsAccorsingTerminalId/NexusHyd2Layout";
import MMBLR1Layout from "../layoutsAccorsingTerminalId/MMBLR1Layout";
import ORN2Layout from "../layoutsAccorsingTerminalId/ORN2Layout";

import {
  decryptAES,
  encryptAES,
  lockopenMobileNumber,
} from "../../GlobalVariable/GlobalModule";
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
import LULUHYDUGlayout from "../layoutsAccorsingTerminalId/LULUHYDUGlayout";
import CommonLayoutForAll from "../layoutsAccorsingTerminalId/CommonLayoutForAll";
import { useAuth } from "../../utils/Auth";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="standard" {...props} />;
});

const UnconditionalLockerOpen = (props) => {
  // const [terminalID, setTerminalID] = useState();
  // locks in the transaction details

  const [unconditionalLockObject, setUnconditionalLockObject] = useState({
    // MobileNo: props.viaSms ? lockopenMobileNumber : "",
    MobileNo: "",
    terminalID: "",
    PacketType: "uncndopenlock",
    // LockerNo: "",
    LockerNo: [],
  });

  const Auth = useAuth();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [selectedTerminalID, setSelectedTerminalID] = useState(null);

  const [openErrorAlert, setOpenErrorAlert] = useState(false);
  const [lockerWarning, setLockerWarning] = useState(false);
  const [mobileNumberWarning, setMobileNumberWarning] = useState(false);
  const [openSuccessAlert, setOpenSuccessAlert] = useState(false);

  const [state, setState] = useState({
    vertical: "top",
    horizontal: "center",
  });

  const { vertical, horizontal } = state;

  const [terminalIds, setTdTerminalIds] = useState([]);

  const userLogs = useLogDetails();

  // before

  // useEffect(() => {
  //   getTerminalIdsOfTransactionDetails();
  // }, []);

  // changed after

  useEffect(() => {
    getTerminalIdsOfTransactionDetails();
  }, []);

  // useEffect(() => {
  //   getTerminalIdsOfTransactionDetails();
  // }, [props.appSwitchedTo]);

  const handleClose = () => {
    setOpen(false);
  };

  // asking admin wheather releaselock or uncondtionally open lock

  // for selecting the lockers
  const userSelectedLockFun = (lock) => {
    let selectedLockArr = [...unconditionalLockObject.LockerNo];
    console.log(typeof lock);

    if (!selectedLockArr.includes(lock)) {
      selectedLockArr.push(lock);
    } else {
      const index = selectedLockArr.indexOf(lock);
      console.log(selectedLockArr.indexOf(lock));
      selectedLockArr.splice(index, 1);
    }

    if (lock !== "QR") {
      setUnconditionalLockObject({
        ...unconditionalLockObject,
        // LockerNo: lock,
        LockerNo: [...selectedLockArr],
      });
    }
  };

  // const fetchUrl = "http://192.168.0.198:8080/AuroAutoLocker/SaveReleaseLocker";

  // const fetchTdLockers =
  //   "http://192.168.0.198:8080/AuroAutoLocker/FetchTransactionDetails";

  // to get all ther terminalids from the present transaction details

  const openLockViaSms = (openLockViaSmsObj) => {
    
    fetch(Auth.serverPaths.localAdminPath + "LockerOperationViaSms", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify(openLockViaSmsObj),
    })
      .then((data) => data.json())
      .then((data) => {
        console.log(data);
        if (data.responseCode === "success") {
          storeUncoditionalOpenLocks();
        } else {
          setOpenErrorAlert(true);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log("err -- " + err);
        setOpenErrorAlert(true);
        setLoading(false);
      });
  };

  const sendUnconditionLockOpenToServer = () => {
    if (unconditionalLockObject.LockerNo === "") {
      setLockerWarning(true);
    } else if (unconditionalLockObject.MobileNo.length < 10) {
      setMobileNumberWarning(true);
    } else if (unconditionalLockObject.terminalID === "") {
      alert("Please enter terminal Id");
    } else {
      if (props.viaSms) {
        setLoading(true);
        console.log("via sms true");

        const openLockerViaSms = {
          LockerNo: unconditionalLockObject.LockerNo.toString(),
          PacketType: "uncondsms",
          MobileNo: unconditionalLockObject.MobileNo,
          terminalID: unconditionalLockObject.terminalID,
        };

        openLockViaSms(openLockerViaSms);
      } else {
        setLoading(true);
        const serverObj = {
          ...unconditionalLockObject,
        };
        delete serverObj.userId;
        console.log(serverObj);

        let path;

        switch (Auth.accessAppType) {
          case "MALL-LOCKERS":
            path = urlPath.serverUrlUNCLOCKMALL;
            break;

          case "STATION-LOCKERS":
            path = urlPath.serverUrlUNCLOCKMALL;
            break;

          case "TEMPLE-LOCKERS":
            path = urlPath.serverUrlUNCLOCKMALL;
            break;

          default:
            path = Auth.serverPaths.serverUrl;
            break;
        }

        const payload = encryptAES(JSON.stringify(serverObj));

        fetch(path, {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: payload,
        })
          .then((resp) => {
            console.log("unconditional lockers");

            console.log(resp);

            const decrypt = decryptAES(resp);

            return JSON.parse(decrypt);
          })
          .then((data) => {
            console.log(data);
            if (data.responseCode === "REQAC-200") {
              storeUncoditionalOpenLocks();
            } else if (data.responseCode === "REQF-201") {
              setOpenErrorAlert(true);
            } else {
              setOpenErrorAlert(true);
            }
            setLoading(false);
          })
          .catch((err) => {
            console.log("err : " + err);
            setLoading(false);
          });
      }
    }
  };

  // to get all ther terminalids from the present transaction details
  const getTerminalIdsOfTransactionDetails = () => {
    setLoading(true);
    const getLocksObj = {
      PacketType: "gettermid",
      type: "ALL",
    };
    fetch(Auth.serverPaths.localAdminPath + "FetchStates", {
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

          if (data.terminalID[0]) {
            setUnconditionalLockObject({
              ...unconditionalLockObject,
              terminalID: termId,
            });
          }
          setLoading(false);
        } else if (data.responseCode === "notd-201") {
          // alert("no terminalId in transaction details");
          setLoading(false);
        } else {
          setLoading(false);
        }
        // setLoading(false);
      })

      .catch((err) => {
        console.log("err : " + err);
        setLoading(false);
      });
  };

  const storeUncoditionalOpenLocks = () => {
    const unconditionLockOpenObj = {
      ...unconditionalLockObject,
      reason: "",
      remarks: "",
      ReqType: "",
      TransType: "",
      // LOCKNO: unconditionalLockObject.LockerNo,
      LOCKNO: unconditionalLockObject.LockerNo.toString(),
    };

    delete unconditionLockOpenObj.LockerNo;

    console.log(unconditionLockOpenObj);

    fetch(Auth.serverPaths.localAdminPath + "FetchTransactionDetails", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify(unconditionLockOpenObj),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data.status === "success") {
          // fetchDataInDatabase();

          const userLog = {
            eventType: props.viaSms ? "unCondLock_viaSMS" : "unCondLockOpen",
            remarks: props.viaSms
              ? unconditionalLockObject.LockerNo +
                " unconditional Lock Open via SMS Success from terminalID " +
                unconditionalLockObject.terminalID
              : unconditionalLockObject.LockerNo +
                " unconditional Lock Open Success from terminalID " +
                unconditionalLockObject.terminalID,
          };

          userLogs.storeUserLogs(userLog);

          setUnconditionalLockObject({
            ...unconditionalLockObject,
            LockerNo: "",
            MobileNo: props.viaSms ? lockopenMobileNumber : "",
          });
          // setOpen(true);
          setOpenSuccessAlert(true);
          setLoading(false);
        } else {
          const userLog = {
            eventType: props.viaSms ? "unCondLock_viaSMS" : "unCondLockOpen",
            remarks: props.viaSms
              ? "unconditional Lock Open via SMS Failed"
              : "unconditional Lock Open Failed",
          };

          userLogs.storeUserLogs(userLog);
          setOpenErrorAlert(true);
          setLoading(false);
        }
        setOpen(true);
      })
      .catch((err) => {
        console.log("err : " + err);
        setOpenErrorAlert(true);
        setLoading(false);
      });
  };

  const handleLoadingClose = () => {
    setLoading(false);
  };

  // to get the lockers from the selected terminal id

  const terminalIDHandler = (e, value) => {
    // setUnconditionalLockObject({
    //   ...unconditionalLockObject,
    //   terminalID: e.target.value,
    //   LockerNo: "",
    //   MobileNo: props.viaSms ? lockopenMobileNumber : "",
    // });
    // // getInProgressLocks(e.target.value);

    if (value !== null) {
      const termIdArr = value.split(",");
      const termId = termIdArr[1].replace(/\s+g/, "").trim();

      setSelectedTerminalID(value);

      console.log(termId);

      setUnconditionalLockObject({
        ...unconditionalLockObject,
        terminalID: termId,
        LockerNo: "",
        MobileNo: props.viaSms ? lockopenMobileNumber : "",
      });
    }
  };

  // const dbStoreUrl =
  //   "http://192.168.0.198:8080/AuroAutoLocker/FetchTransactionDetails";

  // const fetchDataInDatabase = () => {
  //   const Obj = {
  //     ...unconditionalLockObject,
  //   };

  //   delete Obj.LockerNo;

  //   const respObj = {
  //     ...Obj,
  //     LOCKNO: unconditionalLockObject.LockerNo,
  //     TransType: "internet",
  //   };

  //   fetch(urlPath.localServerPath + "FetchTransactionDetails", {
  //     method: "POST",
  //     headers: {
  //       accept: "application/json",
  //     },
  //     body: JSON.stringify(respObj),
  //   })
  //     .then((resp) => JSON.stringify(resp))
  //     .then((data) => {
  //       console.log(data);
  //       if (data.status === "success") {
  //         setUnconditionalLockObject({
  //           ...unconditionalLockObject,
  //           LockerNo: "",
  //         });
  //       } else {
  //       }
  //     });
  // };

  const mobileNumberHandler = (e) => {
    console.log(e.target.value.length);
    if (e.target.value.length < 11) {
      setUnconditionalLockObject({
        ...unconditionalLockObject,
        MobileNo: e.target.value,
      });
    }
  };

  return (
    <div className="release-lock-container">
      <h2 className="page-title">
        {props.viaSms
          ? "Unconditional lock open via SMS"
          : "Unconditional lock Open"}
      </h2>
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
          >
            <Alert
              onClose={() => {
                setMobileNumberWarning(false);
              }}
              severity="warning"
            >
              Please provide Valid mobile Number !
            </Alert>
          </Snackbar>

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
              Unconditional Lock was successfull
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
              value={unconditionalLockObject.terminalID}
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

          {props.viaSms ? (
            <TextField
              color="primary"
              variant="outlined"
              name="mobileNo"
              value={unconditionalLockObject.MobileNo}
              onChange={(e) => mobileNumberHandler(e)}
              label="Enter Mobile number"
              sx={{
                m: 1,
                marginTop: 2,
              }}
              // inputProps={{ readOnly: true }}
              type="number"
              focused
              fullWidth
            />
          ) : (
            <TextField
              color="primary"
              variant="outlined"
              name="mobileNo"
              value={unconditionalLockObject.MobileNo}
              onChange={(e) => mobileNumberHandler(e)}
              label="Enter Your mobileNumber"
              sx={{
                m: 1,
                marginTop: 2,
              }}
              type="number"
              focused
              fullWidth
            />
          )}
        </Box>
      </div>
      {/* <div className="layout-container">
        <table className="table table-responsive grid">
          <tbody>
            <tr>
              {locksMapping.seatNoA.map((row, index) =>
                locksMapping.allLocks.indexOf(row) > -1 ? (
                  <td
                    rowSpan={
                      row.includes("M") || row.includes("QR")
                        ? 2
                        : row.includes("XL")
                        ? 3
                        : 1
                    }
                    colSpan={
                      row.includes("L") ||
                      row.includes("XL") ||
                      row.includes("QR")
                        ? 2
                        : 1
                    }
                    className={
                      row.includes("QR")
                        ? "qr-scanner"
                        : unconditionalLockObject.LockerNo === row
                        ? "selected"
                        : "available"
                    }
                    onClick={() => userSelectedLockFun(row)}
                    key={index}
                  >
                    {row}
                  </td>
                ) : null
              )}
            </tr>

            <tr>
              {locksMapping.seatNoB.map((row, index) =>
                locksMapping.allLocks.indexOf(row) > -1 ? (
                  <td
                    rowSpan={
                      row.includes("M") || row.includes("QR")
                        ? 2
                        : row.includes("XL")
                        ? 3
                        : 1
                    }
                    colSpan={
                      row.includes("L") ||
                      row.includes("XL") ||
                      row.includes("QR")
                        ? 2
                        : 1
                    }
                    className={
                      row.includes("QR")
                        ? "qr-scanner"
                        : unconditionalLockObject.LockerNo === row
                        ? "selected"
                        : "available"
                    }
                    onClick={() => userSelectedLockFun(row)}
                    key={index}
                  >
                    {row}
                  </td>
                ) : null
              )}
            </tr>

            <tr>
              {locksMapping.seatNoC.map((row, index) =>
                locksMapping.allLocks.indexOf(row) > -1 ? (
                  <td
                    rowSpan={
                      row.includes("M") || row.includes("QR")
                        ? 2
                        : row.includes("XL")
                        ? 3
                        : 1
                    }
                    colSpan={
                      row.includes("L") ||
                      row.includes("XL") ||
                      row.includes("QR")
                        ? 2
                        : 1
                    }
                    className={
                      row.includes("QR")
                        ? "qr-scanner"
                        : unconditionalLockObject.LockerNo === row
                        ? "selected"
                        : "available"
                    }
                    onClick={() => userSelectedLockFun(row)}
                    key={index}
                  >
                    {row}
                  </td>
                ) : null
              )}
            </tr>

            <tr>
              {locksMapping.seatNoD.map((row, index) =>
                locksMapping.allLocks.indexOf(row) > -1 ? (
                  <td
                    rowSpan={
                      row.includes("M") || row.includes("QR")
                        ? 2
                        : row.includes("XL")
                        ? 3
                        : 1
                    }
                    colSpan={
                      row.includes("L") ||
                      row.includes("XL") ||
                      row.includes("QR")
                        ? 2
                        : 1
                    }
                    className={
                      row.includes("QR")
                        ? "qr-scanner"
                        : unconditionalLockObject.LockerNo === row
                        ? "selected"
                        : "available"
                    }
                    onClick={() => userSelectedLockFun(row)}
                    key={index}
                  >
                    {row}
                  </td>
                ) : null
              )}
            </tr>

            <tr>
              {locksMapping.seatNoE.map((row, index) =>
                locksMapping.allLocks.indexOf(row) > -1 ? (
                  <td
                    rowSpan={
                      row.includes("M") || row.includes("QR")
                        ? 2
                        : row.includes("XL")
                        ? 3
                        : 1
                    }
                    colSpan={
                      row.includes("L") ||
                      row.includes("XL") ||
                      row.includes("QR")
                        ? 2
                        : 1
                    }
                    className={
                      row.includes("QR")
                        ? "qr-scanner"
                        : unconditionalLockObject.LockerNo === row
                        ? "selected"
                        : "available"
                    }
                    onClick={() => userSelectedLockFun(row)}
                    key={index}
                  >
                    {row}
                  </td>
                ) : null
              )}
            </tr>
          </tbody>
        </table>
      </div> */}

      {unconditionalLockObject.terminalID === "ORN" ? ( //   ORNLayout    AHCEB2Flayout
        <>
          <ORNLayout
            isMalfunction={false}
            lockersInUse={[]}
            userSelectedLock={unconditionalLockObject.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendUnconditionLockOpenToServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : unconditionalLockObject.terminalID === "LULU" ? (
        <>
          <LULULayout
            isMalfunction={false}
            lockersInUse={[]}
            userSelectedLock={unconditionalLockObject.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendUnconditionLockOpenToServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : unconditionalLockObject.terminalID === "PSITPL" ? (
        <>
          <GALLayout
            isMalfunction={false}
            lockersInUse={[]}
            userSelectedLock={unconditionalLockObject.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendUnconditionLockOpenToServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : unconditionalLockObject.terminalID === "FALCON" ||
        unconditionalLockObject.terminalID === "UPTOWN" ||
        unconditionalLockObject.terminalID === "G21" ||
        unconditionalLockObject.terminalID === "LULUB2" ||
        unconditionalLockObject.terminalID === "NXHYD1" ||
        unconditionalLockObject.terminalID === "ORNUTUB" ||
        unconditionalLockObject.terminalID === "MJMJPN" ||
        unconditionalLockObject.terminalID === "AMRHYD" ||
        unconditionalLockObject.terminalID === "DSLHYD1" ||
        unconditionalLockObject.terminalID === "HLCALIB2" ||
        unconditionalLockObject.terminalID === "GGCALILG" ||
        unconditionalLockObject.terminalID === "LULUHYD" ||
        unconditionalLockObject.terminalID === "ORN1" ||
        unconditionalLockObject.terminalID === "NXWFLD" ||
        unconditionalLockObject.terminalID === "LULUB1" ? (
        <>
          <FalconUptownLulub2Layout
            isMalfunction={false}
            lockersInUse={[]}
            userSelectedLock={unconditionalLockObject.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendUnconditionLockOpenToServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : unconditionalLockObject.terminalID === "GARUDA" ? (
        <>
          <GarudaLayout
            isMalfunction={false}
            lockersInUse={[]}
            userSelectedLock={unconditionalLockObject.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendUnconditionLockOpenToServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : unconditionalLockObject.terminalID === "NXFIZA" ||
        unconditionalLockObject.terminalID === "NCCMYS" ||
        unconditionalLockObject.terminalID === "GAL" ? (
        <>
          <NXSNKNlayout
            isMalfunction={false}
            lockersInUse={[]}
            userSelectedLock={unconditionalLockObject.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendUnconditionLockOpenToServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : unconditionalLockObject.terminalID === "NXSNKN" ? (
        <>
          <NXSNKNlayoutUpdate
            isMalfunction={false}
            lockersInUse={[]}
            userSelectedLock={unconditionalLockObject.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendUnconditionLockOpenToServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : unconditionalLockObject.terminalID === "ORN2" ||
        unconditionalLockObject.terminalID === "FALCON1" ? (
        <>
          <ORN2Layout
            isMalfunction={false}
            lockersInUse={[]}
            userSelectedLock={unconditionalLockObject.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendUnconditionLockOpenToServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : unconditionalLockObject.terminalID === "PMCBB1" ||
        unconditionalLockObject.terminalID === "VEGCITB1" ? (
        <>
          <PMCBB1Layout
            isMalfunction={false}
            lockersInUse={[]}
            userSelectedLock={unconditionalLockObject.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendUnconditionLockOpenToServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : unconditionalLockObject.terminalID === "MMBLR3" ||
        unconditionalLockObject.terminalID === "NXSNKNLG" ? (
        <>
          <MMBLR3Layout
            isMalfunction={false}
            lockersInUse={[]}
            userSelectedLock={unconditionalLockObject.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendUnconditionLockOpenToServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : unconditionalLockObject.terminalID === "NEXUS" ? (
        <>
          <NexusLayout
            isMalfunction={false}
            lockersInUse={[]}
            userSelectedLock={unconditionalLockObject.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendUnconditionLockOpenToServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : unconditionalLockObject.terminalID === "NXHYD2" ? (
        <>
          <NexusHyd2Layout
            isMalfunction={false}
            lockersInUse={[]}
            userSelectedLock={unconditionalLockObject.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendUnconditionLockOpenToServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : unconditionalLockObject.terminalID === "NXSWLG" ? (
        <>
          <NXPAVMZLayout
            isMalfunction={false}
            lockersInUse={[]}
            userSelectedLock={unconditionalLockObject.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendUnconditionLockOpenToServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : unconditionalLockObject.terminalID === "NXSWB1" ? (
        <>
          <NXSWB1Layout
            isMalfunction={false}
            lockersInUse={[]}
            userSelectedLock={unconditionalLockObject.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendUnconditionLockOpenToServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : unconditionalLockObject.terminalID === "PMCCNBL" ||
        unconditionalLockObject.terminalID === "NXWESTUB" ||
        unconditionalLockObject.terminalID === "ELPROCST" ||
        unconditionalLockObject.terminalID === "ELPROCSL" ||
        unconditionalLockObject.terminalID === "NXSWUG" ||
        unconditionalLockObject.terminalID === "NXSW2F" ? (
        <>
          <PMCCNBLLayout
            isMalfunction={false}
            lockersInUse={[]}
            userSelectedLock={unconditionalLockObject.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendUnconditionLockOpenToServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : unconditionalLockObject.terminalID === "PMCCNGF" ||
        unconditionalLockObject.terminalID === "MOALPE" ||
        unconditionalLockObject.terminalID === "NXWESTG2" ? (
        <>
          <PMCCNGFLayout
            isMalfunction={false}
            lockersInUse={[]}
            userSelectedLock={unconditionalLockObject.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendUnconditionLockOpenToServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : unconditionalLockObject.terminalID === "NXPAVMZ" ? (
        <>
          <NXPAVMZupdatedLayout
            isMalfunction={false}
            lockersInUse={[]}
            userSelectedLock={unconditionalLockObject.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendUnconditionLockOpenToServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : unconditionalLockObject.terminalID === "MMBLR1" ||
        unconditionalLockObject.terminalID === "DSLHYD2" ||
        unconditionalLockObject.terminalID === "FORUMKOLG" ||
        unconditionalLockObject.terminalID === "NXVIJM" ||
        unconditionalLockObject.terminalID === "MMBLR2" ? (
        <>
          <MMBLR1Layout
            isMalfunction={false}
            lockersInUse={[]}
            userSelectedLock={unconditionalLockObject.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendUnconditionLockOpenToServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : unconditionalLockObject.terminalID === "MOAEDENB1" ? (
        <>
          <MOAEDENB1layout
            isMalfunction={false}
            lockersInUse={[]}
            userSelectedLock={unconditionalLockObject.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendUnconditionLockOpenToServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : unconditionalLockObject.terminalID === "MOALUXLL" ||
        unconditionalLockObject.terminalID === "MOAWEST1" ? (
        <>
          <MOALUXLLlayout
            isMalfunction={false}
            lockersInUse={[]}
            userSelectedLock={unconditionalLockObject.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendUnconditionLockOpenToServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : unconditionalLockObject.terminalID === "MOAWEST2" ||
        unconditionalLockObject.terminalID === "LULUHYDLG" ? (
        <>
          <MOAWEST2layout
            isMalfunction={false}
            lockersInUse={[]}
            userSelectedLock={unconditionalLockObject.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendUnconditionLockOpenToServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : unconditionalLockObject.terminalID === "MOAEAST1" ? (
        <>
          <MOAEAST1layout
            isMalfunction={false}
            lockersInUse={[]}
            userSelectedLock={unconditionalLockObject.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendUnconditionLockOpenToServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : unconditionalLockObject.terminalID === "FMCALIGF" ? (
        <>
          <FMCALIGFlayout
            isMalfunction={false}
            lockersInUse={[]}
            userSelectedLock={unconditionalLockObject.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendUnconditionLockOpenToServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : unconditionalLockObject.terminalID === "NXSNKNB1" ? (
        <>
          <NXSNKNB1layout
            isMalfunction={false}
            lockersInUse={[]}
            userSelectedLock={unconditionalLockObject.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendUnconditionLockOpenToServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : unconditionalLockObject.terminalID === "HLCALIGF" ? (
        <>
          <HLCALIGFlayout
            isMalfunction={false}
            lockersInUse={[]}
            userSelectedLock={unconditionalLockObject.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendUnconditionLockOpenToServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : unconditionalLockObject.terminalID === "NXVCNB1" ? (
        <>
          <NXVCNB1layout
            isMalfunction={false}
            lockersInUse={[]}
            userSelectedLock={unconditionalLockObject.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendUnconditionLockOpenToServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : unconditionalLockObject.terminalID === "NXVCJNRM" ||
        unconditionalLockObject.terminalID === "NXVCARCR" ? (
        <>
          <NXVCJNRMlayout
            isMalfunction={false}
            lockersInUse={[]}
            userSelectedLock={unconditionalLockObject.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendUnconditionLockOpenToServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : unconditionalLockObject.terminalID === "AHCEBGFOLD" ? (
        <>
          <AHCEBGFlayout
            isMalfunction={false}
            lockersInUse={[]}
            userSelectedLock={unconditionalLockObject.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendUnconditionLockOpenToServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : unconditionalLockObject.terminalID === "AHCEB2F" ? (
        <>
          <AHCEB2Flayout
            isMalfunction={false}
            lockersInUse={[]}
            userSelectedLock={unconditionalLockObject.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendUnconditionLockOpenToServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : unconditionalLockObject.terminalID === "LULUHYDUG" ? (
        <>
          <LULUHYDUGlayout
            isMalfunction={false}
            lockersInUse={[]}
            userSelectedLock={unconditionalLockObject.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendUnconditionLockOpenToServer()}
              fullWidth
            >
              submit
            </Button>
          </div>
        </>
      ) : (
        <>
          <CommonLayoutForAll
            terminalID={unconditionalLockObject.terminalID}
            isMalfunction={false}
            lockersInUse={[]}
            userSelectedLock={unconditionalLockObject.LockerNo}
            userSelectedLockHandler={userSelectedLockFun.bind(this)}
          />
          <div className="releaselock-button-container">
            <Button
              variant="contained"
              color="info"
              onClick={() => sendUnconditionLockOpenToServer()}
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
          onClick={() => sendUnconditionLockOpenToServer()}
          fullWidth
        >
          submit
        </Button>
      </div> */}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {unconditionalLockObject.LockerNo + " is Open now"}
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
    </div>
  );
};

export default UnconditionalLockerOpen;
