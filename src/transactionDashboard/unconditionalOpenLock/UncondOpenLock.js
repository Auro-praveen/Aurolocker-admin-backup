import React from "react";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import interval from "../../GlobalVariable/interval.json";
import LoadingButton from "@mui/lab/LoadingButton";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import SendIcon from "@mui/icons-material/Send";
import pathUrl from "../../GlobalVariable/urlPath.json";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FormHelperText from "@mui/material/FormHelperText";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useState } from "react";

import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { useRef } from "react";
import { useAuth } from "../../utils/Auth";

function UncondOpenLock(props) {
  const [btnLoading, setBtnLoading] = useState(false);
  const [isWarning, setIsWarning] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const [isChecked, setIsChecked] = useState(false)

  const [uncondOpenLockItems, setUncondOpenLockItems] = useState({
    MobileNo: props.currentNumber,
    terminalID: props.terminalID,
    PacketType: "uncndopenlock",
    LockerNo: [],
    ReqType: "",
    reason: "",
    remarks: "",
  });

  const Auth = useAuth()

  const timeInterval = useRef(null);
  var time = 3;

  const checkBoxEventHandler = (e) => {
    console.log(e.target.checked);
    console.log(e.target.value);
    
    if (e.target.checked) {
      setUncondOpenLockItems({
      ...uncondOpenLockItems,
      LockerNo:e.target.value,
    })
    setIsChecked(true);
    }
    // let locks = [...uncondOpenLockItems.LockerNo];
    // if (e.target.checked) {
    //   locks.push(e.target.value);
    //   setUncondOpenLockItems({
    //     ...uncondOpenLockItems,
    //     LockerNo: locks,
    //   });
    //   console.log(locks);
    // } else {
    //   const index = locks.indexOf(e.target.value);
    //   if (index !== -1) {
    //     locks.splice(index, 1);
    //     setUncondOpenLockItems({
    //       ...uncondOpenLockItems,
    //       LockerNo: locks,
    //     });
    //   }
    //   console.log(locks);
    // }
  };

  const timeIntervalFun = (type) => {
    let reqType = type;
    timeInterval.current = setInterval((reqType) => {
      time = time - 1;
      console.log(time);
      if (time < 0) {
        if (reqType === "success") {
          setIsSuccess(false);
        } else if (reqType === "warning") {
          setIsWarning(false);
        }
        setIsSuccess(false);
        setIsWarning(false);
        clearIntervalFun();
      }
    }, 1000);
  };

  if (isSuccess) {
    timeIntervalFun("success");
  } else if (isWarning) {
    timeIntervalFun("warning");
  } else if (isError) {
    timeIntervalFun("error");
  }

  const clearIntervalFun = () => {
    clearInterval(timeInterval.current);
  };

  const openLockFunction = () => {
    const dataObj = {
      ...uncondOpenLockItems,
    };

    delete dataObj.reason;
    delete dataObj.remarks;

    console.log("called");
    if (uncondOpenLockItems.LockerNo.length === 0) {
      setIsWarning(true);
    } else {
      fetch(Auth.serverPaths.serverUrl, {
        method: "POST",
        headers: {
          accept: "application/json",
        },
        body: JSON.stringify(uncondOpenLockItems),
      })
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data);

          if (data.responseCode === "REQAC-200") {
            fetchDataInDatabase();
          } else if (data.responseCode === "REQF-201") {
            setIsError(true);
          }
        })
        .catch((err) => {
          console.log("err : " + err);
        });
    }
  };

  // const dbStoreUrl =
  //   "http://192.168.0.198:8080/AuroAutoLocker/FetchTransactionDetails";
  const fetchDataInDatabase = () => {
    const Obj = {
      ...uncondOpenLockItems,
    };

    delete Obj.LockerNo;

    const respObj = {
      ...Obj,
      LOCKNO: uncondOpenLockItems.LockerNo,
      TransType: "internet",
    };

    fetch(Auth.serverPaths.localAdminPath+"FetchTransactionDetails", {
      method: "POST",
      headers: {
        accept: "application/json",
      },
      body: JSON.stringify(respObj),
    })
      .then((resp) => JSON.stringify(resp))
      .then((data) => {
        console.log(data);
        if (data.status === "success") {
          setUncondOpenLockItems({
            ...uncondOpenLockItems,
            LockerNo: [],
            ReqType: "",
            reason: "",
            remarks: "",
          });

          // for updating the db in databases;
          props.updateTransactionDetails(uncondOpenLockItems.terminalID);
          setIsSuccess(true);
          props.hideWindowVisible();
        } else {
          setIsError(true);
          props.hideWindowVisible();
          // alert("successfully stored");
        }
      });
  };

  const reasons = ["Internet Down", "Online Payment Down", "Other"];

  const closeWarningAlertWind = () => {
    setIsWarning(false);
    clearIntervalFun();
  };

  const closeSuccessAlertWind = () => {
    setIsSuccess(false);
    clearIntervalFun();
  };

  const closeErrorAlertWind = () => {
    setIsError(false);
    clearIntervalFun();
  };

  const eventHandler = (e) => {
    setUncondOpenLockItems({
      ...uncondOpenLockItems,
      [e.target.name]: e.target.value,
    });
  };

  const clearUnconditionalDetials = () => {
    setUncondOpenLockItems({
      ...uncondOpenLockItems,
      LockerNo: [],
      ReqType: "",
      reason: "",
      remarks: "",
    });

    clearIntervalFun();
  };

  return (
    <div>
      <Stack sx={{ width: "100%" }} spacing={2}>
        {isWarning && (
          <Alert severity="warning" onClose={() => closeWarningAlertWind()}>
            {" "}
            Warning! Please Select Lock
          </Alert>
        )}
        {isSuccess && (
          <Alert severity="success" onClose={() => closeSuccessAlertWind()}>
            {" "}
            Success! Lock opened Successfully
          </Alert>
        )}
        {isError && (
          <Alert severity="error" onClose={() => closeErrorAlertWind()}>
            {" "}
            Error! Something went Wrong!!
          </Alert>
        )}
      </Stack>

      <>
        <div className="window-header">
          <h2>Unconditional open lock </h2>
        </div>
        <IconButton
          className="closeIcon-btn"
          color="secondary"
          onClick={() => {
            clearUnconditionalDetials();
            props.hideWindowVisible();
          }}
        >
          <CloseIcon />
        </IconButton>

        <form>
          <Box
            component="form"
            //   sx={{
            //     "& > :not(style)": { m: 1 },
            //   }}
            // noValidate
            // onSubmit={() =>openLockFunction()}
            autoComplete="off"
          >
            <>
              <div className="textField-margin">
                <TextField
                  type="number"
                  name="currentNumber"
                  variant="outlined"
                  color="success"
                  label="Mobile Number"
                  size="medium"
                  value={props.currentNumber}
 
                  inputProps={{
                    readOnly: true,
                  }}
                  focused
                  required
                  fullWidth
                />
              </div>

              <div className="textField-margin">
                <TextField
                  type="text"
                  name="currentNumber"
                  variant="outlined"
                  color="success"
                  label="Terminal Id"
                  size="medium"
                  value={props.terminalID}
                  inputProps={{
                    readOnly: true,
                  }}
                  focused
                  required
                  fullWidth
                />
              </div>

              <div className="textField-margin">
                <TextField
                  type="text"
                  name="remarks"
                  variant="outlined"
                  color="success"
                  label="add Remarks"
                  size="medium"
                  onChange={(e) => eventHandler(e)}
                  value={uncondOpenLockItems.remarks}
                  focused
                  required
                  fullWidth
                />
              </div>

              <div className="textField-margin">
                <FormControl color="success" focused fullWidth required>
                  <InputLabel>Reason</InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    name="reason"
                    label="Reason"
                    size="medium"
                  
                    onChange={(e) => eventHandler(e)}
                    value={uncondOpenLockItems.reason}
                    required
                  >
                    {reasons.map((reason, index) => (
                      <MenuItem value={reason} key={index}>
                        {reason}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText color="warning">
                    Select the reason for Manual Override
                  </FormHelperText>
                </FormControl>
              </div>

              <div className="textField-margin">
                <FormControl focused fullWidth color="success" required>
                  <InputLabel>Request Type</InputLabel>
                  <Select
                    labelId="demo-simple-select-helper-label"
                    id="demo-simple-select-helper"
                    name="ReqType"
                    label="Request Type"
                    size="medium"
                    onChange={(e) => eventHandler(e)}
                    value={uncondOpenLockItems.ReqType}
                    required
                  >
                    <MenuItem value="uncndstore">Store</MenuItem>
                    <MenuItem value="uncndretrieve">Retrieve</MenuItem>
                  </Select>
                  <FormHelperText color="warning">
                    Select the Request Type
                  </FormHelperText>
                </FormControl>
              </div>

              <div className="textField-margin">
                <FormGroup row>
                  <FormLabel className="text-header" component="legend">
                    Choose Locks here to open unconditionally
                  </FormLabel>
                  <div className="textfield-checkbox-container">
                    {/* {props.lockNo.map((lock, index) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            color="success"
                            value={lock}
                            key={index}
                            onChange={(e) => checkBoxEventHandler(e)}
                          />
                        }
                        label={lock}
                      />
                    ))} */}

                      <FormControlLabel
                        control={
                          <Checkbox
                            color="success"
                            value={props.lockNo}
                            checked={isChecked}
                            onChange={(e) => checkBoxEventHandler(e)}
                          />
                        }
                        label={props.lockNo}
                      />

                  </div>
                </FormGroup>
              </div>
              <div className="textField-margin">
                {btnLoading ? (
                  <LoadingButton
                    loading
                    loadingPosition="end"
                    endIcon={<SendIcon />}
                    variant="contained"
                    fullWidth
                  >
                    opening lock ...
                  </LoadingButton>
                ) : (
                  <Button
                    variant="contained"
                    color="error"
                    endIcon={<SendIcon />}
                    onClick={() => openLockFunction()}
                    fullWidth
                  >
                    Open Lock
                  </Button>
                )}
              </div>
            </>
          </Box>
        </form>
      </>
    </div>
  );
}

export default UncondOpenLock;
