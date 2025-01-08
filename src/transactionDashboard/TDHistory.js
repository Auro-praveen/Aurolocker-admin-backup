import React, { useEffect, useState } from "react";
import LockerCatagoryTable from "../settingsComponent/TableFunction/LockerCatagoryTable";
import "./TransactionDashboard.css";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import PathUrl from "../GlobalVariable/urlPath.json";
import VerifiedIcon from "@mui/icons-material/Verified";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

import {
  Alert,
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Snackbar,
  TextField,
} from "@mui/material";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import NativeSelect from "@mui/material/NativeSelect";
import InputLabel from "@mui/material/InputLabel";
import DashBoardOperationItems from "../mainDashBoard/dashboardCards/DashBoardOperationItems";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import SwapHorizontalCircleIcon from "@mui/icons-material/SwapHorizontalCircle";
import { IoMdCloseCircle } from "react-icons/io";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import { FormHelperText } from "@mui/material";
import { useLogDetails } from "../utils/UserLogDetails";
import StateWiseFormSelection from "../GlobalVariable/StateWiseFormSelection";
import { commonApiForGetConenction } from "../GlobalVariable/GlobalModule";
import { useAuth } from "../utils/Auth";

function TDHistory(props) {
  const [tdHistory, setTdHistory] = useState({
    slno: "",
    mobileNumber: "",
    customerName: "",
    dateOfOpen: "",
    timeOfOpen: "",
    terminalID: "",
    transactionId: "",
    lockerNumbers: "",
    transactionType: "",
    passcode: "",
    stored_item: "",
    closingDate: "",
    closingTime: "",
    excess_hour_in_mins: "",
    noOfHours_in_mins: "",
    balance: "",
    excess_amount: "",
    amount: "",
    amount_withoutGST: "",
    CGST: "",
    SGST: "",
    amount_withGST: "",
  });

  const [enteredPhonenumber, setEnteredPhonenumber] = useState("");

  const [isPhoneNumberWrong, setIsPhoneNumberWrong] = useState(false);

  const [visibleWindow, setVisibleWindow] = useState("hide-window");
  const reasons = ["Internet Down", "Online Payment Down", "Other"];

  const [isMvToActiveTDError, setIsMvToActiveTDError] = useState(false);

  const [isMvToActiveTdDateWrong, setIsMvToActiveTdDateWrong] = useState(false);
  const [isMvToActiveTDSuccess, setIsMvToActiveTDSuccess] = useState(false);

  const [isActiveTransactioClicked, setIsActiveTransactioClicked] =
    useState(false);

  const [dateAndTimeOfToActiveTd, setDateAndTimeOfActiveTd] = useState({
    dateOfOpen: "",
    timeOfOpen: "",
  });

  const [stateName, setStateName] = useState("");

  const useLogDetials = useLogDetails();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [state, setState] = useState({
    vertical: "top",
    horizontal: "center",
  });

  const { vertical, horizontal } = state;
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [tdHistoryManualOverride, setTdHistoryManualOverride] = useState({
    PacketType: "uncndopenlock",
    // PacketType: "manovrlocopen",
    MobileNo: "",
    terminalID: "",
    reason: "",
    remarks: "",
    LockerNo: "",
    ReqType: "Retrieve",
    TransType: "Internet",
  });

  const [allTerminalIds, setAllTerminalIds] = useState([]);
  const [sellectedTerminalId, setSelectedTerminalId] = useState("");

  const [selectedDate, setSelectedDate] = useState("");
  const [isLoading, setIsLoading] = useState();
  const [isDateWrong, setIsDateWrong] = useState(false);

  // for search by phone number dailogue window

  const [openSearchByPhoneNoDail, setOpenSearchByPhoneNoDail] = useState(false);
  const [searchByPhonNumEnteredDate, setSearchByPhoneNumEnteredDate] =
    useState("");
  const [isSearchByPhoneNumWrong, setIsSearchByPhoneNumWrong] = useState(false);
  const [isTerminalIdChecked, setIsTerminalIdChecked] = useState(false);

  // for updating the payment status in retrieve

  const [updatePaymentStatusSuccess, setUpdatePaymentStatusSuccess] =
    useState(false);
  const [updatePaymentStatusFailed, setUpdatePaymentStutsFailed] =
    useState(false);
  const [updatePaymentStatusExistAlready, setUpdatePaymentStatusExistAlready] =
    useState(false);
  const [
    updatePaymentStatusDetailNotFound,
    setUpdatePaymentStatusDetailNotFound,
  ] = useState(false);

  // useEffect(() => {
  // if (props.terminalID) {
  //   fetchTransactionDetailHistory("gettdhistorybytid", "");
  // }

  // getTerminalIdsOfTransactionDetails();
  // }, []);

  const Auth = useAuth();

  const currentDate = () => {
    const date = new Date();

    let alteredMonth = String(date.getMonth() + 1);
    let alteredDay = String(date.getDate());
    if (alteredMonth.length == 1) {
      alteredMonth = 0 + alteredMonth;
    }
    if (alteredDay == 1) {
      alteredDay = 0 + alteredDay;
    }

    setSelectedDate(date.getFullYear() + "-" + alteredMonth + "-" + alteredDay);
    return (
      date.getFullYear() +
      "-" +
      (Number(date.getMonth()) + 1) +
      "-" +
      date.getDate()
    );
  };

  // const tdHistoryUrl =  "http://192.168.0.198:8080/AuroAutoLocker/FetchTransactionHistory";
  const fetchTransactionDetailHistory = (
    packetType,
    terminalid,
    date,
    mobileNo
  ) => {
    const getTDHistory = {
      PacketType: packetType,
      terminalID: terminalid,
      selectedDate: date,
      MobileNo: mobileNo,
    };

    setIsLoading(true);
    console.log(getTDHistory);
    fetch(Auth.serverPaths.localAdminPath + "FetchTransactionHistory", {
      method: "POST",
      headers: {
        accept: "application/json",
      },
      body: JSON.stringify(getTDHistory),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data.responseCode === "tdhistory") {
          setTdHistory({
            ...tdHistory,
            slno: data.slno,
            mobileNumber: data.MobileNo,
            customerName: data.custName,
            dateOfOpen: data.dateOfTransaction,
            timeOfOpen: data.timeOfTransaction,
            terminalID: data.terminalID,
            transactionId: data.transactionId,
            lockerNumbers: data.lockers,
            transactionType: data.transactionType,
            passcode: data.passcode,
            stored_item: data.itemStored,
            closingDate: data.closing_date,
            closingTime: data.closingTime,
            excess_hour_in_mins: data.excess_hour,
            noOfHours_in_mins: data.noOfHours,
            balance: data.balance,
            excess_amount: data.excess_amount,
            amount: data.amount,
            amount_withoutGST: data.amount_withoutGST,
            CGST: data.CGST,
            SGST: data.SGST,
            amount_withGST: data.amount_withGST,
          });
        } else if (data.responseCode === "notidhistory") {
          alert("no data present in the selected transaction id");
        } else if (data.responseCode === "nodatehistory") {
          alert("no data on selected date");
          setTdHistory("");
        } else if (data.responseCode === "notdhistbyalldate") {
          alert(mobileNo + " is not found !!");
          setEnteredPhonenumber("");
          setTdHistory("");
        } else if (data.responseCode === "notdhistbymobbydate") {
          alert(+mobileNo + " not found on selected date - " + date);
          setEnteredPhonenumber("");
          setTdHistory("");
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("err : " + err);
        setIsLoading(false);
      });
  };

  const TDHistoryManuvalOverrideFun = (
    mobileNumber,
    lockerNumber,
    terminalID,
    dateOfOpen,
    timeOfOpen,
    event
  ) => {
    setAnchorEl(event.currentTarget);
    setTdHistoryManualOverride({
      ...tdHistoryManualOverride,
      MobileNo: mobileNumber,
      LockerNo: lockerNumber,
      terminalID: terminalID,
    });

    setDateAndTimeOfActiveTd({
      ...dateAndTimeOfToActiveTd,
      dateOfOpen: dateOfOpen,
      timeOfOpen: timeOfOpen,
    });
  };

  const getTerminalIdsOfTransactionDetails = () => {
    // setLoading(true);
    const getLocksObj = {
      PacketType: "gettermid",
    };
    fetch(Auth.serverPaths.localAdminPath + "FetchTransactionDetails", {
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
          setAllTerminalIds(data.terminalID);

          if (data.terminalID[0]) {
            setSelectedTerminalId(data.terminalID[0]);
            fetchTransactionDetailHistory(
              "gettdhistorybyddate",
              data.terminalID[0],
              currentDate(),
              "nonumber"
            );
            setEnteredPhonenumber("");
          }
        } else if (data.responseCode === "notd-201") {
          alert("no terminalId in Site registtration");
        }
        // setLoading(false);
      })
      .catch((err) => {
        console.log("err : " + err);
        // setLoading(false);
      });
  };

  const onChangeSelectedDate = (e) => {
    const selecteDate = e.target.value;
    setSelectedDate(selecteDate);

    const terminalValue = sellectedTerminalId.split(",");

    const termId = terminalValue[1].replace(/\s+/g, "");


    console.log(selecteDate);
    const isSelectedDateOk = verifyDate(selecteDate);

    if (isSelectedDateOk) {
      setIsDateWrong(false);
      fetchTransactionDetailHistory(
        "gettdhistorybyddate",
        termId,
        selecteDate,
        "nonumber"
      );
      setEnteredPhonenumber("");
    } else {
      setIsDateWrong(true);
    }
  };

  const terminalIdEventHandler = (e, value) => {

    // setSelectedTerminalId(e.target.value);
    // fetchTransactionDetailHistory(
    //   "gettdhistorybyddate",
    //   e.target.value,
    //   selectedDate,
    //   "nonumber"
    // );

    const terminalValue = value.split(",");
    const termId = terminalValue[1].replace(/\s+/g, "");

    if (value !== null) {

      setSelectedTerminalId(value);
      fetchTransactionDetailHistory(
        "gettdhistorybyddate",
        termId,
        selectedDate,
        "nonumber"
      );

      setEnteredPhonenumber("");


    }
  };

  const verifyDate = (selectedDate) => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    const yyyy = today.getFullYear();
    const currentDate = yyyy + "-" + mm + "-" + dd;

    if (selectedDate <= currentDate) {
      console.log(true);
      return true;
    } else {
      console.log(false);
      return false;
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const submitManualOverride = (e) => {
    e.preventDefault();
    console.log(tdHistoryManualOverride);
    setIsLoading(true);
    // console.log(manualOverrideDet);
    let manDetailsToServer = { ...tdHistoryManualOverride };
    delete manDetailsToServer.reason;
    delete manDetailsToServer.remarks;
    // delete manDetailsToServer.LockerNo;
    manDetailsToServer.LockerNo = [tdHistoryManualOverride.LockerNo];
    console.log(manDetailsToServer);

    fetch(Auth.serverPaths.serverUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify(manDetailsToServer),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data.responseCode === "REQAC-200") {
          handleClose();
          storeManualOverrideInDB();
        } else if (data.responseCode === "REQF-201") {
          setIsError(true);
          setIsLoading(false);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("error :" + err);
        setIsError(true);
        setIsLoading(false);
      });
  };

  const storeManualOverrideInDB = () => {
    const tdHistoryManOverrideObj = {
      PacketType: tdHistoryManualOverride.PacketType,
      MobileNo: tdHistoryManualOverride.MobileNo,
      ReqType: tdHistoryManualOverride.ReqType,
      terminalID: tdHistoryManualOverride.terminalID,
      reason: tdHistoryManualOverride.reason,
      LOCKNO: tdHistoryManualOverride.LockerNo,
      TransType: tdHistoryManualOverride.TransType,
      remarks: tdHistoryManualOverride.remarks,
    };
    fetch(Auth.serverPaths.localAdminPath + "FetchTransactionDetails", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify(tdHistoryManOverrideObj),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data.status === "success") {
          const userLogsObj = {
            eventType: "tdHistoryManualOVerride",
            remarks: "transaction history manual override",
          };

          useLogDetials.storeUserLogs(userLogsObj);
          setTdHistoryManualOverride({
            ...tdHistoryManualOverride,
            MobileNo: "",
            terminalID: "",
            reason: "",
            remarks: "",
            LockerNo: "",
          });

          closeMAnualOverrideWind();
          // to fetch the transaction details data after manually overriding
          setIsSuccess(true);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          setIsError(true);
          closeMAnualOverrideWind();
        }
      })
      .catch((err) => {
        console.log("err : " + err);
        closeMAnualOverrideWind();
        setIsError(true);
        setIsLoading(false);
      });
  };

  const hideAlertFunction = () => {
    setIsError(false);
    setIsSuccess(false);
    setIsMvToActiveTDError(false);
    setIsMvToActiveTDSuccess(false);
    setIsMvToActiveTdDateWrong(false);
  };

  const eventHandler = (e) => {
    e.preventDefault();
    const name = e.target.name;
    setTdHistoryManualOverride({
      ...tdHistoryManualOverride,
      [name]: e.target.value,
    });
  };
  const manualOverrideWindId = document.getElementById(
    "manual-override-window_id"
  );

  const hideWindowFunction = () => {
    manualOverrideWindId.style.display = "none";
    setVisibleWindow("hide-window");
    setTdHistoryManualOverride({
      ...tdHistoryManualOverride,
      MobileNo: "",
      terminalID: "",
      LockerNo: "",
      reason: "",
      remarks: "",
    });
  };

  const manualOverrideWindow = () => {
    manualOverrideWindId.style.display = "block";
    setVisibleWindow("display-window");
    handleClose();
  };

  const closeMAnualOverrideWind = () => {
    manualOverrideWindId.style.display = "none";
    setVisibleWindow("hide-window");
  };

  const moveToActiveTransaction = () => {
    setIsActiveTransactioClicked(true);
    setAnchorEl(null);
  };

  const handleRestoreToActive = () => {
    const date = new Date();

    const year = date.getFullYear();
    const month = Number(date.getMonth()) + 1;
    const day = Number(date.getDate());

    const cDate =
      year +
      "-" +
      (month < 10 ? "0" + month : month) +
      "-" +
      (day < 10 ? "0" + day : day);

    console.log(cDate);

    console.log(dateAndTimeOfToActiveTd.dateOfOpen);

    console.log(cDate === dateAndTimeOfToActiveTd.dateOfOpen);

    if (cDate === dateAndTimeOfToActiveTd.dateOfOpen) {
      const obj = {
        PacketType: "restorebooking",
        terminalID: tdHistoryManualOverride.terminalID,
        LockerNo: tdHistoryManualOverride.LockerNo,
        MobileNo: tdHistoryManualOverride.MobileNo,
        datofopen: dateAndTimeOfToActiveTd.dateOfOpen,
        timeofopen: dateAndTimeOfToActiveTd.timeOfOpen,
      };

      console.log(obj);

      fetch(Auth.serverPaths.serverUrl, {
        method: "POST",
        headers: {
          accept: "application/json",
        },
        body: JSON.stringify(obj),
      })
        .then((resp) => resp.json())
        .then((data) => {
          console.log(data);

          if (data.responseCode === "RARESTB-200") {
            setIsMvToActiveTDSuccess(true);
            // to fetch the transaction history after it moving to transaction details
            let timeCount = 2;
            const interval = setInterval(() => {
              console.log(timeCount);
              if (timeCount <= 0) {
                clearInterval(interval);
                fetchTransactionDetailHistory(
                  "gettdhistorybyddate",
                  tdHistoryManualOverride.terminalID,
                  currentDate(),
                  "nonumber"
                );

                const userLogsObj = {
                  eventType: "tdHistoryRestoreToActive",
                  remarks:
                    obj.MobileNo +
                    " from " +
                    obj.terminalID +
                    ", LockNo: " +
                    obj.LockerNo +
                    " is moved back to transaction details",
                };

                useLogDetials.storeUserLogs(userLogsObj);
                setEnteredPhonenumber("");
              }

              timeCount = timeCount - 1;
            }, 1000);
          } else if (data.responseCode === "RARESTB-201") {
            setIsMvToActiveTDError(true);
          } else {
            setIsMvToActiveTDError(true);
          }
        })
        .catch((err) => {
          console.log("err : " + err);
          setIsMvToActiveTDError(true);
        });

      closeRestoreToActive();
    } else {
      setIsMvToActiveTdDateWrong(true);
    }
  };

  const closeRestoreToActive = () => {
    setIsActiveTransactioClicked(false);
  };

  const initaiteRefundFunction = () => {
    const refundObj = {
      mobileNo: tdHistoryManualOverride.MobileNo,
      dateOfTransactionOpen: dateAndTimeOfToActiveTd.dateOfOpen,
      type: "Retrieve",
    };
    props.refundClickHandler(refundObj);
    setAnchorEl(null);
  };

  // for search by phone number praveen april 11 2023

  const onPhoneNumberChange = (e) => {
    if (e.target.value.length <= 10 && !e.target.value.includes(" ")) {
      setEnteredPhonenumber(e.target.value);

      if (
        e.target.value.length > 0 &&
        e.target.value.length < 10 &&
        !e.target.value.includes(" ")
      ) {
        setIsPhoneNumberWrong(true);
      } else {
        setIsPhoneNumberWrong(false);
      }
    }
  };

  const closeSearchByPhonrNumberDailogue = () => {
    setOpenSearchByPhoneNoDail(false);
    setSearchByPhoneNumEnteredDate("");
    setIsTerminalIdChecked(false);
  };

  // need to continue from here  TODO:- april 4 2023 PRAVEEN

  const submitSearchByPhoneNumberDailogue = () => {
    const terminalId = isTerminalIdChecked ? sellectedTerminalId : "notid";

    if (searchByPhonNumEnteredDate === "") {
      fetchTransactionDetailHistory(
        "gethistnodate",
        terminalId,
        "nodate",
        enteredPhonenumber
      );
    } else {
      fetchTransactionDetailHistory(
        "gethistbydate",
        terminalId,
        searchByPhonNumEnteredDate,
        enteredPhonenumber
      );
    }

    closeSearchByPhonrNumberDailogue();
  };

  const searchByPhoneNumberHandler = () => {
    setOpenSearchByPhoneNoDail(true);
  };

  const searchByPhoneNumDateHandler = (e) => {
    const selecteDate = e.target.value;
    setSearchByPhoneNumEnteredDate(selecteDate);

    console.log(selecteDate);
    const isSelectedLockValid = verifyDate(selecteDate);

    if (isSelectedLockValid) {
      setIsSearchByPhoneNumWrong(false);
    } else {
      setIsSearchByPhoneNumWrong(true);
    }
  };

  const terminalIdChckboxHAndler = (e) => {
    setIsTerminalIdChecked(e.target.checked);
  };

  // setVisibleWindow("display-window");

  // for updating the payment status in transaction history

  const updatePaymentToSuccess = () => {
    const checkPaymentStatus = {
      MobileNo: tdHistoryManualOverride.MobileNo,
      LockerNo: tdHistoryManualOverride.LockerNo,
      terminalID: tdHistoryManualOverride.terminalID,
      dateOfOpen: dateAndTimeOfToActiveTd.dateOfOpen,
      timeOfOpen: dateAndTimeOfToActiveTd.timeOfOpen,
      PacketType: "retrpaysuc",
    };
    setAnchorEl(null);

    fetch(Auth.serverPaths.localAdminPath + "FetchTransactionHistory", {
      method: "POST",
      headers: {
        accept: "application/json",
      },
      body: JSON.stringify(checkPaymentStatus),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);

        if (data.responseCode === "updtsucc-200") {
          setUpdatePaymentStatusSuccess(true);
          // fetchCustemerDetails(checkPaymentStatus.terminalID);
          fetchTransactionDetailHistory(
            "gettdhistorybyddate",
            checkPaymentStatus.terminalID,
            checkPaymentStatus.dateOfOpen,
            "nonumber"
          );

          const userLogsObj = {
            eventType: "tdHistPaySuccessUpdated",
            remarks:
              checkPaymentStatus.MobileNo +
              " from " +
              checkPaymentStatus.terminalID +
              ", LockNo: " +
              checkPaymentStatus.LockerNo +
              " is update as retrieveconf",
          };

          useLogDetials.storeUserLogs(userLogsObj);
        } else if (data.responseCode === "updtpayfail-202") {
          setUpdatePaymentStutsFailed(true);
        } else if (data.responseCode === "notd-404") {
          setUpdatePaymentStatusDetailNotFound(true);
        } else if (data.responseCode === "paysucexist-500") {
          setUpdatePaymentStatusExistAlready(true);
        }
      })

      .catch((err) => {
        setUpdatePaymentStatusDetailNotFound(true);
        console.log("err : " + err);
      });
  };

  // for closing the alerts of update payment status

  const closeUpdatePaymentStatusAlertHandler = () => {
    setUpdatePaymentStatusSuccess(false);
    setUpdatePaymentStutsFailed(false);
    setUpdatePaymentStatusExistAlready(false);
    setUpdatePaymentStatusDetailNotFound(false);
  };

  const handleStateName = (stateName) => {
    setStateName(stateName);
    getStatewiseTerminals(stateName);
  };

  const getStatewiseTerminals = async (stateName) => {
    const terminalIds = await commonApiForGetConenction(
      Auth.serverPaths.localAdminPath + "FetchStates?value=" + stateName+"&type=ALL"
    );

    setAllTerminalIds(terminalIds.terminals);

    const terminalValue = terminalIds.terminals[0].split(",");

    const termId = terminalValue[1].replace(/\s+/g, "");

    fetchTransactionDetailHistory(
      "gettdhistorybyddate",
      // terminalIds.terminals[0],
      termId,
      currentDate(),
      "nonumber"
    );
  };

  return (
    <>
      <div className={visibleWindow}></div>

      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={isError}
        autoHideDuration={6000}
        onClose={() => hideAlertFunction()}
      >
        <Alert onClose={() => hideAlertFunction()} severity="error">
          Somthing went Wrong ! please try again
        </Alert>
      </Snackbar>

      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={isSuccess}
        autoHideDuration={6000}
        onClose={() => hideAlertFunction()}
      >
        <Alert onClose={() => hideAlertFunction()} severity="success">
          Manual override is Successfull, Locker is open now
        </Alert>
      </Snackbar>

      {/* move to active transaction details */}

      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={isMvToActiveTDError}
        autoHideDuration={6000}
        onClose={() => hideAlertFunction()}
      >
        <Alert onClose={() => hideAlertFunction()} severity="error">
          Somthing went Wrong ! please try again
        </Alert>
      </Snackbar>

      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={isMvToActiveTdDateWrong}
        autoHideDuration={6000}
        onClose={() => hideAlertFunction()}
      >
        <Alert onClose={() => hideAlertFunction()} severity="error">
          You Cant Move This To Active Transaction As The Date Of The Booking Is
          Not From Current Date.
        </Alert>
      </Snackbar>

      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={isMvToActiveTDSuccess}
        autoHideDuration={6000}
        onClose={() => hideAlertFunction()}
      >
        <Alert onClose={() => hideAlertFunction()} severity="success">
          Successfully moved to active details
        </Alert>
      </Snackbar>

      {/* for updating the payment status from transacton history */}

      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={updatePaymentStatusSuccess}
        autoHideDuration={6000}
        onClose={() => closeUpdatePaymentStatusAlertHandler()}
      >
        <Alert
          onClose={() => closeUpdatePaymentStatusAlertHandler()}
          severity="success"
        >
          Updated, Payment Status Updated Successfully.
        </Alert>
      </Snackbar>

      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={updatePaymentStatusDetailNotFound}
        autoHideDuration={6000}
        onClose={() => closeUpdatePaymentStatusAlertHandler()}
      >
        <Alert
          onClose={() => closeUpdatePaymentStatusAlertHandler()}
          severity="error"
        >
          Error!, provided user do not exist in transaction details. refresh and
          try again!
        </Alert>
      </Snackbar>

      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={updatePaymentStatusFailed}
        autoHideDuration={6000}
        onClose={() => closeUpdatePaymentStatusAlertHandler()}
      >
        <Alert
          onClose={() => closeUpdatePaymentStatusAlertHandler()}
          severity="error"
        >
          Failed!, something went Wrong, Please Try again!
        </Alert>
      </Snackbar>

      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={updatePaymentStatusExistAlready}
        autoHideDuration={6000}
        onClose={() => closeUpdatePaymentStatusAlertHandler()}
      >
        <Alert
          onClose={() => closeUpdatePaymentStatusAlertHandler()}
          severity="warning"
        >
          Can't Update!, Payment status is already success!!
        </Alert>
      </Snackbar>

      <div className="manual-override-window " id="manual-override-window_id">
        <h1 className="site-header">manual override</h1>
        <IoMdCloseCircle
          onClick={() => hideWindowFunction()}
          className="close-changepass-wind"
          size={30}
        />

        <form onSubmit={(e) => submitManualOverride(e)}>
          <FormGroup row>
            <FormLabel className="text-header" component="legend">
              Choose Locker here
            </FormLabel>
            <div className="textfield-checkbox-container">
              {/* {lockNo.map((lock, index) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      color="info"
                      value={lock}
                      key={index}
                      onChange={(e) => checkBoxHandler(e)}
                    />
                  }
                  label={lock}
                />
              ))} */}
              <FormControlLabel
                control={
                  <Checkbox
                    color="info"
                    checked={true}
                    value={tdHistoryManualOverride.LockerNo}
                  />
                }
                label={tdHistoryManualOverride.LockerNo}
              />
            </div>
          </FormGroup>

          <div className="textfield-container">
            <TextField
              label="mobile number"
              type="text"
              name="user_phone"
              size="small"
              value={tdHistoryManualOverride.MobileNo}
              InputProps={{
                readOnly: true,
              }}
              focused
              fullWidth
            />
          </div>

          <div className="textfield-container">
            <FormControl focused fullWidth required>
              <InputLabel>Reason</InputLabel>
              <Select
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                name="reason"
                label="Reason"
                size="small"
                value={tdHistoryManualOverride.reason}
                onChange={(e) => eventHandler(e)}
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

            {/* <TextField
              label="reason"
              onChange={(e) => eventHandler(e)}
              type="text"
              name="reason"
              value={manualOverrideDet.reason}
              required
              focused
              fullWidth
            /> */}
          </div>

          <div className="textfield-container">
            <TextField
              name="remarks"
              label="remarks"
              type="text"
              value={tdHistoryManualOverride.remarks}
              onChange={(e) => eventHandler(e)}
              variant="outlined"
              size="small"
              required
              focused
              fullWidth
            />
          </div>
          <div className="textfield-container">
            {/* <FormControl focused fullWidth required>
              <InputLabel>Request Type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="ReqType"
                size="small"
                label="Request Type"
                onChange={(e) => eventHandler(e)}
                value={tdHistoryManualOverride.ReqType}
                required
              >
                <MenuItem value="Retrieve">{"Retrieve"}</MenuItem>
                <MenuItem value="retrievecnf">{"Retrieve Payment Confirm"}</MenuItem>
              </Select>
              <FormHelperText color="warning">
                select the request type
              </FormHelperText>
            </FormControl> */}

            <TextField
              name="ReqType"
              size="small"
              label="Request Type"
              variant="outlined"
              value={tdHistoryManualOverride.ReqType}
              InputProps={{
                readOnly: true,
              }}
              required
              focused
              fullWidth
            />
          </div>

          {isLoading ? (
            <div className="textfield-container man-btn-container">
              <LoadingButton
                loading
                loadingPosition="end"
                endIcon={<SaveIcon />}
                variant="contained"
                size="medium"
                fullWidth
              >
                submitting
              </LoadingButton>
            </div>
          ) : (
            <div className="textfield-container man-btn-container">
              <Button
                type="submit"
                color="primary"
                variant="contained"
                endIcon={<SaveIcon />}
                size="medium"
                fullWidth
              >
                {" "}
                Submit
              </Button>
            </div>
          )}
        </form>
      </div>

      <div className="terminal-id-drop-container">
        {/* <div className="container-items">
          <DashBoardOperationItems />
          <hr />
        </div> */}

        <h4 className="td-history-title">
          Transaction details History of terminalID{" "}
          <strong className="strong-td">{" " + sellectedTerminalId}</strong>
        </h4>

        <StateWiseFormSelection
          onStateChangeCallback={(stateName) => handleStateName(stateName)}
        />

        <div className="input-elements-container">
          <Box>
            <FormControl
              sx={{
                m: 1,
                width: 300,
                textAlign: "center",
              }}
              focused
            >
              {/* <InputLabel
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
                value={sellectedTerminalId}
                onChange={(e) => terminalIdEventHandler(e)}
              >
                {allTerminalIds.map((termID, index) => (
                  <option
                    className="option-container"
                    value={termID}
                    key={index}
                  >
                    {termID}
                  </option>
                ))}
              </NativeSelect> */}

              <Autocomplete
                // disablePortal
                
                id="combo-box-demo"
                options={allTerminalIds}
                value={sellectedTerminalId}
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="Choose terminalId" focused />
                )}
                onChange={(e, value) => terminalIdEventHandler(e, value)}
                focused
              />


            </FormControl>
          </Box>

          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isLoading}
            // onClick={handleClose}
          >
            <CircularProgress color="inherit" />
          </Backdrop>

          <div className="mui-mobile-date-picker">
            <TextField
              label="select date to view TD history"
              type="date"
              variant="standard"
              inputFormat="MM/DD/YYYY"
              error={isDateWrong}
              color="info"
              value={selectedDate}
              onChange={(e) => onChangeSelectedDate(e)}
              helperText={isDateWrong ? "Please Choose Valid date" : ""}
              focused
              fullWidth
            />
          </div>

          <div className="mui-mobile-date-picker">
            <TextField
              label="Enter Phone Number Here"
              type="number"
              variant="outlined"
              error={isPhoneNumberWrong}
              color="info"
              value={enteredPhonenumber}
              onChange={(e) => onPhoneNumberChange(e)}
              helperText={
                isPhoneNumberWrong ? "Please provide valid phone number" : ""
              }
              focused
              fullWidth
            />
          </div>

          <div className="textfield-container">
            <Button
              type="submit"
              color="primary"
              variant="contained"
              endIcon={<PersonSearchIcon />}
              size="medium"
              fullWidth
              disabled={
                enteredPhonenumber.length === 0
                  ? true
                  : isPhoneNumberWrong
                  ? true
                  : false
              }
              onClick={() => searchByPhoneNumberHandler()}
            >
              {" "}
              search
            </Button>
          </div>
        </div>
        <hr />
      </div>

      {tdHistory.slno ? (
        <LockerCatagoryTable
          tableData={tdHistory}
          tableType={"transactionDetailsHistory"}
          manualOverrideTDhostoryFun={TDHistoryManuvalOverrideFun}
        />
      ) : (
        <p>No Data present</p>
      )}

      <Menu
        id="fade-menu"
        MenuListProps={{
          "aria-labelledby": "fade-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <MenuItem onClick={() => manualOverrideWindow()}>
          <ManageAccountsIcon />
          &nbsp; &nbsp; Manual Override
        </MenuItem>
        <Divider sx={{ my: 2 }} />
        <MenuItem onClick={() => moveToActiveTransaction()}>
          <SwapHorizontalCircleIcon />
          &nbsp; &nbsp; Move To Active transaction
        </MenuItem>
        <Divider sx={{ my: 2 }} />
        <MenuItem onClick={() => initaiteRefundFunction()}>
          <CurrencyRupeeIcon />
          &nbsp; &nbsp; Initiate Refund
        </MenuItem>
        <Divider sx={{ my: 2 }} />

        <MenuItem onClick={() => updatePaymentToSuccess()}>
          <VerifiedIcon />
          &nbsp; &nbsp; Confirm Payment
        </MenuItem>
        <Divider sx={{ my: 2 }} />
      </Menu>

      <Dialog
        open={isActiveTransactioClicked}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Do You Want To Move this Transaction To Active Transaction ?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {/* Selected Booking <b> Locker No: {lockNo} </b> Will Be Cancelled From <b> From Terminal Id : {manualOVerrideItems.terminalID}</b>, And Will No Longer Belongs To <b> {customerName} </b>. */}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={closeRestoreToActive}>
            Cancel
          </Button>
          <Button onClick={() => handleRestoreToActive()} autoFocus>
            confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openSearchByPhoneNoDail}
        // onClose={closeSearchByPhonrNumberDailogue}
      >
        <DialogContent>
          <DialogContentText>
            <b>Check on TerminalId for specific terminal .</b> <br />
            <b>Uncheck to fetch from all the terminalID's</b> <br />
            <b>Choose from terminalID to change terminal id</b>
          </DialogContentText>

          <FormGroup
            sx={{
              m: "auto",
              textAlign: "center",
              alignItems: "center",
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked={false}
                  checked={isTerminalIdChecked}
                  onChange={(e) => terminalIdChckboxHAndler(e)}
                />
              }
              label={sellectedTerminalId}
            />
            <DialogContentText>
              <b>Choose date to view history from the selected date.</b> <br />
              <b>Leave default to fetch from all date.</b>
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              type="date"
              inputFormat="MM/DD/YYYY"
              error={isSearchByPhoneNumWrong}
              fullWidth
              variant="outlined"
              value={searchByPhonNumEnteredDate}
              helperText={
                isSearchByPhoneNumWrong
                  ? "Please provide valid phone number"
                  : ""
              }
              onChange={(e) => searchByPhoneNumDateHandler(e)}
            />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeSearchByPhonrNumberDailogue}>Cancel</Button>
          <Button onClick={submitSearchByPhoneNumberDailogue}>submit</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default TDHistory;
