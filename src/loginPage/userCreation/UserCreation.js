import "./userCreation.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { useAuth } from "../../utils/Auth";
import { useLogDetails } from "../../utils/UserLogDetails";
import PathUrl from "../../GlobalVariable/urlPath.json";
import {
  Autocomplete,
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  InputLabel,
  NativeSelect,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../mainDashBoard/Navbar";

import PermissionJSon from "../../GlobalVariable/permissions.json";

function UserCreation() {
  const [isDisabled, setIsDisabled] = useState(false);

  const [allPermissions, setAllPermissions] = useState({
    transaction_details: false,
    transaction_history: false,
    refund: false,
    user_creation: false,
    locker_operation: false,
    locker_category: false,
    site_registration: false,
    release_locker: false,
    firmware_update: false,
    charts: false,
    xl_access: false,
  });

  const [allSiteLocations, setAllSiteLocations] = useState([]);
  const [allSiteNames, setAllsiteNames] = useState([]);

  const [givenUserPermission, setGivenUserPermission] = useState([
    "transaction_details",
  ]);

  const [givenAppPermissions, setGivenAppPermissions] = useState([
    PermissionJSon.appAccessAllowed[0],
  ]);

  const navigate = useNavigate();

  const [data, setData] = useState({
    userName: "",
    userPassword: "",
    userType: "",
    userStatus: "",
    userPermissions: "",
    siteName: "",
    siteLocation: "",
    appPermissions: "",
  });

  const userLogs = useLogDetails();

  useEffect(() => {
    fetchLocationInfo();
  }, []);

  let slectedValue = (e) => {
    const inputName = e.target.name;
    setData({
      ...data,
      [inputName]: e.target.value,
    });
  };

  const fetchLocationInfo = () => {
    const reqObj = {
      PacketType: "getloc",
    };
    fetch(Auth.serverPaths.localAdminPath + "UserOperationHandler", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },

      body: JSON.stringify(reqObj),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.responseCode === "siteloc-200") {
          setAllSiteLocations([...data.siteLocation]);
          setData({
            ...data,
            siteLocation: data.siteLocation[0],
          });
          setAllsiteNames([...data.siteName]);
        } else if (data.responseCode === "siteloc-404") {
          alert("no-site locations found");
        }
      })

      .catch((err) => {
        console.log("Error : " + err.message);
      });
  };

  // let userPermissionFun = (e) => {
  //   e.preventDefault();
  //   setPermission(e.target.value);
  //   e.target.value = "Choose From Dropdown";
  // };

  const Auth = useAuth();
  const useLogs = useLogDetails();

  const textAreaWindow = document.getElementById("text-container-id");

  // let userPermissionType = (e) => {
  //   e.preventDefault();
  //   console.log("inside logg");
  //   console.log(permission + " : " + e.target.value);

  //   setPermissionType({ ...permissionType, [permission]: e.target.value });
  //   textAreaWindow.style.display = "block";
  //   e.target.value = "Choose From Dropdown";
  // };

  //axios call in react

  function sendUserReg(e) {
    e.preventDefault();
    setIsDisabled(false);
    // const baseURL = "http://192.168.0.198:8080/AuroAutoLocker/SaveUserCreation";

    //copting two objects to single object
    // console.log("asdfasdfsadfasdfsda---------"
    // +"-------------------------sdafasdfasdf------------");

    // console.log("printing here ")

    // console.log(data.siteLocation !== "")
    // console.log(data.siteName !== "")
    // console.log(data.userName.length > 3)
    // console.log(data.userPassword.length > 3)
    // console.log(data.userStatus !== "")
    // console.log(data.userType !== "")

    if (data.userType === "Mall-Authority") {
      if (
        data.siteLocation !== "" &&
        data.siteName.length > 0 &&
        data.userName.length > 2 &&
        data.userPassword.length > 3 &&
        data.userStatus !== "" &&
        data.userType !== ""
      ) {
        storeUserIntoDb(e);
      } else {
        alert("Please fill all the details !");
        console.log(data);
      }
    } else {
      if (
        data.siteLocation !== "" &&
        data.siteName.length > 0 &&
        data.userName.length > 2 &&
        data.userPassword.length > 3 &&
        data.userStatus !== "" &&
        data.userType !== "" &&
        data.appPermissions.length > 0
      ) {
        storeUserIntoDb(e);
      } else {
        alert("Please fill all the details !");
        console.log(data);
      }
    }

    // setIsDisabled(false);
  }

  const storeUserIntoDb = (e) => {
    const userPermissionsStr =
      givenUserPermission.toString().replaceAll(",", "#") + "#";
    // const allPerm = Object.keys(allPermissions).map((perm) => {
    //   return perm;
    // });

    // const allPermissionsStr = allPerm.toString().replaceAll(",", "#") + "#";
    // console.log(allPermissionsStr);

    let appPerm;

    console.log(data);
    

    if (data.appPermissions  && data.appPermissions.length > 0) {
      appPerm = data.appPermissions.join(",");
    } else {
      appPerm = "";
    }

    const userCreationData = {
      ...data,
      PacketType: "saveuser",
      userPermissions: userPermissionsStr,
      appPermissions: appPerm,
      // allPermissions: allPermissionsStr,
    };

    console.log(userCreationData);
    fetch(Auth.serverPaths.localAdminPath + "SaveUserCreation", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },

      body: JSON.stringify(userCreationData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.userexist) {
          alert("userName already exist");
        } else {
          if (data.status === "success") {
            alert("stored successfully");

            const userLog = {
              eventType: "userCreattion",
              remarks:
                "new user created as userName: " + userCreationData.userName,
            };

            userLogs.storeUserLogs(userLog);
            fetchToUserLogs();
            e.target.reset();
            navigate("/");
          } else {
            alert("something went wrong");
          }
        }
      })

      .catch((err) => {
        alert("some server error");
        console.log("Error : " + err.message);
      });
  };

  //userLogsDetails
  const fetchToUserLogs = () => {
    const fetchObj = {
      username: Auth.user,
      eventType: "userCreation",
      remarks: "user created successfully",
    };
    useLogs.storeUserLogs(fetchObj);
  };

  //   if (!post) return "No post!"

  const onSelectedPermissions = (e) => {
    console.log(e.target.value);
    console.log("is checked : " + e.target.checked);
    if (e.target.checked) {
      setGivenUserPermission([...givenUserPermission, e.target.value]);
    } else {
      if (givenUserPermission.includes(e.target.value)) {
        const index = givenUserPermission.indexOf(e.target.value);

        if (index > -1) {
          const copiedPerm = [...givenUserPermission];

          copiedPerm.splice(index, 1);
          setGivenUserPermission([...copiedPerm]);
        }
      }
    }
  };

  const onChooseLocationChangeEvent = (val) => {
    console.log(val);

    setData({ ...data, siteLocation: val });
  };

  const onChooseSiteNameChangeEvent = (val) => {
    console.log(val);
    setData({ ...data, siteName: val });
  };

  const onChooseAppPermissions = (val) => {
    console.log(val);
    setData({ ...data, appPermissions: val });

    console.log(data);
  };

  return (
    <>
      <Navbar />
      <div className="components-below-navbar">
        <div className="user-creation-container">
          <div className="user-form-container">
            <div className="form-header">
              <h2>User Creation</h2>
            </div>

            <div className="form-container">
              <form
                onSubmit={(e) => {
                  sendUserReg(e);
                }}
              >
                <TextField
                  onChange={(e) => slectedValue(e)}
                  type="text"
                  name="userName"
                  value={data.userName}
                  color="primary"
                  label="user name"
                  sx={{
                    w: 350,
                    m: 2,
                  }}
                  helperText="length should be greater than 3"
                  required
                  focused
                  autoComplete="new-password"
                />

                <TextField
                  onChange={(e) => slectedValue(e)}
                  value={data.userPassword}
                  type="password"
                  name="userPassword"
                  label="user Password"
                  sx={{
                    w: 350,
                    m: 2,
                  }}
                  focused
                  helperText="length should be greater than 3"
                  required
                  autoComplete="new-password"
                />

                <Box>
                  <FormControl
                    sx={{
                      m: 1,
                      width: 250,
                      textAlign: "center",
                    }}
                    focused
                  >
                    <InputLabel variant="standard" color="info" required>
                      user type
                    </InputLabel>
                    <NativeSelect
                      defaultValue={30}
                      variant="filled"
                      color="primary"
                      inputProps={{
                        name: "userType",
                      }}
                      value={data.userType}
                      required
                      onChange={(e) => slectedValue(e)}
                    >
                      {PermissionJSon.user_type.map((userType, index) => (
                        <option
                          className="option-container"
                          value={userType}
                          key={index}
                        >
                          {userType}
                        </option>
                      ))}
                    </NativeSelect>
                  </FormControl>
                </Box>

                {/* <TextField
                  onChange={(e) => slectedValue(e)}
                  value={data.userType}
                  type="text"
                  name="userType"
                  label="user type"
                  sx={{
                    w: 350,
                    m: 2,
                  }}
                  focused
                  required
                  autoComplete="off"
                /> */}

                {/* <div className="auto-complete-container">
                  <Stack spacing={3} m={2} sx={{ width: 300 }}>
                    <Autocomplete
                      multiple
                      options={allSiteLocations.map((siteLoc) => siteLoc)}
                      getOptionLabel={(option) => option}
                      filterSelectedOptions
                      onChange={(e, value) =>
                        onChooseLocationChangeEvent(value)
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Site Location"
                          placeholder="Choose Location..."
                          
                        />
                      )}
                    />
                  </Stack>
                </div> */}

                <Box>
                  <FormControl
                    sx={{
                      m: 1,
                      width: 250,
                      textAlign: "center",
                    }}
                    focused
                  >
                    <InputLabel variant="standard" color="info" required>
                      Site Location
                    </InputLabel>
                    <NativeSelect
                      defaultValue={30}
                      variant="filled"
                      color="primary"
                      inputProps={{
                        name: "siteLocation",
                      }}
                      value={data.siteLocation}
                      required
                      onChange={(e) => slectedValue(e)}
                    >
                      {allSiteLocations.map((siteLoc, index) => (
                        <option
                          className="option-container"
                          value={siteLoc}
                          key={index}
                        >
                          {siteLoc}
                        </option>
                      ))}
                    </NativeSelect>
                  </FormControl>
                </Box>

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
                      options={allSiteNames.map((siteName) => siteName)}
                      getOptionLabel={(option) => option}
                      filterSelectedOptions
                      onChange={(e, value) =>
                        onChooseSiteNameChangeEvent(value)
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Site Names"
                          placeholder="Choose Terminal Names..."
                          focused
                        />
                      )}
                    />
                  </Stack>
                </div>

                {/* 
                <Box>
                  <FormControl
                    sx={{
                      m: 1,
                      width: 250,
                      textAlign: "center",
                    }}
                    focused
                  >
                    <InputLabel variant="standard" color="info" required>
                      user type
                    </InputLabel>
                    <NativeSelect
                      defaultValue={30}
                      variant="filled"
                      color="primary"
                      inputProps={{
                        name: "siteName",
                      }}
                      value={data.siteName}
                      required
                      onChange={(e) => slectedValue(e)}
                    >
                      {allSiteNames.map((siteName, index) => (
                        <option
                          className="option-container"
                          value={siteName}
                          key={index}
                        >
                          {siteName}
                        </option>
                      ))}
                    </NativeSelect>
                  </FormControl>
                </Box> */}

                <TextField
                  onChange={(e) => slectedValue(e)}
                  value={data.userStatus}
                  type="text"
                  name="userStatus"
                  label="user status"
                  sx={{
                    w: 350,
                    m: 2,
                  }}
                  focused
                  required
                  autoComplete="off"
                  // helperText={
                  //   data.userType === "Mall-Authority"
                  //     ? "Please Provide a single Terminal Id For Mall-Authority"
                  //     : ""
                  // }
                />

                {data.userType !== "Mall-Authority" && (
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
                        options={PermissionJSon.appAccessAllowed.map(
                          (appPermission) => appPermission
                        )}
                        getOptionLabel={(option) => option}
                        filterSelectedOptions
                        onChange={(e, value) => onChooseAppPermissions(value)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="App Permissions"
                            placeholder="Choose Terminal Names..."
                            focused
                          />
                        )}
                      />
                    </Stack>
                  </div>
                )}

                {data.userType !== "Mall-Authority" && (
                  <Box sx={{ display: "block" }}>
                    <FormControl
                      sx={{ m: 3 }}
                      component="fieldset"
                      variant="standard"
                    >
                      <FormLabel>
                        <b>Choose User Permissions !</b>
                      </FormLabel>
                      <FormGroup>
                        {PermissionJSon.permissions.map((permission, index) => (
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={
                                  permission === "transaction_details"
                                    ? true
                                    : allPermissions[index]
                                }
                                key={index}
                                value={permission}
                                onChange={(e) => onSelectedPermissions(e)}
                                name={permission}
                              />
                            }
                            label={permission}
                          />
                        ))}
                      </FormGroup>
                      <FormHelperText>
                        Please Choose the permissions !
                      </FormHelperText>
                    </FormControl>
                  </Box>
                )}

                <div>
                  <input
                    type="submit"
                    value="Submit"
                    className="btn submitBtn"
                    disabled={isDisabled}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserCreation;
