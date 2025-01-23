import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import "./SiteRegCom.css";
import { useLogDetails } from "../../utils/UserLogDetails";
import { useAuth } from "../../utils/Auth";
import PathUrl from "../../GlobalVariable/urlPath.json";
import Navbar from "../../mainDashBoard/Navbar";
import {
  Backdrop,
  CircularProgress,
  IconButton,
  TextField,
} from "@mui/material";
import {
  commonApiForGetConenction,
  commonApiForPostConenction,
} from "../../GlobalVariable/GlobalModule";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

import { yellow } from "@mui/material/colors";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import { Navigate, useNavigate } from "react-router-dom";
import { Box, FormControl, InputLabel, NativeSelect } from "@mui/material";

import Button from "@mui/material/Button";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import SitesRegisterd from "./SitesRegisterd";

const siteStatusType = ["Active", "Inactive"];
const outletType = ["RENT", "GENERAL"];


function SiteRegistrationCom() {
  const [siteRegistration, setSiteRegistration] = useState({
    slno: "",
    siteId: "",
    siteName: "",
    noOfLockers: "",
    terminalId: "",
    areaCode: "",
    areaName: "",
    cityName: "",
    state: "",
    imeiNumber: "",
    mobileNumber: "",
    userName: "",
    lattitude: "",
    longitude: "",
    status: "",
    outletType: "",
  });

  const [open, setOpen] = useState(false);

  const [password, setPassword] = useState("");

  const handleClose = () => {
    setOpen(false);
  };

  const [newSiteHandler, setNewSiteHandler] = useState(false);

  const [usersHandler, setUsersHandler] = useState(true);

  const [allTerminalids, setAllTerminalids] = useState([]);
  const [dublicateTerminalid, setDublicateTerminalid] = useState(false);

  const useLogs = useLogDetails();
  const Auth = useAuth();

  const Navigate = useNavigate();

  const [isDisabled, setIsDisabled] = useState(false);

  const [backdropOpen, setBackdropOpen] = useState(false);

  useEffect(() => {
    getAllTerminalIds();
  }, []);

  function onSiteRegTypeSelection(typeOfOp) {
    setUsersHandler(false);

    if (typeOfOp === true) {
      setNewSiteHandler(true);
    } else {
      setNewSiteHandler(false);
    }
  }

  const getAllTerminalIds = async () => {
    setBackdropOpen(true);
    const path = "FetchTransactionDetails";
    const payloadObject = {
      PacketType: "gettermid",
    };

    await commonApiForPostConenction(path, payloadObject, Auth.accessAppType)
      .then((data) => {
        console.log(data);
        setAllTerminalids([...data.terminalID]);
        setBackdropOpen(false);
      })
      .catch((reject) => {
        setBackdropOpen(false);
        console.log(reject);
        alert("Something Went Wrong Please Try again later");
      });
  };

  const userEnteredData = (e) => {
    e.preventDefault();
    const inputName = e.target.name;

    if (inputName === "mobileNumber") {
      if (e.target.value.length <= 15) {
        setSiteRegistration({
          ...siteRegistration,
          [inputName]: e.target.value,
        });
      }
    } else {
      setSiteRegistration({ ...siteRegistration, [inputName]: e.target.value });
    }
  };

  const closeCreateUserOperation = () => {
    Navigate("/", { replace: true });
  };

  const verifyBeforeSubmitting = (e) => {
    e.preventDefault();
    setOpen(true);
  };

  const submitSiteRegForm = () => {
    // e.preventDefault();
    // setIsDisabled(true);
    console.log(siteRegistration);

    if (newSiteHandler) {
      const indexVal = allTerminalids.indexOf(siteRegistration.terminalId);

      if (indexVal > -1) {
        setDublicateTerminalid(true);
        alert(siteRegistration.terminalId + " is already Taken ");
      } else {
        if (
          siteRegistration.mobileNumber !== null ||
          siteRegistration.mobileNumber !== ""
        ) {
          if (siteRegistration.mobileNumber.length === 10) {
            setBackdropOpen(true);
            setDublicateTerminalid(false);

            fetch(Auth.serverPaths.localAdminPath + "SaveSiteRegistration", {
              method: "POST",
              headers: {
                // 'Access-Control-Allow-Origin': '*',
                Accept: "application/json",
                // 'Content-Type': 'application/json'
              },
              // mode:'no-cors',
              body: JSON.stringify({ ...siteRegistration, pwd: password }),
            })
              .then((response) => response.json())
              .then((data) => {
                if (data.status === "success") {
                  alert("data Stored Successfully");
                  fetchToUserLogs();

                  setSiteRegistration({
                    slno: "",
                    siteId: "",
                    siteName: "",
                    noOfLockers: "",
                    terminalId: "",
                    areaCode: "",
                    areaName: "",
                    cityName: "",
                    state: "",
                    imeiNumber: "",
                    mobileNumber: "",
                    userName: "",
                    lattitude: "",
                    longitude: "",
                    status: "",
                    outletType: "",
                  });
                } else if (data.status === "invalid-user") {
                  alert("Invalid User Credential");
                } else {
                  alert("some problem occured");
                }
                setBackdropOpen(false);
                setOpen(false);
                setPassword("");
              })
              .catch((err) => {
                setBackdropOpen(false);
                setOpen(false);
                setPassword("");
                console.log(err);
              });
          }
        }
      }
    } else {
      if (
        siteRegistration.mobileNumber !== null ||
        siteRegistration.mobileNumber !== ""
      ) {
        if (siteRegistration.mobileNumber.length <= 15) {
          setDublicateTerminalid(false);

          setBackdropOpen(true);
          fetch(Auth.serverPaths.localAdminPath + "SiteRegOperations", {
            method: "POST",
            headers: {
              Accept: "application/json",
              // 'Content-Type': 'application/json'
            },
            // mode:'no-cors',
            body: JSON.stringify({ ...siteRegistration, pwd: password, packetType:"UPDATE_SITE" }),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.status === "success") {
                alert("data Stored Successfully");

                fetchToUserLogs();
              } else if (data.status === "invalid-user") {
                alert("Invalid User Credential");
              } else {
                alert("some problem occured");
              }
              setOpen(false);
              setBackdropOpen(false);
              setPassword("");
            })
            .catch((err) => {
              setOpen(false);
              setBackdropOpen(false);
              setPassword("");
              console.log(err);
            });
        }
      }
    }

    // e.target.reset();
    setIsDisabled(false);
  };

  const fetchToUserLogs = () => {
    const fetchObj = {
      eventType: "siteRegistration",
      remarks: "site registered successfully",
    };
    useLogs.storeUserLogs(fetchObj);
  };

  const terminalIdEventHandler = async (e) => {
    setBackdropOpen(true);
    // const path =
    //   PathUrl.localServerPath +
    //   "SiteRegOperations" +
    //   "?terminalid=" +
    //   e.target.value;

    const path =
    Auth.serverPaths.localAdminPath +
    "SiteRegOperations" +
    "?terminalid=" +
    e.target.value;

      

    await commonApiForGetConenction(path)
      .then((data) => {
        console.log(data.areaCode);

        setSiteRegistration({
          // ...siteRegistration,
          slno: data.slno === undefined ? "" : data.slno,
          siteId: data.siteId === undefined ? "" : data.siteId,
          siteName: data.siteName === undefined ? "" : data.siteName,
          noOfLockers: data.noOfLockers === undefined ? "" : data.noOfLockers,
          terminalId: data.terminalId === undefined ? "" : data.terminalId,
          areaCode: data.areaCode === undefined ? "" : data.areaCode,
          areaName: data.areaName === undefined ? "" : data.areaName,
          cityName: data.cityName === undefined ? "" : data.cityName,
          state: data.state === undefined ? "" : data.state,
          imeiNumber: data.imeiNumber === undefined ? "" : data.imeiNumber,
          mobileNumber:
            data.mobileNumber === undefined ? "" : data.mobileNumber,
          userName: data.userName === undefined ? "" : data.userName,
          lattitude: data.lattitude === undefined ? "" : data.lattitude,
          longitude: data.longitude === undefined ? "" : data.longitude,
          status: data.siteStatus === undefined ? "" : data.siteStatus,
          outletType: data.outletType === undefined ? "" : data.outletType,
        });

        setBackdropOpen(false);
      })
      .catch((err) => {
        console.log("error : " + err);
        setBackdropOpen(false);
      });

    // setSiteRegistration({
    //   ...siteRegistration,
    //   terminalId: e.target.value
    // })
  };

  const submitOnPasswordVerify = () => {
    if (password.length > 2) {
      submitSiteRegForm();
    }
  };

  return (
    <>
      <Navbar />

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backdropOpen}
        // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <div>
        <Dialog open={usersHandler}>
          <DialogTitle> Select Mode Of Operation </DialogTitle>
          <IconButton
            aria-label="delete"
            color="primary"
            sx={{
              mt: -6,
              ml: "88%",
            }}
            onClick={() => closeCreateUserOperation()}
          >
            <CloseIcon color="error" />
          </IconButton>
          <List sx={{ pt: 1, width: 350 }}>
            <ListItem
              sx={{
                cursor: "pointer",
              }}
              onClick={() => onSiteRegTypeSelection(true)}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: yellow[100], color: yellow[500] }}>
                  <PersonAddIcon color="primary" />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={"Register A New Site"} />
            </ListItem>

            <ListItem
              sx={{
                cursor: "pointer",
              }}
              onClick={() => onSiteRegTypeSelection(false)}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: yellow[100], color: yellow[500] }}>
                  <ManageAccountsIcon color="primary" />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={" Edit Existing Site"} />
            </ListItem>
          </List>
        </Dialog>
      </div>

      <div className="components-below-navbar">
        <div className="user-creation-container">
          <div className="user-form-container">
            <div className="form-header form-head-siteReg">
              <h2>Site Registration Page</h2>
            </div>

            <div className="form-container">
              <form onSubmit={verifyBeforeSubmitting}>
                {newSiteHandler ? (
                  <TextField
                    error={dublicateTerminalid ? true : false}
                    onChange={(e) => userEnteredData(e)}
                    type="text"
                    name="terminalId"
                    value={siteRegistration.terminalId}
                    color="primary"
                    label="Terminal Id"
                    sx={{
                      w: 350,
                      m: 2,
                    }}
                    required
                    focused
                    helperText={
                      dublicateTerminalid ? "TerminalId is Already Taken" : null
                    }
                  />
                ) : (
                  <Box>
                    <FormControl
                      sx={{
                        m: 1,
                        width: 300,
                        textAlign: "center",
                      }}
                      focused
                    >
                      <InputLabel
                        variant="standard"
                        color="info"
                        htmlFor="uncontrolled-native"
                      >
                        Choose terminalId
                      </InputLabel>
                      <NativeSelect
                        defaultValue={30}
                        variant="outlined"
                        color="success"
                        inputProps={{
                          name: "Choose terminalId",
                          id: "uncontrolled-native",
                        }}
                        value={siteRegistration.terminalId}
                        onChange={(e) => terminalIdEventHandler(e)}
                      >
                        {allTerminalids.map((termID, index) => (
                          <option
                            className="option-container"
                            value={termID}
                            key={index}
                          >
                            {termID}
                          </option>
                        ))}
                      </NativeSelect>
                    </FormControl>
                  </Box>
                )}

                <TextField
                  onChange={(e) => userEnteredData(e)}
                  type="text"
                  name="siteId"
                  value={siteRegistration.siteId}
                  color="primary"
                  label="site id"
                  sx={{
                    w: 350,
                    m: 2,
                  }}
                  required
                  focused
                />

                <TextField
                  onChange={(e) => userEnteredData(e)}
                  type="text"
                  name="siteName"
                  value={siteRegistration.siteName}
                  color="primary"
                  label="site name"
                  sx={{
                    w: 350,
                    m: 2,
                  }}
                  required
                  focused
                />

                <TextField
                  onChange={(e) => userEnteredData(e)}
                  type="number"
                  name="noOfLockers"
                  value={siteRegistration.noOfLockers}
                  color="primary"
                  label="No of Lockers"
                  sx={{
                    w: 350,
                    m: 2,
                  }}
                  required
                  focused
                />

                <TextField
                  onChange={(e) => userEnteredData(e)}
                  type="text"
                  name="areaCode"
                  value={siteRegistration.areaCode}
                  color="primary"
                  label="Area Code"
                  sx={{
                    w: 350,
                    m: 2,
                  }}
                  required
                  focused
                />

                <TextField
                  onChange={(e) => userEnteredData(e)}
                  type="text"
                  name="cityName"
                  value={siteRegistration.cityName}
                  color="primary"
                  label="City Name"
                  sx={{
                    w: 350,
                    m: 2,
                  }}
                  required
                  focused
                />

                <TextField
                  onChange={(e) => userEnteredData(e)}
                  type="text"
                  name="areaName"
                  value={siteRegistration.areaName}
                  color="primary"
                  label="Area Name"
                  sx={{
                    w: 350,
                    m: 2,
                  }}
                  required
                  focused
                />

                <TextField
                  onChange={(e) => userEnteredData(e)}
                  type="text"
                  name="imeiNumber"
                  value={siteRegistration.imeiNumber}
                  color="primary"
                  label="imei Number"
                  sx={{
                    w: 350,
                    m: 2,
                  }}
                  required
                  focused
                />

                <TextField
                  onChange={(e) => userEnteredData(e)}
                  type="text"
                  name="state"
                  value={siteRegistration.state}
                  color="primary"
                  label="state"
                  sx={{
                    w: 350,
                    m: 2,
                  }}
                  required
                  focused
                />

                <TextField
                  error={
                    siteRegistration.mobileNumber != null &&
                    siteRegistration.mobileNumber != ""
                      ? siteRegistration.mobileNumber.length <= 15
                        ? false
                        : true
                      : false
                  }
                  onChange={(e) => userEnteredData(e)}
                  type="number"
                  name="mobileNumber"
                  value={siteRegistration.mobileNumber}
                  color="primary"
                  label="Mobile Number"
                  sx={{
                    w: 350,
                    m: 2,
                  }}
                  helperText={
                    siteRegistration.mobileNumber != null &&
                    siteRegistration.mobileNumber != ""
                      ? siteRegistration.mobileNumber.length <= 15
                        ? null
                        : "Mobile number length exceeded"
                      : null
                  }
                  required
                  focused
                />

                <TextField
                  onChange={(e) => userEnteredData(e)}
                  type="text"
                  name="userName"
                  value={siteRegistration.userName}
                  color="primary"
                  label="User Name"
                  sx={{
                    w: 350,
                    m: 2,
                  }}
                  required
                  focused
                />

                <TextField
                  onChange={(e) => userEnteredData(e)}
                  type="text"
                  name="lattitude"
                  value={siteRegistration.lattitude}
                  color="primary"
                  label="lattitude"
                  sx={{
                    w: 350,
                    m: 2,
                  }}
                  required
                  focused
                />

                <TextField
                  onChange={(e) => userEnteredData(e)}
                  type="text"
                  name="longitude"
                  value={siteRegistration.longitude}
                  color="primary"
                  label="longitude"
                  sx={{
                    w: 350,
                    m: 2,
                  }}
                  required
                  focused
                />

                <Box>
                  <FormControl
                    sx={{
                      m: 1,
                      width: 300,
                      textAlign: "center",
                    }}
                    focused
                  >
                    <InputLabel
                      variant="standard"
                      color="info"
                      htmlFor="uncontrolled-native"
                    >
                      Choose terminalId
                    </InputLabel>
                    <NativeSelect
                      // defaultValue={30}
                      variant="outlined"
                      color="success"
                      inputProps={{
                        name: "status",
                        id: "uncontrolled-native",
                      }}
                      name="status"
                      value={siteRegistration.status}
                      onChange={(e) => userEnteredData(e)}
                    >
                      {siteStatusType.map((status, index) => (
                        <option
                          className="option-container"
                          value={status}
                          key={index + 1}
                        >
                          {status}
                        </option>
                      ))}
                    </NativeSelect>
                  </FormControl>
                </Box>

                <Box>
                  <FormControl
                    sx={{
                      m: 1,
                      width: 300,
                      textAlign: "center",
                    }}
                    focused
                  >
                    <InputLabel
                      variant="standard"
                      color="info"
                      htmlFor="uncontrolled-native"
                    >
                      Choose terminalId
                    </InputLabel>
                    <NativeSelect
                      // defaultValue={30}
                      variant="outlined"
                      color="success"
                      inputProps={{
                        name: "outletType",
                        id: "uncontrolled-native",
                      }}
                      name="status"
                      value={siteRegistration.outletType}
                      onChange={(e) => userEnteredData(e)}
                    >
                      {outletType.map((outlet, index) => (
                        <option
                          className="option-container"
                          value={outlet}
                          key={index + 1}
                        >
                          {outlet}
                        </option>
                      ))}
                    </NativeSelect>
                  </FormControl>
                </Box>

                <br />

                <input
                  type="submit"
                  value="Submit"
                  className="btn submitBtn btn-siteReg"
                  disabled={isDisabled}
                />
              </form>
            </div>
          </div>
        </div>

        <SitesRegisterd />
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Please Confirm Yourself Before Updating"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              id="alert-dialog-description"
              style={{ textAlign: "center" }}
            >
              For security purpose you need to provide password for the user
              praveen to make changes
              <br />
              <TextField
                type="text"
                value={"Praveen"}
                disabled
                variant="outlined"
                color="error"
                focused
                sx={{ mt: 2, mb: 1 }}
              />{" "}
              <br />
              <TextField
                type="password"
                variant="outlined"
                color="error"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mt: 1, mb: 1 }}
              />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              fullWidth
              color="error"
              variant="contained"
              onClick={() => submitOnPasswordVerify()}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}

export default SiteRegistrationCom;
