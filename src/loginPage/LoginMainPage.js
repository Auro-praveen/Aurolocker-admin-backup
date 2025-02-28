import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./loginForm.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/Auth";
import { useLogDetails } from "../utils/UserLogDetails";

import Avatar from "@mui/material/Avatar"; //mater
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import PathUrl from "../GlobalVariable/urlPath.json";
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import PermissionJSON from "../GlobalVariable/permissions.json";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function LoginMainPage() {
  const [loginDetails, setLoginDetails] = useState({
    userName: "",
    userPassword: "",
  });

  const [logDetails, setLogDetails] = useState({
    eventType: "login",
    remarks: "logged_In_Successfully",
  });

  const [isActive, setIsActive] = useState(true);
  const [openState, setOpenState] = useState(false);
  const [openStateWarning, setOpenStateWarning] = useState(false);
  const [userPermissions, setUserPermissions] = useState([]);
  // const [allPermissions, setAllPermissions] = useState([]);

  // for the dailogue window open and close
  const [open, setOpen] = useState(false);

  useEffect(() => {
    window.addEventListener("beforeunload", (e) => {
      e.preventDefault();
      return (e.returnValue = "Are you sure you want to exit?");
    });
  }, []);


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const vertical = "top";
  const horizontal = "center";

  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const userLogs = useLogDetails();
  const redirectPath = location.pathname?.path || "/";

  // Hide All the Console.log
  // console.log = function () {};

  const handleLoginAuth = (e) => {
    setIsActive(false);
    // const baseUrl =
    //   "http://192.168.0.198:8080/AuroAutoLocker/FetchUserLoginDetails";

    e.preventDefault();
    console.log(loginDetails);
    if (loginDetails.userName && loginDetails.userPassword) {
      fetch(PathUrl.localServerPath + "FetchUserLoginDetails", {
        method: "POST",
        headers: {
          accept: "application/json",
        },
        body: JSON.stringify(loginDetails),
      })
        .then((resp) => resp.json())
        .then((data) => {
          if (data.userpresent) {
            if (data.responseCode === "mall-auth") {
              setLogDetails({ ...logDetails, username: loginDetails.userName });
              alert("logging in : " + loginDetails.userName);

              auth.mallAuthLogin(
                loginDetails.userName,
                data.siteName,
                data.siteLocation
              );

              const logDetObj = {
                ...logDetails,
                username: loginDetails.userName,
              };

              userLogs.storeUserLogs(logDetObj);

              navigate("/mall-auth", { replace: true });
            } else {
              let perm = data.permissions;
              // let allPerm = data.allPermissions;
              perm = perm.split("#").filter((permissions) => {
                return permissions;
              });
              // allPerm = allPerm.split("#").filter((perm) => {
              //   return perm;
              // });
              // setAllPermissions([allPerm]);
              setUserPermissions([perm]);

              console.log(perm);

              let appPermission = data.appAccessPerminassion;

              if (data.appAccessPerminassion === "NONE") {
                appPermission = ["MALL-LOCKERS"];
              } else {
                try {
                  appPermission = appPermission
                    .split(",")
                    .filter((appPerm) => appPerm);
                } catch (error) {
                  console.log("error :" + error);
                  appPermission = ["MALL-LOCKERS"];
                }
              }

              auth.handleAppPermissions(appPermission);

              setLogDetails({ ...logDetails, username: loginDetails.userName });
              alert("logging in : " + loginDetails.userName);
              auth.loginHandler(
                loginDetails.userName,
                [...PermissionJSON.permissions],
                [perm]
              );
              const logDetObj = {
                ...logDetails,
                username: loginDetails.userName,
              };
              userLogs.storeUserLogs(logDetObj);
              navigate(redirectPath, { replace: true });
            }

            setIsActive(false);
          } else if (data.status === "userExist") {
            setOpenStateWarning(true);
            handleClickOpen();
          } else {
            // alert("Please provide valid credentials !")
            setOpenState(true);
          }
          setIsActive(true);
        })
        .catch((err) => {
          setIsActive(true);
          console.log("err : " + err);
        });
    } else {
      alert("pleasse fill all the details");
      setIsActive(true);
    }
  };

  const fillInputData = (e) => {
    const name = e.target.name;
    setLoginDetails({ ...loginDetails, [name]: e.target.value });
  };

  const handlerCloseState = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenStateWarning(false);
    setOpenState(false);
  };

  const handleRemoveUSer = () => {
    auth.removeLoggedInUSer(loginDetails.userName);
    setOpen(false);
  };

  const checkAppDetails = async () => {
    const result = await fetch(PathUrl.localServerPath + "appVersion")
      .then((data) => {
        return data.json();
      })
      .catch((err) => {
        console.log("Error : " + err);
        alert("Failed to connect to server");
      });

    if (result) {
      alert("App : " + result.App + "  version = " + result.Version);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-form-container">
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1 }} autoComplete="off">
              <TextField
                onChange={(e) => fillInputData(e)}
                value={loginDetails.userName}
                type="text"
                name="userName"
                margin="normal"
                required
                fullWidth
                label="User name"
              />
              <TextField
                margin="normal"
                onChange={(e) => fillInputData(e)}
                type="password"
                value={loginDetails.userPassword}
                required
                fullWidth
                name="userPassword"
                label="Password"
              />

              {isActive ? (
                <Button
                  type="submit"
                  fullWidth
                  color="primary"
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={(e) => handleLoginAuth(e)}
                >
                  Sign In
                </Button>
              ) : (
                <LoadingButton
                  size="medium"
                  fullWidth
                  endIcon={<SendIcon />}
                  loadingPosition="end"
                  variant="contained"
                  loading
                >
                  please wait
                </LoadingButton>
              )}
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
              </Grid>
            </Box>

            {/* <Button variant="contained" onClick={() => checkAppDetails()}>
              Check Version
            </Button> */}

            <Snackbar
              open={openState}
              autoHideDuration={5000}
              anchorOrigin={{ vertical, horizontal }}
            >
              <Alert
                onClose={() => handlerCloseState()}
                severity="error"
                sx={{ width: "100%" }}
              >
                Please provide valid credentials !
              </Alert>
            </Snackbar>

            <Snackbar
              open={openStateWarning}
              autoHideDuration={5000}
              anchorOrigin={{ vertical, horizontal }}
            >
              <Alert
                onClose={() => handlerCloseState()}
                severity="warning"
                sx={{ width: "100%" }}
              >
                {loginDetails.userName + " "} already in use
              </Alert>
            </Snackbar>
          </Box>
        </Container>

        <Dialog
          open={open}
          // onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {loginDetails.userName + " "} Already in Use !!
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Do you want to remove the logged in user and login again ..?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              color="info"
              variant="outlined"
              onClick={() => handleClose()}
            >
              No
            </Button>
            <Button
              color="info"
              variant="outlined"
              onClick={() => handleRemoveUSer()}
              autoFocus
            >
              Ok
            </Button>
          </DialogActions>
        </Dialog>
      </div>

    </div>
  );
}

export default LoginMainPage;
