
import React, { useEffect, useState } from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Button, TextField } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import NativeSelect from "@mui/material/NativeSelect";
import PathUrl from "../../GlobalVariable/urlPath.json";


import data from "../../GlobalVariable/CommonLockersJSON.json";
import { useLogDetails } from "../../utils/UserLogDetails";
import pathUrl from "../../GlobalVariable/urlPath.json";
import { lockopenMobileNumber } from "../../GlobalVariable/GlobalModule";
import { useAuth } from "../../utils/Auth";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import DialogContent from "@mui/material/DialogContent";

const options = ["block", "unblock"];

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="standard" {...props} />;
});

const Malfun = (props) => {


  const Auth = useAuth();
  const [malfunctionLocksObj, setMalfunctionLoksObj] = useState({
    PacketType: "getmalflocks",
    lockType: "",
    LockerNo: "",
    terminalID: "",
    userName: "Raghu",
  });

  const [malfunctionTypeSelected, setMalfunctionTypeSelected] = useState(false);
  const [lockerDataFetched, setLockerDataFetched] = useState(null);
  const [mobileNumber, setMobileNumber] = useState("");
  const [selectedLockers, setSelectedLockers] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openErrorAlert, setOpenErrorAlert] = useState(false);
  const [openSuccessAlert, setOpenSuccessAlert] = useState(false);
  const [lockerWarning, setLockerWarning] = useState(false);
  const [mobileNumberWarning, setMobileNumberWarning] = useState(false);
  const [terminalIds, setTdTerminalIds] = useState([]);
  const [lockerNo, setLockerNo] = useState();
  const [openAddMalfun, setOpenAddMalfun] = useState(false);
  const [openRemMalfun, setOpenRemMalfun] = useState(false);
  const [malfucntionLocks, setMalfunctionLocks] = useState([]);
  const [value, setValue] = useState("");
  const [openBlockDailogue, setOpenBlockDailogue] = useState(false);
  const [openUnblockDailogue, setOpenUnblockDailogue] = useState(false);


  const isMalfunction = true;
  //   const inProgressLocks = lockersInUse;


  const userLogs = useLogDetails();

  const [state, setState] = useState({
    vertical: "top",
    horizontal: "center",
  });

  const { vertical, horizontal } = state;

  useEffect(() => {
    getTerminalIdsOfTransactionDetails();
  }, []);

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

  const handleClose = () => {
    setOpenAddMalfun(false);
    setOpenRemMalfun(false);
  };

  const hanleEvent = (e) => {
    setValue(e.target.value);
    setMalfunctionTypeSelected(false);
  };

  const handleCancel = () => {
    setValue("");
    setOpenBlockDailogue(false);
    setOpenUnblockDailogue(false);
  };



  const getTerminalIdsOfTransactionDetails = () => {

    setLoading(true);

    const getLocksObj = {
      PacketType: "gettermid",
    };

    fetch(serverPaths.localAdminPath+ "FetchTransactionDetails", {
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

          setTdTerminalIds(data.terminalID);
          if (data.terminalID[0]) {
            setMalfunctionLoksObj({
              ...malfunctionLocksObj,
              terminalID: data.terminalID[0],
            });

            getMalfunctionLockers(data.terminalID[0]);
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

  const terminalIDHandler = (e) => {
    const selectedTerminalID = e.target.value;
    setMalfunctionLoksObj({
      ...malfunctionLocksObj,
      terminalID: selectedTerminalID,
      LockerNo: "",
    });
    const lockerLayout = data[selectedTerminalID];
    setLockerDataFetched(lockerLayout);
    getMalfunctionLockers(selectedTerminalID);
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
    if (selectedLockers.length === 0) {
      alert("Please choose a locker");
    } else if (malfunctionLocksObj.lockType === "") {
      alert("Please enter the type");
    } else {
      const malFunObj = {
        ...malFunctionObj,
        userName: malfunctionLocksObj.userName,
        selectedLockers: selectedLockers.join(", "),
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
            const userLog = {
              eventType: "addMalFunction",
              remarks: `${selectedLockers.join(", ")} is added as malfunction from terminalID ${malfunctionLocksObj.terminalID}`,
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
            const userLog = {
              eventType: "remMalFunction",
              remarks: `${selectedLockers.join(", ")} is removed as malfunction from terminalID ${malfunctionLocksObj.terminalID}`,
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
    if (lock === "QR") return;
    setMalfunctionLoksObj((prev) => ({
      ...prev,
      LockerNo: lock,
      lockType: ""
    }));
    setSelectedLockers([lock]);
    setValue("");
    if (isMalfunction) {
      if (malfucntionLocks.includes(lock)) {
        setOpenUnblockDailogue(true);
      } else {
        setOpenBlockDailogue(true);
      }
    } else {
      setMalfunctionTypeSelected(true);
    }
    // userSelectedLockFun(lock);
  };

  const malfunctionStatusHandler = (type) => {
    setMalfunctionLoksObj({
      ...malfunctionLocksObj,
      lockType: type,
    });
  };

  const handleOk = () => {
    if (value) {
      malfunctionStatusHandler(value);
      setOpenBlockDailogue(false);
      setOpenUnblockDailogue(false);
    } else {
      setMalfunctionTypeSelected(true);
    }
  };

  const addButton = (text, x, y, width, height) => {
    const padding = 2;
    const borderRadius = 5;
    const key = `${text}-${x}-${y}`;
    const isSelected = selectedLockers.includes(text);
    return (
      <button
        key={key}
        style={{
          position: "absolute",
          left: x - padding,
          top: y - padding,
          width: width - 2 * padding,
          height: height - 2 * padding,
          padding: padding,
          borderRadius: borderRadius,
          boxSizing: "border-box",
          marginTop: "5%",
          marginLeft: "50%",
          backgroundColor: isSelected ? "blue" : "white",
        }}
        onClick={() => userSelectedLockFun(text)}
      >
        {text}
      </button>
    );
  };


  const buttons = [];
  if (lockerDataFetched) {
    const { noofrows, noofcolumns, lockerLay } = lockerDataFetched;
    const dimensions = {
      width: 40,
      height: 40,
      swidth: 80,
      sheight: 50,
      mwidth: 80,
      mheight: 50,
      lwidth: 80,
      lheight: 50,
      qrwidth: 80,
      qrheight: 50,
      xlwidth: 80,
      xlheight: 50,
    };
    const lockerLaypos = Array.from({ length: noofrows }, () =>
      Array(noofcolumns).fill(null)
    );
    let y = 0,
      tmpy = 0;

    for (let i = 0; i < noofrows; i++) {
      let x = 0;
      let totalRowWidth = 0;
      tmpy = 0;

      for (let j = 0; j < noofcolumns; j++) {
        const locnumber = lockerLay[i][j];
        let tmph = 0,
          tmpw = 0;

        if (locnumber) {
          const [prefix, coord] = locnumber.split("#");
          const [noc, nor] = coord.split(",");
          switch (prefix) {
            case "S":
              tmph = dimensions.sheight * nor;
              tmpw = dimensions.swidth * noc;
              break;
            case "M":
              tmph = dimensions.mheight * nor;
              tmpw = dimensions.mwidth * noc;
              break;
            case "L":
              tmph = dimensions.lheight * nor;
              tmpw = dimensions.lwidth * noc;
              break;
            case "QS2":
              tmph = dimensions.qrheight * nor;
              tmpw = dimensions.qrwidth * noc;
              break;
            case "XL":
              tmph = dimensions.xlheight * nor;
              tmpw = dimensions.xlwidth * noc;
              break;
            default:
              tmph = dimensions.sheight * nor;
              tmpw = dimensions.swidth * noc;
              break;
          }

          if (tmpy > tmph || tmpy === 0) tmpy = tmph;
          totalRowWidth += tmpw;

          lockerLaypos[i][j] = `${x},${y},${tmpw},${tmph}`;
          x += tmpw;
        } else {
          lockerLaypos[i][j] = `${x},${y},${0},${0}`;
          x += dimensions.swidth;
        }
      }
      y += tmpy;
    }

    for (let i = 0; i < lockerLaypos.length; i++) {
      for (let j = 0; j < lockerLaypos[i].length; j++) {
        const [x, y, width, height] = lockerLaypos[i][j]
          .split(",")
          .map(Number);
        const locData = lockerLay[i][j];
        const locName = locData.split("#")[0];

        if (locName !== "NA") {
          const gridX = j * dimensions.swidth;
          const gridY = i * dimensions.sheight;
          const adjustedX = gridX + (x - gridX);
          const button = addButton(
            locName,
            adjustedX,
            gridY,
            width,
            height
          );
          buttons.push(button);
        }
      }
    }
  }


  return (
    <div className="malfunction-cotnainer">
      <h2 className="page-title">Malfunction Lockers</h2>
      <div className="terminalId-dropdown-container">
        <Box sx={{ width: "100%" }}>
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


        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth>
            <InputLabel variant="standard" htmlFor="uncontrolled-native">
              Choose terminalId
            </InputLabel>
            <NativeSelect
              defaultValue={30}
              inputProps={{
                name: "Choose terminalId",
                id: "uncontrolled-native",
              }}
              value={malfunctionLocksObj.terminalID}
              onChange={terminalIDHandler}
            >
              <option value={"select"}></option>
              {Object.keys(data).map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </NativeSelect>
          </FormControl>

          <ht>{selectedLockers.join(", ")}</ht>
        </Box>
        <br />
        <Button variant="contained" onClick={() => sendMalfunctionLockoServer()}>
          Submit
        </Button>
      </div>

      <Dialog
        sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
        maxWidth="xs"
        open={openBlockDailogue}
      >
        <DialogTitle>Locker Malfunction Type</DialogTitle>
        <DialogContent dividers>
          <RadioGroup
            aria-label="malfunction"
            name="malfunction status"
            value={value}
            onChange={hanleEvent}
          >
            <FormControlLabel
              value="block"
              control={<Radio size="medium" />}
              label="Block"
            />
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleOk}>Ok</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
        maxWidth="xs"
        open={openUnblockDailogue}
      >
        <DialogTitle>Locker Malfunction Type</DialogTitle>
        <DialogContent dividers>
          <RadioGroup
            aria-label="malfunction"
            name="malfunction status"
            value={value}
            onChange={hanleEvent}
          >
            <FormControlLabel
              value="unblock"
              control={<Radio size="medium" />}
              label="Unblock"
            />
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleOk}>Ok</Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ width: "100%" }}>
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={malfunctionTypeSelected}
          autoHideDuration={6000}
          onClose={() => setMalfunctionTypeSelected(false)}
        >
          <Alert
            onClose={() => setMalfunctionTypeSelected(false)}
            severity="warning"
          >
            Please choose Locker Malfunction Type !!
          </Alert>
        </Snackbar>
      </Box>

      <div style={{ position: "relative", height: "50%" }}>{buttons}</div>
      <Dialog
        open={openAddMalfun}
        // onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {/* {lockerNo + " set as malfunction"} */}
          {selectedLockers.length > 0
            ? `${selectedLockers.join(", ")} set as malfunction`
            : "No lockers selected"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>ok</Button>
        </DialogActions>
      </Dialog>




      <Dialog
        open={openRemMalfun}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {/* {lockerNo + " is removed from malfunction status"} */}
          {selectedLockers.length > 0
            ? `${selectedLockers.join(", ")} is removed from malfunction status"`
            : "No lockers selected"}
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

export default Malfun;
