import React, { useEffect, useState } from "react";

import {
  lockerDaysType,
  timeSlot,
  lockerCategories,
  commonApiForGetConenction,
  commonApiForPostConenction,
} from "../../GlobalVariable/GlobalModule";

import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";


import {
  Backdrop,
  Button,
  CircularProgress,
  Collapse,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

import { pink } from "@mui/material/colors";
import Checkbox from "@mui/material/Checkbox";

import PathUrl from "../../GlobalVariable/urlPath.json";

import Navbar from "../../mainDashBoard/Navbar";
import "./LockerLockCatagoryDes.css";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { useLogDetails } from "../../utils/UserLogDetails";
import { useAuth } from "../../utils/Auth";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const LockCategoryNewReg = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [terminalIds, setTerminalIds] = useState([]);
  const [openDailogue, setOpenDailogue] = useState(false);
  const [opentypeofDayChange, setOpenTypeOfDayChange] = useState(false);
  const [changedDayType, setChangedDayType] = useState(false);

  const [storeSuccessDailogue, setStoreSuccessDailogue] = useState(false);

  const [editTOD, setEditTOD] = useState({
    weekDay: false,
    weekEnd: false,
  });

  const [weeklyOverriteDailogue, setWeeklyOverriteDailogue] = useState(false);

  const [openAlert, setOpenAlert] = useState(false);

  const [newLockCategoryObject, setNewLockCategoryObject] = useState({
    terminalId: "",
    siteLoc: "",
    Category: [],
    typeOfDay: "",
  });

  const [weeklySlot, setWeeklySlot] = useState({
    WeekDay: { amount: {} },
    WeekEnd: { amount: {} },
  });

  // const [hours, setHours] = useState({});

  // const addHourSlot = (e) => {};

  const useLogs = useLogDetails();
  const Auth = useAuth()

  useEffect(() => {
    getTerminalIds();
  }, []);

  const handleNewRegLockObject = (e) => {
    // alert("got request")
    const name = e.target.name;

    if (name === "Category") {
      let category = [...newLockCategoryObject.Category];

      if (!e.target.checked) {
        category.splice(category.indexOf(e.target.value), 1);

        console.log(category);

        setNewLockCategoryObject({
          ...newLockCategoryObject,
          [name]: category,
        });
      } else {
        category.push(e.target.value);

        console.log(category);

        setNewLockCategoryObject({
          ...newLockCategoryObject,
          [name]: category,
        });
      }
    } else if (name === "terminalId") {
      // alert(e.target.value)
      setWeeklySlot({
        WeekDay: { amount: {} },
        WeekEnd: { amount: {} },
      });

      setNewLockCategoryObject({
        terminalId: e.target.value,
        siteLoc: "",
        Category: [],

        typeOfDay: "",
      });
    } else if (name === "typeOfDay") {
      if (newLockCategoryObject.Category.length > 0) {
        let typeDay = newLockCategoryObject.typeOfDay;

        if (typeDay === "WeekDay") {
          if (!editTOD.weekDay) {
            setOpenTypeOfDayChange(true);
          } else if (editTOD.weekDay && editTOD.weekEnd) {
            // onChangeAfterSelectingWeekDay(e.target.value)
            setWeeklyOverriteDailogue(true);
          } else {
            setChangedDayType(false);
            setNewLockCategoryObject({
              ...newLockCategoryObject,
              Category: [],
              typeOfDay: e.target.value,
            });
          }
        } else {
          if (!editTOD.weekEnd) {
            setOpenTypeOfDayChange(true);
          } else if (editTOD.weekDay && editTOD.weekEnd) {
            // onChangeAfterSelectingWeekDay(e.target.value)
            setWeeklyOverriteDailogue(true);
          } else {
            setChangedDayType(false);
            setNewLockCategoryObject({
              ...newLockCategoryObject,
              Category: [],
              typeOfDay: e.target.value,
            });
          }
        }
      } else {
        setWeeklySlot({
          WeekDay: { amount: {} },
          WeekEnd: { amount: {} },
        });

        setChangedDayType(false);

        setNewLockCategoryObject({
          ...newLockCategoryObject,
          Category: [],
          typeOfDay: e.target.value,
        });
      }
    } else {
      setNewLockCategoryObject({
        ...newLockCategoryObject,
        [name]: e.target.value,
      });
    }
  };

  // function onChangeAfterSelectingWeekDay(daySelected) {

  //   setWeeklyOverriteDailogue(true)

  // }

  const changeValueAsPerSelected = (value) => {
    setOpenTypeOfDayChange(false);
    setWeeklySlot({
      WeekDay: { amount: {} },
      WeekEnd: { amount: {} },
    });

    setChangedDayType(false);

    setNewLockCategoryObject({
      ...newLockCategoryObject,

      Category: [],

      typeOfDay: value === "WeekDay" ? "WeekEnd" : "WeekDay",
    });
  };

  const handleWeeklySlots = (e) => {
    const value = e.target.value;
    const name = e.target.name;

    // console.log( weeklySlot[newLockCategoryObject.typeOfDay].amount["Small"]);

    // console.log(e.target.name);

    // console.log(weeklySlot);
    // const xx = "amountAnr"

    if (name.match("amount")) {
      let nameVal;

      if (name.match("Small")) {
        nameVal = "Small";
      } else if (name.match("Medium")) {
        nameVal = "Medium";
      } else if (name.match("eLarge")) {
        nameVal = "eLarge";
      } else if (name.match("Large")) {
        nameVal = "Large";
      }

      // alert(nameVal)
      let amountArr =
        weeklySlot[newLockCategoryObject.typeOfDay].amount[nameVal];

      // console.log(amountArr);

      if (amountArr === undefined) {
        amountArr = [0, 0, 0, 0, 0, 0];

        // alert("inside undefined")
      }

      // let arr = [1,2,3,4]

      if (name.match("Min")) {
        amountArr.splice(0, 1, e.target.value);
      } else if (name.match("12")) {
        amountArr.splice(5, 1, e.target.value);
      } else if (name.match("3")) {
        amountArr.splice(2, 1, e.target.value);
      } else if (name.match("5")) {
        amountArr.splice(3, 1, e.target.value);
      } else if (name.match("8")) {
        amountArr.splice(4, 1, e.target.value);
      } else if (name.match("1")) {
        amountArr.splice(1, 1, e.target.value);
      }

      setWeeklySlot((prevVal) => ({
        ...prevVal,
        [newLockCategoryObject.typeOfDay]: {
          ...prevVal[newLockCategoryObject.typeOfDay],
          ["amount"]: {
            ...prevVal[newLockCategoryObject.typeOfDay].amount,
            [nameVal]: [...amountArr],
          },
        },
      }));
    } else {
      setWeeklySlot((prevVal) => ({
        ...prevVal,
        [newLockCategoryObject.typeOfDay]: {
          ...prevVal[newLockCategoryObject.typeOfDay],
          [name]: value,
        },
      }));
    }
  };

  const getTerminalIds = async () => {
    await commonApiForGetConenction(
      Auth.serverPaths.localAdminPath + "SaveLockerCategory"
    )
      .then((data) => {
        console.log(data);
        // JSON.parse(data)

        if (data != null) {
          setTerminalIds(data);
        } else {
          setTerminalIds([])
        }

        
      })
      .catch((err) => {
        console.log("err :" + err);
        setTerminalIds([])
      });
    setIsLoading(false);
  };

  const closeDailogue = () => {
    setOpenDailogue(false);
  };

  const resetWeeklyDataOnProceed = (dayType) => {
    setWeeklyOverriteDailogue(false);

    // setChangedDayType(false);
    setNewLockCategoryObject({
      ...newLockCategoryObject,
      Category: [],
      typeOfDay: dayType,
    });

    if (dayType === "WeekEDay") {
      setWeeklySlot({
        ...weeklySlot.WeekEnd,
        WeekDay: { amount: {} },
      });

      setEditTOD({
        ...editTOD,
        weekDay: false,
      });
    } else {
      setWeeklySlot({
        ...weeklySlot.WeekDay,
        WeekEnd: { amount: {} },
      });

      setEditTOD({
        ...editTOD,
        weekEnd: false,
      });
    }
  };

  const handleDayTypeLockCatSubmission = (typeOfDay) => {
    if (typeOfDay === "WeekDay") {
      const isLockFormInvalid = verifyUserEnteredDetails(weeklySlot.WeekDay);

      console.log(isLockFormInvalid);

      if (isLockFormInvalid) {
        alert(
          "From Entered Form No of Lockers and Locks didnt match, please verify again before submitting"
        );
      } else {
        setOpenDailogue(true);
      }
    } else {
      const isLockFormInvalid = verifyUserEnteredDetails(weeklySlot.WeekEnd);

      if (isLockFormInvalid) {
        alert(
          "From Entered Form No of Lockers and Locks didnt match, please verify again before submitting"
        );
      } else {
        setOpenDailogue(true);
      }
    }
  };

  function verifyUserEnteredDetails(LockObject) {
    // const obj = {one: "1"}
    let isFormInvalid = false;

    for (const keys in LockObject) {
      if (keys.includes("Small")) {
        const noOfLocks = LockObject.NoOfLocksSmall;
        const locks = LockObject.LocksSmall.split(",");

        // console.log(locks.length);
        // console.log(noOfLocks);

        // const arr = [1,3,4]

        if (noOfLocks != locks.length && !isFormInvalid) {
          // alert("Please provide the valid details!")
          isFormInvalid = true;
        }
      } else if (keys.includes("Medium")) {
        const noOfLocks = LockObject.NoOfLocksMedium;
        const locks = LockObject.LocksMedium.split(",");

        // const arr = [1,3,4]

        if (noOfLocks != locks.length && !isFormInvalid) {
          // alert("Please provide the valid details!")

          isFormInvalid = true;
          break;
        }
      } else if (keys.includes("eLarge")) {
        const noOfLocks = LockObject.NoOfLockseLarge;
        const locks = LockObject.LockseLarge.split(",");

        // const arr = [1,3,4]

        if (noOfLocks != locks.length && !isFormInvalid) {
          // alert("Please provide the valid details!")
          isFormInvalid = true;
          break;
        }
      } else if (keys.includes("Large")) {
        const noOfLocks = LockObject.NoOfLocksLarge;
        const locks = LockObject.LocksLarge.split(",");

        // const arr = [1,3,4]

        if (noOfLocks != locks.length && !isFormInvalid) {
          // alert("Please provide the valid details!")
          isFormInvalid = true;
          break;
        }
      }
    }

    // Object.keys(LockObject).forEach(keys => {

    // });

    return isFormInvalid;
  }

  const handleSubmitForDayType = (name) => {
    if (name === "WeekDay") {
      setEditTOD({
        ...editTOD,
        weekDay: true,
      });
    } else {
      setEditTOD({
        ...editTOD,
        weekEnd: true,
      });
    }

    setChangedDayType(true);

    setOpenAlert(true);
    closeDailogue();
  };

  const submitLockerCategoryForNew = async () => {

    setIsLoading(true)
    let reqObj = { ...newLockCategoryObject, slot: { ...weeklySlot } };

    // console.log(newLockCategoryObject);
    // console.log(weeklySlot);

    console.log(reqObj);

    await commonApiForPostConenction("SaveLockerCategory", reqObj, Auth.accessAppType)
      .then((data) => {
        console.log(data);

        if (data.responseCode === 200) {
          setStoreSuccessDailogue(true);
          fetchToUserLogs();
        } else {
          alert("Something went wrong Please try Again Later or Contact Admin");
        }

        setWeeklySlot({
          WeekDay: { amount: {} },
          WeekEnd: { amount: {} },
        });

        setNewLockCategoryObject({
          terminalId: "",
          siteLoc: "",
          Category: [],

          typeOfDay: "",
        });

        setEditTOD({
          weekDay :false,
          weekEnd: false
        })

        getTerminalIds();

        setIsLoading(false);

      })
      .catch((err) => {
        alert("Something went wrong Please try Again Later or Contact Admin");
        console.log("err : " + err);

        setWeeklySlot({
          WeekDay: { amount: {} },
          WeekEnd: { amount: {} },
        });

        setNewLockCategoryObject({
          terminalId: "",
          siteLoc: "",
          Category: [],

          typeOfDay: "",
        });

        setEditTOD({
          weekDay :false,
          weekEnd: false
        })

        getTerminalIds();


  
        setIsLoading(false)

      });


  };

  const fetchToUserLogs = () => {
    const fetchObj = {
      eventType: "Locker Category",
      remarks: "New Locker Category Settings been Added",
    };
    useLogs.storeUserLogs(fetchObj);
  };

  return (
    <>
      <Navbar />

      <Collapse in={openAlert} onClick={() => setOpenAlert(false)}>
        <Alert severity="success">This is a success Alert.</Alert>
      </Collapse>

      <div className="components-below-navbar">
        <div className="locks-window-container" id="blurr-window-id"></div>

        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        <div className="locker-catagory-container">
          <div className="locker-locks-form">
            <div className="locks-form-container">
              <div className="locker-catagory-head">
                <h2>Locker Locks Catagory</h2>
              </div>

              {terminalIds.length > 0 ? (
                <>
                  <FormControl
                    focused
                    required
                    sx={{
                      width: 300,
                      m: 1,
                    }}
                  >
                    <InputLabel>Terminal Id</InputLabel>
                    <Select
                      labelId="demo-simple-select-helper-label"
                      id="terminal_id"
                      name="terminalId"
                      label="terminal Id"
                      size="medium"
                      onChange={(e) => handleNewRegLockObject(e)}
                      value={newLockCategoryObject.terminalId}
                      required
                    >
                      {terminalIds.map((terminalid, index) => (
                        <MenuItem value={terminalid} key={index}>
                          {terminalid}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText color="warning">
                      Choose the terminal id's
                    </FormHelperText>
                  </FormControl>

                  <TextField
                    type="text"
                    id="outlined-read-only-input"
                    value={newLockCategoryObject.siteLoc}
                    label="siteLocation"
                    name="siteLoc"
                    onChange={(e) => handleNewRegLockObject(e)}
                    InputProps={{
                      readOnly: false,
                    }}
                    sx={{
                      width: 300,
                      m: 1,
                    }}
                    focused
                  />

                  {newLockCategoryObject.terminalId != "" && (
                    <FormControl
                      required
                      focused
                      sx={{
                        width: 300,
                        m: 1,
                      }}
                      // error={isLockCatEmpty}
                    >
                      <InputLabel>Type of Days</InputLabel>
                      <Select
                        labelId="demo-simple-select-helper-label"
                        name="typeOfDay"
                        id="catagories_id"
                        label="Type of Day"
                        size="medium"
                        onChange={(e) => handleNewRegLockObject(e)}
                        value={newLockCategoryObject.typeOfDay}
                        required
                      >
                        {lockerDaysType.map((dayType, index) => (
                          <MenuItem value={dayType} key={index}>
                            {dayType}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText color="warning">
                        choose ,type of a day
                      </FormHelperText>
                    </FormControl>
                  )}

                  {/* <FormControl
                required
                focused
                sx={{
                  width: 300,
                  m: 1,
                }}
                // error={isLockCatEmpty}
              >
                <InputLabel>Locker Type</InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  name="Category"
                  id="catagories_id"
                  label="Type of Day"
                  size="medium"
                  onChange={(e) => handleNewRegLockObject(e)}
                  value={newLockCategoryObject.Category}
                  required
                >
                  {lockerCategories.map((lockCategory, index) => (
                    <MenuItem value={lockCategory} key={index}>
                      {lockCategory}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText color="warning">
                  choose a Locker Type
                </FormHelperText>
              </FormControl> */}

                  {newLockCategoryObject.typeOfDay != "" && !changedDayType && (
                    <div className="checkbox_container">
                      <div className="checkbox_container2_style">
                        {lockerCategories.map((locks, index) => (
                          <FormControlLabel
                            label={locks}
                            value={locks}
                            name="Category"
                            key={index}
                            control={
                              <Checkbox
                                // defaultChecked

                                checked={newLockCategoryObject.Category.includes(
                                  locks
                                )}
                                sx={{
                                  color: pink[800],
                                  "&.Mui-checked": {
                                    color: pink[600],
                                  },
                                }}
                              />
                            }
                            sx={{
                              ":last-child": {
                                mb: 5,
                              },
                            }}
                            onChange={(e) => handleNewRegLockObject(e)}
                          />
                        ))}

                        {/* <FormControlLabel
                              label="Child 1"
                              value={"child q"}
                              control={
                                <Checkbox
                                  defaultChecked
                                  sx={{
                                    color: pink[800],
                                    "&.Mui-checked": {
                                      color: pink[600],
                                    },
                                  }}
                                  onChange={(e) => handleNewRegLockObject(e)}
                                />
                              }
                              /> */}
                      </div>
                    </div>
                  )}

                  <br />

                  {!changedDayType &&
                    newLockCategoryObject.Category.map((value, index) => (
                      <LocksAsPerCategory
                        key={index}
                        objForLockerLock={newLockCategoryObject}
                        handleLockObj={handleNewRegLockObject.bind(this)}
                        title={`Lockers as Per Selected To ${value} Category Locks`}
                        lockCategory={value}
                        weeklySot={weeklySlot}
                        selectedWeekType={newLockCategoryObject.typeOfDay}
                        handleWeeklySot={handleWeeklySlots.bind(this)}
                      />
                    ))}
                </>
              ) : (
                <>
                  <div className="no-term-alertWindow">
                    <h4 style={{
                      color: "crimson"
                    }}>
                    No New TerminalIds
                    </h4>
                    <hr style={{color:"#ff5121"}} />
                    <p>
                      If Its not a new terminal id and you have already entered the locker settings
                      for that terminalid please select edit lockerCategories to edit the locker category settings.
                    </p>
                  </div>
                </>
              )}

              {newLockCategoryObject.Category.length > 0 && !changedDayType && (
                <div>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() =>
                      handleDayTypeLockCatSubmission(
                        newLockCategoryObject.typeOfDay
                      )
                    }
                    className="btndaytype"
                  >
                    {" "}
                    {"Submit " + newLockCategoryObject.typeOfDay}{" "}
                  </Button>
                </div>
              )}

              {editTOD.weekDay && editTOD.weekEnd && (
                <div>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => submitLockerCategoryForNew()}
                    className="finalsubmitbtn-lock-cat"
                  >
                    Submit Locker Category
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog
        open={openDailogue}
        TransitionComponent={Transition}
        onClose={() => closeDailogue()}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{`Verify Details for ${newLockCategoryObject.typeOfDay}`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Please Verify Details That You Have Entered Before Submitting for{" "}
            {newLockCategoryObject.typeOfDay}, Only After Submitting for both
            the TypeOfDays Final Submit Button will appear. And it submits All
            The Data.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => closeDailogue()}>cancel</Button>
          <Button
            onClick={() =>
              handleSubmitForDayType(newLockCategoryObject.typeOfDay)
            }
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={opentypeofDayChange}
        TransitionComponent={Transition}
        onClose={() => setOpenTypeOfDayChange(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{`Are You Sure You Want to change the Type of day ?`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            The values that you have entered for the
            {newLockCategoryObject.typeOfDay} is going to lose, if you change
            the day before submitting for the current type of day. If You Want
            so please click on continue.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTypeOfDayChange(false)}>Close</Button>
          <Button
            onClick={() =>
              changeValueAsPerSelected(newLockCategoryObject.typeOfDay)
            }
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={storeSuccessDailogue}
        TransitionComponent={Transition}
        onClose={() => setStoreSuccessDailogue(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <div className="dailogue-content">
          <DialogTitle
            sx={{ margin: "auto", color: "#dbd141", textAlign: "center" }}
          >{`Locker Category Has Been Stored Successfully`}</DialogTitle>
          <DialogContent>
            <DialogContentText
              id="alert-dialog-slide-description"
              sx={{ color: "#fff" }}
            >
              The Locker Category Registration has been successfully stored for
              the new terminal Id = {newLockCategoryObject.terminalId}, If You
              Want Edit Locker Category In Future go to edit locker category.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setStoreSuccessDailogue(false)}
              variant="outlined"
              fullWidth
              color="inherit"
              sx={{
                bgcolor: "#85b390",
              }}
            >
              OK
            </Button>
          </DialogActions>
        </div>
      </Dialog>

      <Dialog
        open={weeklyOverriteDailogue}
        TransitionComponent={Transition}
        onClose={() => setWeeklyOverriteDailogue(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <div className="dailogue-content-warning">
          <DialogTitle
            sx={{ margin: "auto", color: "#dbd141", textAlign: "center" }}
          >{`Do You Want Override Data ?`}</DialogTitle>
          <DialogContent>
            <DialogContentText
              id="alert-dialog-slide-description"
              sx={{ color: "#fff" }}
            >
              You Have Already Entered the Lock Details for the for{" "}
              {newLockCategoryObject.typeOfDay === "WeekDay"
                ? "WeekEnd"
                : "WeekDay"}
              {". "}If You Want to Override the Details that you have entered ,
              please Click On Proceed.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setWeeklyOverriteDailogue(false)}
              variant="outlined"
              fullWidth
              color="inherit"
              sx={{
                bgcolor: "#d9a673",
              }}
            >
              Cancel
            </Button>

            <Button
              onClick={() =>
                resetWeeklyDataOnProceed(
                  newLockCategoryObject.typeOfDay === "WeekDay"
                    ? "WeekEnd"
                    : "WeekDay"
                )
              }
              variant="outlined"
              fullWidth
              color="inherit"
              sx={{
                bgcolor: "#d9a673",
              }}
            >
              Proceed
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </>
  );
};

function LocksAsPerCategory(props) {
  return (
    <>
      <div className="hours_slot_container">
        <div className="locker-catagory-head">
          <h4>{props.title}</h4>
        </div>

        <FormControl>
          <TextField
            type="number"
            inputMode="number"
            id="outlined-read-only-input"
            // value={newLockCategoryObject.NoOfLocks}
            value={props.weeklySot[props.selectedWeekType[props.lockCategory]]}
            label="No Of Lockers"
            name={"NoOfLocks" + props.lockCategory}
            onChange={(e) => props.handleWeeklySot(e)}
            InputProps={{
              readOnly: false,
            }}
            sx={{
              width: 250,
              m: 1,
            }}
            focused
            required
          />
          <FormHelperText color="warning">
            Provided Number Should Match total Locks Below
          </FormHelperText>
        </FormControl>

        <FormControl>
          <TextField
            type="text"
            id="outlined-read-only-input"
            // value={newLockCategoryObject.Locks}
            value={props.weeklySot[props.selectedWeekType[props.lockCategory]]}
            label="Lockers"
            name={"Locks" + props.lockCategory}
            // onChange={(e) => handleNewRegLockObject.handleNewRegLockObject(e)}
            onChange={(e) => props.handleWeeklySot(e)}
            InputProps={{
              readOnly: false,
            }}
            sx={{
              width: 250,
              m: 1,
            }}
            focused
            required
          />
          <FormHelperText color="warning">
            If More than One Locks, seperate Them by comma(,)
          </FormHelperText>
        </FormControl>

        <div className="current-amount-container">
          <h6 className="amount-container-heaer">Amount Slot : </h6>

          {timeSlot.map((time, index) =>
            index === 0 ? (
              <FormControl key={index}>
                <TextField
                  // type="number"
                  inputMode="number"
                  // value={time}
                  value={
                    props.weeklySot[
                      props.selectedWeekType["amount"[props.lockCategory]]
                    ]
                  }
                  name={"amountMin" + props.lockCategory}
                  label={"1 minute"}
                  color="warning"
                  sx={{
                    width: 130,
                    m: 1,
                  }}
                  // onChange={(e) => addHourSlot(e)}
                  onChange={(e) => props.handleWeeklySot(e)}
                  required
                  focused
                />
                <FormHelperText>in Paise</FormHelperText>
              </FormControl>
            ) : (
              <FormControl key={index}>
                <TextField
                  type="number"
                  // value={time}
                  value={
                    props.weeklySot[
                      props.selectedWeekType["amount"[props.lockCategory]]
                    ]
                  }
                  name={props.lockCategory + "amountHr" + time}
                  label={"Hour : " + time}
                  color="warning"
                  sx={{
                    width: 130,
                    m: 1,
                  }}

                  // inputMode="tel"
                  inputProps={{
                    inputMode : "numeric",
                    step: 'any'
                  }}
                  // onChange={(e) => addHourSlot(e)}
                  onChange={(e) => props.handleWeeklySot(e)}
                  required
                  focused
                />
                <FormHelperText>in Rupees</FormHelperText>
              </FormControl>
            )
          )}
        </div>
      </div>
    </>
  );
}

export default LockCategoryNewReg;
