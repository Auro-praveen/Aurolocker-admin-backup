import React, { useRef, useState } from "react";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import interval from "../../GlobalVariable/interval.json";
import LoadingButton from "@mui/lab/LoadingButton";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import SendIcon from "@mui/icons-material/Send";
import pathUrl from '../../GlobalVariable/urlPath.json'

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useLogDetails } from "../../utils/UserLogDetails";
import { useAuth } from "../../utils/Auth";

function ChangeMobileNo(props) {
  const [changeMobileNumberItems, setChangeMobileNumberItems] = useState({
    PacketType: "mobnchange",
    MobileNo: props.currentNumber,
    newMobileNo: "",
    terminalID:props.terminalID
  });

  const [count, setCount] = useState(0);
  const [otp, setOtp] = useState("");
  const [otpFieldVisible, setOtpFiledVisible] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const [saveBtnLoading, setSaveBtnLoading] = useState(false)
  const [sendOtpLoading, setSendOtpLoading] = useState(false)
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false)

  const Auth = useAuth();
  // const fetchUrl =
  //   "http://192.168.0.198:8080/AuroAutoLocker/UpdateMobileNumber";

  const eventHandler = (e) => {
    if (e.target.value.length <= 10) {
      setChangeMobileNumberItems({
        ...changeMobileNumberItems,
        newMobileNo: e.target.value,
      });
    }
  };

  const [isLoading, setIsLoading] = useState(false)

  const useLogDetials = useLogDetails()

  // to change the number
  // first hit the server if response is true then make changes in other db

  const changeNumberRequestToServer = () => {

    setIsLoading(true)
    fetch(Auth.serverPaths.serverUrl, {
      method: "POST",
      headers: {
        accept: "application/json",
      },
      body: JSON.stringify(changeMobileNumberItems),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data.responseCode === "REQAC-200") {
          SaveNewNumber()
          setIsLoading(false)
        } else if (data.responseCode === "REQFNTE-201") {
          alert("something went wrong")
          props.hideWindowVisible();
          setIsLoading(false)
        }
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  }

  // for changing the number in common database
  const SaveNewNumber = () => {
    console.log(changeMobileNumberItems);

    fetch(Auth.serverPaths.localAdminPath+"UpdateMobileNumber", {
      method: "POST",
      headers: {
        accept: "application/json",
      },
      body: JSON.stringify(changeMobileNumberItems),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data.status === "success") {
          setChangeMobileNumberItems({
            ...changeMobileNumberItems,
            MobileNo:"",
            newMobileNo:"",
            terminalID:""
          })
          const userLogsObj = {
            eventType: "changeMobileNumber",
            remarks: changeMobileNumberItems.MobileNo+ " is changed to "+changeMobileNumberItems.newMobileNo
          }

          useLogDetials.storeUserLogs(userLogsObj);
          props.fetchDetails(changeMobileNumberItems.terminalID);
          props.hideWindowVisible();
        } else {
          
          props.hideWindowVisible();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  var time = 60;
  //  console.log(interval.intervalID)
  let interval = useRef(null);

  // to send otp
  const SendOtp = () => {
    const sendOtpItems = {
      PacketType: "genotp",
      MobileNo: changeMobileNumberItems.MobileNo,
    };

    fetch(Auth.serverPaths.localAdminPath+"UpdateMobileNumber", {
      method: "POST",
      headers: {
        accept: "application/json",
      },
      body: JSON.stringify(sendOtpItems),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data.responseCode === "otpgen") {
          setOtpFiledVisible(!otpFieldVisible);
          timeCountFun();
        }
      })
      .catch((err) => {
        console.log("err : ", err);
      });
  };

  const timeCountFun = () => {
    interval.current = setInterval(() => {
      time = time - 1;
      console.log(time);
      if (interval) {
        setCount(time);
        if (time === 0) {
          setCount(0)
          clearIntervalFun();
        }
      } else{
        clearIntervalFun();
      }
    }, 1000);
  };

  // to verify otp
  const verifyOtpFuncion = () => {
    if (otp.length === 4) {
      const sendOtpItems = {
        otp: otp,
        PacketType: "verotp",
        MobileNo: changeMobileNumberItems.MobileNo,
      };

      fetch(Auth.serverPaths.localAdminPath+"UpdateMobileNumber", {
        method: "POST",
        headers: {
          accept: "application/json",
        },
        body: JSON.stringify(sendOtpItems),
      })
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data);
          if (data.responseCode === "verotpsuc") {
            clearIntervalFun();
            setOtpVerified(true);
          } else {
            alert("otp does'nt match");
          }
        })
        .catch((err) => {
          console.log("err : ", err);
          clearIntervalFun();
        });
    } else {
      alert("please enter a valid otp");
    }
  };

  const clearIntervalFun = () => {
    setCount(0);
    clearInterval(interval.current);
    
    // setOtpFiledVisible(!otpFieldVisible)
  };

  const otpEventHandler = (e) => {
    // console.log(otp.length)
    if (e.target.value.length <= 4) {
      setOtp(e.target.value);
    }
  };
  return (
    <div>
      {
        isLoading 
        ?
        
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
        // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      :
      <>
      <div className="window-header">
        <h2>Change Your Phone Number</h2>
      </div>
      <IconButton
        className="closeIcon-btn"
        color="secondary"
        onClick={() => {
          clearIntervalFun();
          props.hideWindowVisible();
        }}
      >
        <CloseIcon />
      </IconButton>

      <Box
        component="form"
        sx={{
          "& > :not(style)": { m: 1 },
        }}
        // noValidate
        autoComplete="off"
      >
        {otpVerified ? (
          <>
            <TextField
              type="number"
              name="newNumber"
              variant="outlined"
              label="Enter new Number"
              color="success"
              value={changeMobileNumberItems.newMobileNo}
              onChange={(e) => eventHandler(e)}
              required
              focused
              fullWidth
            />
            {
              saveBtnLoading
              ?
              <LoadingButton
              loading
              loadingPosition="end"
              endIcon={<SaveIcon />}
              variant="contained"
              fullWidth
            >
              Changing Number ...
            </LoadingButton>
            :
            <Button
              variant="contained"
              color="primary"
              endIcon={<SaveIcon />}
              onClick={() => changeNumberRequestToServer()}
              fullWidth
            >
              submit
            </Button>
            }
          </>
        ) : otpFieldVisible && count > 0 ? (
          <>
            <h3 className="otp-count">Enter OTP in {count}</h3>
            <TextField
              type="number"
              color="warning"
              label="enter otp"
              name="otp"
              value={otp}
              onChange={(e) => otpEventHandler(e)}
              fullWidth
              focused
            />

            {
              verifyOtpLoading
              ?
              <LoadingButton
              loading
              loadingPosition="end"
              endIcon={<ThumbUpIcon />}
              variant="contained"
              fullWidth
            >
              verifying otp ...
            </LoadingButton>
            :
            <Button
              variant="contained"
              color="warning"
              endIcon={<ThumbUpIcon />}
              onClick={() => verifyOtpFuncion()}
              fullWidth
            >
              Verify OTP
            </Button>
            }
          </>
        ) : (
          <>
            <TextField
              type="number"
              name="currentNumber"
              variant="outlined"
              color="success"
              label="Old Number"
              value={changeMobileNumberItems.MobileNo}
              inputProps={{
                readOnly: true,
              }}
              focused
              required
              fullWidth
            />
            {
              sendOtpLoading
              ?

              <LoadingButton
              loading
              loadingPosition="end"
              endIcon={<SendIcon />}
              variant="contained"
              fullWidth
            >
              sending otp ...
            </LoadingButton>
              :
              <Button
              variant="contained"
              color="warning"
              endIcon={<SendIcon />}
              onClick={() => SendOtp()}
              fullWidth
            >
              Send Otp
            </Button>
            }
            </>
        )}
      </Box>
      </>

      }
    </div>
  );
}

export default ChangeMobileNo;
