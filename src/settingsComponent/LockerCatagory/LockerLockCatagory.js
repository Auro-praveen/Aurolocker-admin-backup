import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle";
import "./LockerLockCatagoryDes.css";
import LockerCatagoryTable from "../TableFunction/LockerCatagoryTable";
// import { FaAdjust } from 'react-icons/fa'; //importing react icons
import FadeLoader from "react-spinners/FadeLoader";

import { useAuth } from "../../utils/Auth";
import { useLogDetails } from "../../utils/UserLogDetails";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Checkbox from "@mui/material/Checkbox";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";

import PathUrl from "../../GlobalVariable/urlPath.json";
import {
  Alert,
  Collapse,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import Navbar from "../../mainDashBoard/Navbar";
import LockCategoryNewReg from "./LockCategoryNewReg";

// from material ui
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const LockerLockCatagory = () => {
  const [isLoading, setISLoading] = useState(false);
  const [terminalIds, setTerminalIds] = useState([]);
  const [locationName, setLocationName] = useState();
  const [hourSlot, setHourSlot] = useState([]);
  const [hourAmountSlot, setHourAmountSlot] = useState([]);
  const [allLocks, setAllLocks] = useState();
  const [minuteSlot, setMinuteSlot] = useState();
  const [minuteAmountSlot, setMinuteAmountSlot] = useState();
  const [openAlert, setOpenAlert] = useState(false)
  const [openErrorAlert, setOpenErrorAlert] = useState(false)

  const [openConfirmDailogue, setOpenConfirmDailogue] = useState(false);

  const [locksDetail, setLocksDetails] = useState({
    terminalId: "",
    locksSelected: "",
    locName: "",
    totNoOfLocks: "",
    catagory: "",
    slotTime: "",
    typeOfDay: "",
  });

  const [tableData, setTableData] = useState({
    SlNo: "",
    TerminalId: "",
    Location: "",
    NoOfLockers: "",
    Locks: "",
    Catagory: "",
    SlotTime: "",
    Amount: "",
    dayType: "",
    Minute_Slot: "",
    Minute_Slot_Amount: "",
  });



  const [changedAmountSlot, setChangeAmountSlot] = useState({
    Hour1: "",
    Hour3: "",
    Hour5: "",
    Hour8: "",
    Hour12: "",
  });

  const [updatedMinuteAmount, setUpdatedMinuteAmount] = useState();

  const Auth = useAuth();
  const useLogs = useLogDetails();

  const targetInput = (e) => {
    e.preventDefault();
    const targetName = e.target.name;

    setLocksDetails({
      ...locksDetail,
      [targetName]: e.target.value,
    });
  };

  //For selecting locks from the user input tag

  // let selectingLocks = (e) => {
  //   e.preventDefault();
  //   const targetName = e.target.name;
  //   const targetValue = e.target.value;

  //   if(targetValue > noOfLockers) {
  //     alert("no locks on that number")
  //   } else  if(targetValue.match('/[a-zA-Z]+/g')) {
  //     alert("Alphabets are not allowed")
  //   }
  //    else {
  //     setLocksDetails({...locksDetail , [targetName] : targetValue });
  //   }
  // }

  const [catagoriesName, setCategoriesName] = useState([]);
  const [typeOfDays, setTypeOfDays] = useState([]);
  const [isLockCatEmpty, setIsLockCatEmpty] = useState(false);

  //fetch terminal id
  // const getTerminalIds =
  //   "http://192.168.0.198:8080/AuroAutoLocker/LockerLocksDetails";

  useEffect(() => {
    setISLoading(true);
    fetch(Auth.serverPaths.localAdminPath + "LockerLocksDetails", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((jsonData) => {
        const termId = jsonData.terminalId;
        setTerminalIds(termId);
      })
      .catch((err) => {
        console.log("err = ", err);
      });
    setISLoading(false);
  }, []);

  // to fetch lockers category to table
  useEffect(() => {
    fetchDataToTable();
  }, []);

  // const baseUrl = "http://192.168.0.198:8080/AuroAutoLocker/LockerLocksDetails";

  // submit the form
  const saveLockDetails = (e) => {
    e.preventDefault();
    setOpenConfirmDailogue(true);
  };




  //fetch location name and no of lockers of corresponding terminal id from backend
  const fetchFromTerminalId = (e) => {
    e.preventDefault();
    setISLoading(true);
    const selectedVal = e.target.value;

    clearFormContent();
    const lockerDetailsObj = {
      PacketType: "getlockcatdet",
      terminalID: selectedVal, 
    };

    fetch(Auth.serverPaths.localAdminPath + "FetchLocksDetail", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify(lockerDetailsObj),
    })
      .then((response) => response.json())
      .then((data) => {
        // setNoOfLockers(data.noLockers);
        // setLocationName(data.locationName);

        if (data.responseCode === "lcatpresent") {
          console.log(data);
          setCategoriesName(data.categories);
          setLocationName(data.location);
          setTypeOfDays(data.typeofday);

          setLocksDetails({
            ...locksDetail,
            terminalId: selectedVal,
            catagory: "",
            typeOfDay: "",
          });
          setHourSlot([]);
          setAllLocks();


        } else if (data.responseCode === "nolockcat") {

          setCategoriesName([]);
          setLocationName();
          setTypeOfDays([]);

          setLocksDetails({
            ...locksDetail,
            terminalId: selectedVal,
          });

        }

        // setLocksDetails({
        //   ...locksDetail,
        //   totNoOfLocks: data.noLockers,
        //   terminalId: value,
        //   locName: data.locationName,
        // });

        setISLoading(false);
      })

      .catch((err) => {
        console.log("err :" + err);
        setISLoading(false);
      });
  };

  const fetchDataToTable = (e) => {
    setISLoading(true);
    // const fetchTableUrl =
    //   "http://192.168.0.198:8080/AuroAutoLocker/FetchLocksDetail";

    console.log("-----------called again --------------");
    fetch(Auth.serverPaths.localAdminPath + "FetchLocksDetail", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setTableData({
          ...tableData,
          SlNo: data.slno,
          TerminalId: data.termId,
          Location: data.siteName,
          NoOfLockers: data.noOfLocks,
          Locks: data.locks,
          Catagory: data.catagory,
          SlotTime: data.slotTime,
          Amount: data.amount,
          TypeOfDay: data.typeOfDay,
          Minute_Slot: data.minuteslot,
          Minute_Slot_Amount: data.minuteslotamount,
        });

        setISLoading(false);
      })
      .catch((err) => {
        console.log("err " + err);

        setISLoading(false);
      });
  };

  // const lockIconSelect = (e) => {
  //   const lockIcon = document.getElementsByClassName("lock-icon-class");
  //   for (let i = 0; i < lockIcon.length; i++) {
  //     lockIcon[i].addEventListener('click', function () {
  //       console.log("clicked");
  //     })

  //   }
  // }

  const fetchToUserLogs = (termId) => {
    const fetchObj = {
      eventType: "lockerCatagory",
      remarks: "Locker Settings Edit for terminal ID : "+termId,
    };
    useLogs.storeUserLogs(fetchObj);
  };

  const lockerTypeSelect = (e) => {
    clearFormContent();
    setLocksDetails({
      ...locksDetail,
      catagory: e.target.value,
      typeOfDay: "",
    });
    setHourSlot([]);
    setAllLocks();
    setIsLockCatEmpty(false);

    // getSlectedLockCatDetials(e.target.value);
  };

  const getSlectedLockCatDetials = (daytype) => {
    setISLoading(true);

    clearFormContent();
    const reqObj = {
      PacketType: "lockcatdet",
      terminalID: locksDetail.terminalId,
      lockCat: locksDetail.catagory,
      dayType: daytype,
    };

    fetch(Auth.serverPaths.localAdminPath + "FetchLocksDetail", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify(reqObj),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data.responseCode === "lockcatdetavail") {
          setHourSlot(data.hourslot);
          setHourAmountSlot(data.hoursamount);
          setMinuteSlot(data.minuteslot);
          setMinuteAmountSlot(data.minuteslotamount);
          setAllLocks(data.alllocks);
          setLocksDetails({
            ...locksDetail,
            totNoOfLocks: data.numberoflocks,
            typeOfDay: daytype,
          });
        }
        setISLoading(false);
      })
      .catch((err) => {
        console.log("errr : " + err);
        setISLoading(false);
      });
  };

  const selectDayTypeEvent = (e) => {
    if (locksDetail.catagory !== "") {
      clearFormContent();
      getSlectedLockCatDetials(e.target.value);
    } else {
      setIsLockCatEmpty(true);
    }
  };

  const changeAmountEvent = (e) => {
    const val = e.target.value;
    const name = e.target.name;

    setChangeAmountSlot({
      ...changedAmountSlot,
      [name]: val,
    });
  };

  const closeConfirmDailgueAlert = () => {
    setOpenConfirmDailogue(false);
  };

  const storeTheChangesMadeFun = () => {
    setISLoading(true);

    let hourAmountSlot = "";

    Object.values(changedAmountSlot).map((val, index) => {
      if (hourSlot[index + 1]) {
        hourAmountSlot += hourSlot[index] + "HOUR" + val + "#";
      } else {
        hourAmountSlot += hourSlot[index] + "HOUR" + val;
      }
    });

    const storeObj = {
      PacketType: "updatelockscat",
      terminalID: locksDetail.terminalId,
      dayType: locksDetail.typeOfDay,
      lockerCategory: locksDetail.catagory,
      minuteSlot: minuteSlot,
      minuteAmountSlot: updatedMinuteAmount,
      slotTime: hourAmountSlot,
    };
    closeConfirmDailgueAlert();
    console.log(storeObj);

    fetch(Auth.serverPaths.localAdminPath + "LockerLocksDetails", {
      method: "POST",
      headers: {
        Accept: "application/json",
        // "Content-Type": "application/json"
      },
      body: JSON.stringify(storeObj),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.responseCode === "success") {
          setOpenAlert(true)
          fetchDataToTable();
          fetchToUserLogs(locksDetail.terminalId);
        } else {
          setOpenErrorAlert(true)
        }

        setISLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setISLoading(false);
        setOpenErrorAlert(true)
      });
  };

  const updateMinuteAmountFun = (e) => {
    setUpdatedMinuteAmount(e.target.value);
  };

  const clearFormContent = () => {
    setUpdatedMinuteAmount("");
    setMinuteSlot("");
    setChangeAmountSlot({
      ...changedAmountSlot,
      Hour1: "",
      Hour3: "",
      Hour5: "",
      Hour8: "",
      Hour12: "",
    });
  };

  return (
    <>
      <Navbar />

      <Collapse in={openAlert} onClick={() => setOpenAlert(false)}>
        <Alert severity="success">Changes Applied Successfully</Alert>
      </Collapse>

      <Collapse in={openErrorAlert} onClick={() => setOpenErrorAlert(false)}>
        <Alert severity="error">Some Error Occured While Updating</Alert>
      </Collapse>

      <div className="components-below-navbar">
        <div className="locks-window-container" id="blurr-window-id"></div>

        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        {/* <div className="locks-window" id="locks-container-id">
        <button
          onClick={() => {
            closeLocksWindowBtn();
          }}
          id="close-locks-window-id"
          className="close-locks-window"
        >
          <FaRegWindowClose color="#ff267d" size="25" />
        </button>
        <div className="window-btn-container">
          <button
            onClick={collectSelectedLocks}
            className="btn selected-locks-btn"
          >
            {" "}
            confirm selected locks ...{" "}
          </button>
        </div>
        <div className="all-locks">
          <table className="table">
            <tbody>
              {selectLocks.map((lock, index) => {
                let name;
                if (lock === 1) {
                  lock = 50;
                  name = "S";
                } else if (lock === 2) {
                  lock = 65;
                  name = "M";
                } else if (lock === 3) {
                  lock = 80;
                  name = "L";
                }

                return (
                  <>
                    <tr>
                      <td
                        onClick={selectLocksFromIconFun.bind(this, index + 1)}
                        // rowSpan={lock===80 ? 4 :  lock === 65 ? 3 : lock === 50 ? 2 : 1}
                        rowSpan="2"
                        name="selectedVal"
                        key={index + 1}
                        className="lockBox-icon"
                      >
                        {/* <GiLockedBox
                        value="value"
                        className="lock-icon-class"
                        size={lock}
                      /> 
                        {name}
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div> */}

        <div className="locker-catagory-container">
          <div>
            <div className="locker-locks-form">
              <div className="locks-form-container">
                <div className="locker-catagory-head">
                  <h2>Locker Locks Catagory</h2>
                </div>
                <form onSubmit={(e) => saveLockDetails(e)}>
                  {/* <div className="textfield-container"> */}
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
                      onChange={(e) => fetchFromTerminalId(e)}
                      value={locksDetail.terminalId}
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

                  {/* </div> */}

                  {/* <input onChange={targetInput} type="text" value={locksDetail.terminalId} className='form-input-tag' placeholder='terminalId' id='terminal_id'name='terminalId' required/> */}
                  {/* <select
                    onChange={fetchFromTerminalId}
                    name="terminalId"
                    id="terminal_id"
                    className="form-input-tag"
                    value={locksDetail.terminalId}
                    required
                  >
                    {terminalIds.map((termId) => {
                      return (
                        <option value={termId} key={termId}>
                          {termId}
                        </option>
                      );
                    })}
                  </select> */}

                  {/* <div className="textfield-container"> */}


                    <>
                      <TextField
                        type="text"
                        id="outlined-read-only-input"
                        value={locationName}
                        label="location"
                        InputProps={{
                          readOnly: true,
                        }}
                        sx={{
                          width: 300,
                          m: 1,
                        }}
                        focused
                      />
                      {/* </div> */}

                      {/* <div className="textfield-container"> */}
                      <FormControl
                        required
                        focused
                        sx={{
                          width: 300,
                          m: 1,
                        }}
                        error={isLockCatEmpty}
                      >
                        <InputLabel>locker category</InputLabel>
                        <Select
                          labelId="demo-simple-select-helper-label"
                          name="catagory"
                          id="catagories_id"
                          label="locker catagory"
                          size="medium"
                          onChange={(e) => lockerTypeSelect(e)}
                          value={locksDetail.catagory}
                          required
                        >
                          {catagoriesName.map((catagory, index) => (
                            <MenuItem value={catagory} key={index}>
                              {catagory}
                            </MenuItem>
                          ))}
                        </Select>
                        <FormHelperText color="warning">
                          choose a lock type
                        </FormHelperText>
                      </FormControl>
                      {/* </div> */}

                      <div className="textfield-container">
                        <FormControl component="fieldset">
                          <FormLabel component="legend">
                            select type of days
                          </FormLabel>
                          <FormGroup
                            aria-label="position"
                            onChange={(e) => selectDayTypeEvent(e)}
                            row
                          >
                            {typeOfDays.map((dtype, index) => (
                              <FormControlLabel
                                value={dtype}
                                control={<Checkbox color="secondary" />}
                                label={dtype}
                                key={index}
                                checked={
                                  locksDetail.typeOfDay === dtype ? true : false
                                }
                                labelPlacement="start"
                              />
                            ))}
                          </FormGroup>
                        </FormControl>
                      </div>

                      {/* <div className="textfield-container"> */}
                      {/* <TextField
                  type="number"
                  id="noOfLockers_id"
                  value={locksDetail.totNoOfLocks}
                  name="noOfLockers"
                  label="No of lockers"
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{
                    width: 300,
                    m: 1,
                  }}
                  focused
                /> */}
                      {/* </div> */}

                      {locksDetail.totNoOfLocks > 0 && (
                        <h4>
                          Total Number of lockers : {locksDetail.totNoOfLocks}
                        </h4>
                      )}

                      {allLocks && (
                        <div className="textfield-container">
                          <TextField
                            color="secondary"
                            value={allLocks}
                            InputProps={{
                              readOnly: true,
                            }}
                            label="all locks"
                            sx={{
                              width: 500,
                            }}
                            focused
                          />
                        </div>
                      )}

                      {/* <div className="textfield-container"> */}
                      {hourSlot.length > 0 && (
                        <div className="current-amount-container">
                          <h6 className="amount-container-heaer">
                            Present Amount Slot :{" "}
                          </h6>
                          <FormControl>
                            <TextField
                              type="text"
                              // className="form-input-tag selected-locks-field"
                              value={minuteAmountSlot}
                              name={"Minute" + minuteSlot}
                              label={"Minute : " + minuteSlot}
                              color="success"
                              InputProps={{
                                readOnly: true,
                              }}
                              sx={{
                                width: 130,
                                m: 1,
                              }}
                              focused
                            />

                            <FormHelperText>in paise</FormHelperText>
                          </FormControl>

                          {hourSlot.map((hour, index) => (
                            <FormControl>
                              <TextField
                                type="text"
                                // className="form-input-tag selected-locks-field"
                                key={index}
                                value={hourAmountSlot[index]}
                                color="success"
                                name={"Hour" + hour}
                                label={"Hour : " + hour}
                                InputProps={{
                                  readOnly: true,
                                }}
                                sx={{
                                  width: 130,
                                  m: 1,
                                }}
                                focused
                              />
                              <FormHelperText>in Rupees</FormHelperText>
                            </FormControl>
                          ))}
                        </div>
                      )}

                      {hourSlot.length > 0 && (
                        <div className="current-amount-container">
                          <h6 className="amount-container-heaer">
                            Change Amount Slot :{" "}
                          </h6>
                          <FormControl>
                            <TextField
                              type="number"
                              // className="form-input-tag selected-locks-field"
                              value={updatedMinuteAmount}
                              name={"Minute1"}
                              label={"Minute : 1"}
                              color="warning"
                              onChange={(e) => updateMinuteAmountFun(e)}
                              sx={{
                                width: 130,
                                m: 1,
                              }}
                              required
                              focused
                            />

                            <FormHelperText>in paise</FormHelperText>
                          </FormControl>

                          <FormControl>
                            <TextField
                              type="number"
                              // className="form-input-tag selected-locks-field"
                              color="warning"
                              value={changedAmountSlot.Hour1}
                              name="Hour1"
                              label="Hour : 1"
                              sx={{
                                width: 130,
                                m: 1,
                              }}
                              onChange={(e) => changeAmountEvent(e)}
                              required
                              focused
                            />
                            <FormHelperText>in Rupees</FormHelperText>
                          </FormControl>

                          <FormControl>
                            <TextField
                              type="number"
                              // className="form-input-tag selected-locks-field"

                              value={changedAmountSlot.Hour3}
                              name="Hour3"
                              label="Hour : 3"
                              color="warning"
                              sx={{
                                width: 130,
                                m: 1,
                              }}
                              onChange={(e) => changeAmountEvent(e)}
                              required
                              focused
                            />
                            <FormHelperText>in Rupees</FormHelperText>
                          </FormControl>

                          <FormControl>
                            <TextField
                              type="number"
                              // className="form-input-tag selected-locks-field"

                              value={changedAmountSlot.Hour5}
                              name="Hour5"
                              label="Hour : 5"
                              color="warning"
                              sx={{
                                width: 130,
                                m: 1,
                              }}
                              onChange={(e) => changeAmountEvent(e)}
                              required
                              focused
                            />
                            <FormHelperText>in Rupees</FormHelperText>
                          </FormControl>

                          <FormControl>
                            <TextField
                              type="number"
                              // className="form-input-tag selected-locks-field"

                              value={changedAmountSlot.Hour8}
                              name="Hour8"
                              label="Hour : 8"
                              color="warning"
                              sx={{
                                width: 130,
                                m: 1,
                              }}
                              onChange={(e) => changeAmountEvent(e)}
                              required
                              focused
                            />
                            <FormHelperText>in Rupees</FormHelperText>
                          </FormControl>

                          <FormControl>
                            <TextField
                              type="number"
                              // className="form-input-tag selected-locks-field"

                              value={changedAmountSlot.Hour12}
                              name="Hour12"
                              label="Hour : 12"
                              color="warning"
                              sx={{
                                width: 130,
                                m: 1,
                              }}
                              onChange={(e) => changeAmountEvent(e)}
                              required
                              focused
                            />
                            <FormHelperText>in Rupees</FormHelperText>
                          </FormControl>
                        </div>
                      )}
                    </>
                 

                  {/* </div> */}

                  <div className="textfield-container">
                    <input
                      className="btn btn-submit"
                      type="submit"
                      value="Save"
                    />
                  </div>
                </form>
              </div>
            </div>

            {/* {
            data &&
            data.map((dat, index) => (
              <h2 key={index}>{dat}</h2>
            ))
          } */}
            {!tableData ? (
              <div> No data is available in table </div>
            ) : (
              <LockerCatagoryTable
                tableData={tableData}
                fetchtableFun={fetchDataToTable}
                tableType={"lockerLocksDetails"}
              />
            )}
          </div>

          <Dialog
            open={openConfirmDailogue}
            TransitionComponent={Transition}
            keepMounted
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle>{"Are You Sure .?"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                You want to change the price slot for the lockers, Changes will
                apply for the customers .
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => closeConfirmDailgueAlert()}>Cancel</Button>
              <Button onClick={() => storeTheChangesMadeFun()}>Confirm</Button>
            </DialogActions>
          </Dialog>
          
        </div>
      </div>
    </>
  );
};

export default LockerLockCatagory;
