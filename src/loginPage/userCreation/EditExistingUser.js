import {
  Autocomplete,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Snackbar,
  Stack,
  TextField,
} from "@mui/material";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

import urlPath from "../../GlobalVariable/urlPath.json";
import LockerCatagoryTable from "../../settingsComponent/TableFunction/LockerCatagoryTable";

import MuiAlert from "@mui/material/Alert";
import { useAuth } from "../../utils/Auth";
import { useLogDetails } from "../../utils/UserLogDetails";
import Navbar from "../../mainDashBoard/Navbar";

import permissionJSON from "../../GlobalVariable/permissions.json";
import {
  commonApiForGetConenction,
  commonApiForPostConenction,
} from "../../GlobalVariable/GlobalModule";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="standard" {...props} />;
});

const EditExistingUser = () => {
  const [openConfirmDailogue, setOpenConfirmDailogue] = useState(false);

  const handleOpenDailgue = () => {
    console.log(userPermissionsBefore == givenUserPermission);
    console.log(userPermissionsBefore);
    console.log(givenUserPermission);
    setOpenConfirmDailogue(true);
  };

  const handleCloseDailgue = () => {
    setOpenConfirmDailogue(false);
  };

  const [openBackdrop, setOpenBackdrop] = useState(false);

  const [state, setState] = useState({
    vertical: "top",
    horizontal: "center",
  });

  const [userPermissionsBefore, setUserPermissionsBefore] = useState([]);

  const Auth = useAuth();

  const [userInfo, setUserInfo] = useState({
    uName: Auth.user,
    uPwd: "",
  });

  const userLogs = useLogDetails();
  const { vertical, horizontal } = state;

  const [isStoreSuccess, setIsStoreSuccess] = useState(false);
  const [isStoreFailed, setIsStoredFailed] = useState(false);
  const [isPasswordWrong, setIsPasswordWrong] = useState(false);

  const [selectedUser, setSelectedUser] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [allExistingUsers, setAllExistingUsers] = useState({
    slno: "",
    userName: "",
    status: "",
    type: "",
    userPermissions: "",
    appPermissions: "",
  });

  const [allUserPermissions, setAllUserPermissions] = useState({});

  const [editUserCreation, setEditUseCreation] = useState({
    userName: "",
    status: "",
    type: "",
    userPermissions: "",
    appPermissions: "",
    userId: "",
  });

  const [givenUserPermission, setGivenUserPermission] = useState([
    "transaction_details",
  ]);

  useEffect(() => {
    getAllExistingUsers();
  }, []);

  const getAllExistingUsers = () => {
    const getAllUsrObj = {
      PacketType: "getallusers",
    };

    fetch(Auth.serverPaths.localAdminPath + "UserOperationHandler", {
      method: "POST",
      headers: {
        accept: "applcation/json",
      },
      body: JSON.stringify(getAllUsrObj),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data.responseCode === "udetail-200") {
          setAllUsers(data.userName);
          setAllExistingUsers({
            ...allExistingUsers,
            slno: data.slno,
            userName: data.userName,
            status: data.status,
            type: data.types,
            userPermissions: data.userPermissions,
            appPermissions: data.appPermissions,
          });
        } else if (data.responseCode === "udetail-201") {
          setAllUsers([]);
          setAllExistingUsers({
            ...allExistingUsers,
            slno: "",
            userName: "",
            status: "",
            type: "",
            userPermissions: "",
            appPermissions: "",
          });
        }
      })
      .catch((err) => {
        console.log("err : " + err);
      });
  };

  const getSelectedUserNameDetails = (username) => {
    const getUserDetObj = {
      PacketType: "getuserdetails",
      userName: username,
    };

    fetch(Auth.serverPaths.localAdminPath + "UserOperationHandler", {
      method: "POST",
      headers: {
        accept: "applcation/json",
      },
      body: JSON.stringify(getUserDetObj),
    })
      .then((resp) => resp.json())
      .then((data) => {
        if (data.responseCode === "user-200") {
          // console.log(data.appPermission.join(","));

          console.log(data);
          

          setEditUseCreation({
            ...editUserCreation,
            userName: username,
            status: data.status,
            type: data.types,
            // allPermissions: data.allPermissions,
            userPermissions: data.userPermissions,
            userId: data.user_id,
            appPermissions: data.appPermissions
              ? data.appPermissions.split(",")
              : "",
          });

          // allPermissionsHandler(
          //   String(data.allPermissions),
          //   String(data.userPermissions)
          // );

          allPermissionsHandler(String(data.userPermissions));
        } else if (data.responseCode === "user-202") {
          alert("you cant the change user. User type is Mall-Authority");
          setEditUseCreation({
            userName: "",
            status: "",
            type: "",
            // allPermissions: data.allPermissions,
            userPermissions: "",
            userId: "",
            appPermissions: "",
          });
        } else if (data.responseCode === "user-201") {
          setEditUseCreation({
            userName: "",
            status: "",
            type: "",
            // allPermissions: data.allPermissions,
            userPermissions: "",
            userId: "",
            appPermissions: "",
          });
        }
      })
      .catch((err) => {
        console.log("err : " + err);
      });
  };

  const handleSelecteUser = (e) => {
    setSelectedUser(e.target.value);
    getSelectedUserNameDetails(e.target.value);
  };

  const allPermissionsHandler = (userPerm) => {
    // let allPermArr = allPerm.split("#");
    let userPermArr = userPerm.split("#");

    // allPermArr = allPermArr.filter(function (el) {
    //   return el != "";
    // });

    userPermArr = userPermArr.filter(function (el) {
      return el != "";
    });

    setUserPermissionsBefore([...userPermArr]);

    let givenPermObj = {};
    // let nonGivenPermObj = {}

    setGivenUserPermission([...userPermArr]);
    console.log(userPermArr);

    permissionJSON.permissions.map((val) => {
      givenPermObj = {
        ...givenPermObj,
        [val]: userPermArr.includes(val) ? true : false,
      };
    });

    setAllUserPermissions({ ...givenPermObj });

    // console.log(allPermArr);
    // console.log(userPermArr);
  };

  const onSelectedPermissions = (e) => {
    if (e.target.checked) {
      setGivenUserPermission([...givenUserPermission, e.target.value]);
      if (
        givenUserPermission.length + 1 ===
        Object.keys(allUserPermissions).length
      ) {
        setEditUseCreation({
          ...editUserCreation,
          type: "Admin",
        });
      } else {
        setEditUseCreation({
          ...editUserCreation,
          type: "Sub-Admin",
        });
      }
    } else {
      if (givenUserPermission.includes(e.target.value)) {
        const index = givenUserPermission.indexOf(e.target.value);
        setEditUseCreation({
          ...editUserCreation,
          type: "Sub-Admin",
        });
        if (index > -1) {
          const copiedPerm = [...givenUserPermission];
          copiedPerm.splice(index, 1);
          setGivenUserPermission([...copiedPerm]);
        }
      }
    }
  };

  const onSubmitEditedUserCreation = () => {
    handleCloseDailgue();
    if (
      givenUserPermission.length > 0 &&
      editUserCreation.appPermissions.length > 0
    ) {
      setOpenBackdrop(false);
      const userPermissionsStr =
        givenUserPermission.toString().replaceAll(",", "#") + "#";
      // const allPerm = Object.keys(allUserPermissions).map((perm) => {
      //   return perm;
      // });

      // const allPermissionsStr = allPerm.toString().replaceAll(",", "#") + "#";

      const appPerm = editUserCreation.appPermissions.join(",");

      const userEditedPermissions = {
        ...editUserCreation,
        ...userInfo,
        PacketType: "edituser",
        userPermissions: userPermissionsStr,
        appPermissions: appPerm,
        // allPermissions: allPermissionsStr,
      };

      console.log("on sending to update user");

      console.log(userEditedPermissions);

      fetch(Auth.serverPaths.localAdminPath + "SaveUserCreation", {
        method: "POST",
        headers: {
          accept: "applocation/json",
        },
        body: JSON.stringify(userEditedPermissions),
      })
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data);

          if (data.responseCode === "upduser-200") {
            getAllExistingUsers();

            const userLog = {
              eventType: "editUser",
              remarks:
                "user name : " +
                editUserCreation.userName +
                " permissions have been updated by user: " +
                userInfo.uName,
            };

            userLogs.storeUserLogs(userLog);

            setIsStoreSuccess(true);
            setOpenBackdrop(false);
          } else if (data.responseCode === "upduser-202") {
            setIsStoredFailed(true);
            setOpenBackdrop(false);
          } else if (data.responseCode === "pwd-404") {
            setIsPasswordWrong(true);
            setOpenBackdrop(false);
          }
        })

        .catch((err) => {
          setOpenBackdrop(false);
          setIsStoredFailed(true);
          console.log("er : " + err);
        });
    }
  };

  function closeAlert() {
    setIsPasswordWrong(false);
    setIsStoreSuccess(false);
    setIsStoredFailed(false);
  }

  const userPasswordHandler = (e) => {
    setUserInfo({
      ...userInfo,
      uPwd: e.target.value,
    });
  };

  async function deleteUserPermenently(slno, username) {
    const obj = {
      PacketType: "DEL_USER",
      userId: slno,
    };

    const uname = "praveen";

    if (
      Auth.user.toLowerCase() === "praveen" &&
      username.toLowerCase() !== "praveen"
    ) {
      const res = await commonApiForPostConenction(
        "UserOperationHandler",
        obj,
        Auth.accessAppType
      );
      if (res) {
        if (res.status === "DEL-200") {
          alert(`user: ${username} deleted successfully`);
          getAllExistingUsers();
        } else if (res.status === "DEL-400") {
          alert("user not deleted");
        }
      } else {
        alert("some server error");
      }
    } else {
      alert(`${Auth.user} is not authorized for this operation`);
    }
  }

  const onChooseAppPermissions = (value) => {
    setEditUseCreation({
      ...editUserCreation,
      appPermissions: value,
    });
  };

  return (
    <>
      <Navbar />
      <div className="components-below-navbar">
        <div className="user-creation-container">
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={openBackdrop}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <Box sx={{ width: "100%" }}>
            <Snackbar
              anchorOrigin={{ vertical, horizontal }}
              open={isPasswordWrong}
              autoHideDuration={6000}
              onClose={() => {
                closeAlert();
              }}
            >
              <Alert
                onClose={() => {
                  closeAlert();
                }}
                severity="warning"
              >
                Provided Password is Wrong.
              </Alert>
            </Snackbar>

            <Snackbar
              anchorOrigin={{ vertical, horizontal }}
              open={isStoreFailed}
              autoHideDuration={6000}
              onClose={() => {
                closeAlert();
              }}
            >
              <Alert
                onClose={() => {
                  closeAlert();
                }}
                severity="error"
              >
                Something went wrong, please try again!
              </Alert>
            </Snackbar>

            <Snackbar
              anchorOrigin={{ vertical, horizontal }}
              open={isStoreSuccess}
              autoHideDuration={6000}
              onClose={() => {
                closeAlert();
              }}
            >
              <Alert
                onClose={() => {
                  closeAlert();
                }}
                severity="success"
              >
                Changes Stored Successfully !
              </Alert>
            </Snackbar>
          </Box>

          <div className="user-form-container">
            <div className="form-header">
              <h2>Edit User Permissions Here</h2>
            </div>
            <Box
              sx={{ minWidth: 120, alignItems: "center", textAlign: "center" }}
            >
              <FormControl style={{ width: "300px", margin: "5px" }}>
                <InputLabel id="demo-simple-select-label">User Name</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedUser}
                  label="User Name"
                  onChange={(e) => handleSelecteUser(e)}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        textAlign: "center",
                        alignItems: "center",
                        width: "300px",
                      },
                    },
                  }}
                >
                  {allUsers.map((user, index) => (
                    <MenuItem
                      style={{ width: "100%", textAlign: "center" }}
                      value={user}
                      key={index}
                    >
                      {user}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                sx={{
                  width: "300px",
                  m: "5px",
                }}
                label="Type"
                value={editUserCreation.type}
                InputProps={{
                  readOnly: true,
                }}
                required
              />

              <TextField
                sx={{
                  width: "300px",
                  m: "5px",
                }}
                label="Status"
                value={editUserCreation.status}
                InputProps={{
                  readOnly: true,
                }}
                required
              />
              <br />
              {editUserCreation.type ? (
                <FormControl
                  sx={{ m: 3 }}
                  component="fieldset"
                  variant="standard"
                >
                  <FormLabel>
                    <b>Choose User Permissions !</b>
                  </FormLabel>
                  <FormGroup>
                    {Object.keys(allUserPermissions).map(
                      (permission, index) => (
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={
                                permission === "transaction_details"
                                  ? true
                                  : givenUserPermission.includes(permission)
                                  ? true
                                  : false
                              }
                              key={index}
                              value={permission}
                              onChange={(e) => onSelectedPermissions(e)}
                              name={permission}
                            />
                          }
                          label={permission}
                        />
                      )
                    )}
                  </FormGroup>
                  <FormHelperText>
                    Remember You are altering the given permissions !
                  </FormHelperText>
                </FormControl>
              ) : null}
              <br />

              {editUserCreation.type && (
                <div className="auto-compelete-container">
                  <Stack
                    sx={{
                      width: 300,
                      textAlign: "center",
                      m: "auto",
                      mt: 2,
                      mb: 2,
                    }}
                  >
                    <Autocomplete
                      multiple
                      options={permissionJSON.appAccessAllowed.map(
                        (appPermission) => appPermission
                      )}
                      getOptionLabel={(option) => option}
                      filterSelectedOptions
                      onChange={(e, value) => onChooseAppPermissions(value)}
                      renderInput={(params, index) => (
                        <TextField
                          {...params}
                          key={index + 1}
                          label="App Permissions"
                          placeholder="Choose Terminal Names..."
                          focused
                        />
                      )}
                    />
                  </Stack>
                </div>
              )}
              <br />
              <Button
                variant="contained"
                color="warning"
                disabled={
                  editUserCreation.status !== ""
                    ? false
                    : editUserCreation.type !== ""
                    ? false
                    : true
                }
                sx={{
                  width: "320px",
                }}
                onClick={() => handleOpenDailgue()}
              >
                submit
              </Button>
            </Box>
          </div>

          <Dialog open={openConfirmDailogue} onClose={handleCloseDailgue}>
            <DialogTitle>Enter your Password To Continue</DialogTitle>
            <DialogContent>
              <DialogContentText>
                To Edit The User Permissions Your need to provide your password
                for security purpose
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Enter Password"
                type="password"
                fullWidth
                variant="standard"
                onChange={(e) => userPasswordHandler(e)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDailgue}>cancel</Button>
              <Button onClick={onSubmitEditedUserCreation}>Submit</Button>
            </DialogActions>
          </Dialog>

          {allExistingUsers.slno ? (
            <LockerCatagoryTable
              tableData={allExistingUsers}
              tableType={"users"}
              selectedRowFun={deleteUserPermenently.bind(this)}
            />
          ) : null}
        </div>
      </div>
    </>
  );
};

export default EditExistingUser;
