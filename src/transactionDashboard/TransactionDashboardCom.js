import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserLock } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import "./TransactionDashboard.css";
import LockerCatagoryTable from "../settingsComponent/TableFunction/LockerCatagoryTable";
import { BsFillInfoSquareFill } from "react-icons/bs";
import { IoMdCloseCircle } from "react-icons/io";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import PaymentsIcon from "@mui/icons-material/Payments";
import {
  Backdrop,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fade,
  FormHelperText,
} from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import MuiAlert from "@mui/material/Alert";
import NoEncryptionIcon from "@mui/icons-material/NoEncryption";
import PathUrl from "../GlobalVariable/urlPath.json";

import Menu from "@mui/material/Menu";
import EditIcon from "@mui/icons-material/Edit";
import Divider from "@mui/material/Divider";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import Box from "@mui/material/Box";
import NativeSelect from "@mui/material/NativeSelect";
import UncondOpenLock from "./unconditionalOpenLock/UncondOpenLock";
import Autocomplete from "@mui/material/Autocomplete";

import ChangeMobileNo from "./changeMobileNo/ChangeMobileNo";
import urlPath from "../GlobalVariable/urlPath.json";
import SideNavbarComp from "../mainDashBoard/sideNavbar/SideNavbar";
import DashBoardOperationItems from "../mainDashBoard/dashboardCards/DashBoardOperationItems";
import { useLogDetails } from "../utils/UserLogDetails";
import VerifiedIcon from "@mui/icons-material/Verified";
import StateWiseFormSelection from "../GlobalVariable/StateWiseFormSelection";
import {
  commonApiForGetConenction,
  commonApiForPostConenction,
} from "../GlobalVariable/GlobalModule";
import { useAuth } from "../utils/Auth";

/* 
  @Auther :- Praveenkumar
  transactionDetails and all abou transaction details operation is here
  Last changed Cancel booking 
  dec 06 2023 -- last changed

*/

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="standard" {...props} />;
});

function TransactionDashboardCom(props) {
  // for the test
  const [anchorEl, setAnchorEl] = useState(null);

  const [manualOVerrideItems, setManualOverrideITems] = useState({
    MobileNo: "",
    terminalID: "",
  });

  // const propsTransitTerminalID = props.transitTerminalID;

  const useLogDetials = useLogDetails();

  const [isCancelBookingSuccess, setIsCancelBookingSuccess] = useState(false);
  const [isCancelBookingError, setIsCancelBookingError] = useState(false);
  const [isVerifyPaymentStatusSuccess, setIsVerifyPaymentStatusSuccess] =
    useState(false);
  const [isVerifyPaymentStatusFailed, setIsVerifyPaymentStatusFailed] =
    useState(false);

  const [enteredMobileNo, setEnteredMobileNo] = useState("");

  const [dateOfTransaction, setDateOfTransaction] = useState("");
  const [balanceAmount, setBalanceAmount] = useState(0);
  const [totAmnt, setTotAmnt] = useState();
  const [totExcessAmount, setTotExcessAmount] = useState();

  const [customerName, setCustomerName] = useState("");
  const [cancelPayPacket, setcancelpayPacket] = useState("");

  const [loadBackdrop, setLoadBackdrop] = useState(false);
  const [stateName, setStateName] = useState("");

  const open = Boolean(anchorEl);

  const openOptions = (
    custName,
    mobileNo,
    terminalId,
    lockNo,
    dateOfOpen,
    amount,
    excess_amount,
    packetT,
    event
  ) => {
    setAnchorEl(event.currentTarget);
    setManualOverrideITems({
      ...manualOVerrideItems,
      MobileNo: mobileNo,
      terminalID: terminalId,
    });

    setDateOfTransaction(dateOfOpen);
    setCustomerName(custName);
    setLockNo(lockNo);

    setTotAmnt(packetT === "paymentSuccess" ? amount : excess_amount);
  };

  // testing above

  const [changeNummberWindVisible, setChangeNumberWindVisible] =
    useState(false);
  const [uncondLockOpenVisibility, setUncondLockOpenVisibility] =
    useState(false);

  const [openCancelBookingDailogue, setOpenCancelBookingDailogue] =
    useState(false);
  const [city, setCity] = useState(null);
  const [area, setArea] = useState(null);
  const [visibleWindow, setVisibleWindow] = useState("hide-window");
  const [dataStatus, setDataStatus] = useState(true);
  const [btnText, setBtnText] = useState("Td History");

  const [cancelPaymentWind, setCancelPaymentWind] = useState(false);
  const [loadPage, setLoadPage] = useState(false);

  const [custData, setCustData] = useState({
    slno: "",
    terminalId: "",
    custemerName: "",
    mobileNumber: "",
    amount: "",
    dateOfOpen: "",
    timeOfOpen: "",
    status: "",
    noOfHours_inmins: "",
    transactionId: "",
    lockNo: "",
    passcode: "",
    excess_amount: "",
    excess_hour_inmins: "",
    stored_item: "",
    balance: "",
    partialOpen: "",
    amount_withoutGST: "",
    CGST: "",
    SGST: "",
    amount_withGST: "",
  });

  const [manualOverrideDet, setManaulOverrideDet] = useState({
    PacketType: "manovrlocopen",
    MobileNo: "",
    terminalID: "",
    reason: "",
    remarks: "",
    LOCKNO: "",
    ReqType: "",
    TransType: "Internet",
  });

  const [isChecked, setIsChecked] = useState(false);
  const [lockNo, setLockNo] = useState();
  const [allTerminalIds, setAllTerminalIds] = useState([]);
  const [sellectedTerminalId, setSelectedTerminalId] = useState(null);

  const [iconView, setIconView] = useState(true);
  const [iconViewDisable, setIconViewDisable] = useState(true);
  const [tableViewDisable, setTableViewDisable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // fot the stack alert
  const [state, setState] = useState({
    vertical: "top",
    horizontal: "center",
  });

  const { vertical, horizontal } = state;
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // for the updating payment status

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

  const Auth = useAuth()

  let selectedCity = (e) => {
    setCity(e.target.value);
  };

  let selectedArea = (e) => {
    setArea(e.target.value);

    // if (e.target.value !== null && city !== null) {
    //   let lockerDiv = document.getElementById("lockerContainerId");
    //   lockerDiv.style.display = "block";
    // }
  };

  function displayLockers(e) {
    selectedArea(e);
    if (city !== null && area !== null) {
      let lockerDiv = document.getElementById("lockerContainerId");
      lockerDiv.style.display = "block";
    }
  }

  // useEffect(() => {
  //   console.log(props.transitTerminalId[0]);
  //   setSelectedTerminalId(String(props.transitTerminalId[0]));
  //   fetchCustemerDetails(String(props.transitTerminalId[0]));
  // }, [props.transitTerminalId])

  // useEffect(() => {
  // fetchTransactionDetailHistory()
  // getTerminalIdsOfTransactionDetails();
  // }, []);

  // praveen changed here for statewise operations

  const getStatewiseTerminals = async (stateName) => {
    const terminalIds = await commonApiForGetConenction(
      Auth.serverPaths.localAdminPath+ "FetchStates?value=" + stateName +"&type=ALL"
    );

    setAllTerminalIds(terminalIds.terminals);

    const terminalRes = terminalIds.terminals[0].split(",");

    const termId = terminalRes[1].replace(/\s+/g, "");

    fetchCustemerDetails(termId);

    setSelectedTerminalId(terminalIds.terminals[0]);
  };

  const getTerminalIdsOfTransactionDetails = () => {
    // setLoading(true);
    const getLocksObj = {
      PacketType: "gettermid",
    };

    console.log(getLocksObj);

    fetch(Auth.serverPaths.localAdminPath+ "FetchTransactionDetails", {
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
            fetchCustemerDetails(data.terminalID[0]);
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

  // const userDataUrl =
  //   "http://192.168.0.198:8080/AuroAutoLocker/FetchTransactionDetails";

  const fetchCustemerDetails = (terminalId) => {
    setEnteredMobileNo("");
    console.log("inside function again :" + terminalId);

    const fetchLiveTransaction = {
      PacketType: "livetd",
      terminalID: terminalId,
    };
    fetch(Auth.serverPaths.localAdminPath + "FetchTransactionDetails", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify(fetchLiveTransaction),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.partialOpen);
        if (data.responseCode === "liveitems") {
          setCustData({
            ...custData,
            slno: data.slno,
            transactionId: data.transactionId,
            custemerName: data.custName,
            mobileNumber: data.mobileNum,
            terminalId: data.terminalId,
            status: data.status,
            amount: data.amount,
            dateOfOpen: data.dateOfOpen,
            noOfHours_inmins: data.noOfHours,
            timeOfOpen: data.timeOfOpen,
            lockNo: data.lockNo,
            passcode: data.passcode,
            stored_item: data.itemStored,
            excess_amount: data.excess_amount,
            excess_hour_inmins: data.excess_hour,
            balance: data.balance,
            partialOpen: data.partialOpen,
            amount_withoutGST: data.amount_withGST,
            CGST: data.CGST,
            SGST: data.SGST,
            amount_withGST: data.amount_withoutGST,
          });
        } else {
          alert("no data is present");
        }
      })
      .catch((err) => console.log("err : " + err));
  };

  // to get the lock numbers associated with the phone numbers
  // const getLockNumbers = (val) => {
  //   const data = {
  //     PacketType: "getLockerNumber",
  //     mobileNo: val,
  //   };
  //   fetch(userDataUrl, {
  //     method: "POST",
  //     headers: {
  //       Accept: "Application/json",
  //     },
  //     body: JSON.stringify(data),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (data.status === "success") {
  //         setLockNo(data.lockNo);
  //       }
  //     })
  //     .catch((err) => console.log(err));
  // };

  const reasons = ["Internet Down", "Online Payment Down", "Other"];

  let cityNames = [
    "Bengaluru",
    "Mumbai",
    "Delhi",
    "Kolkata",
    "Chennai",
    "Hyderabad",
    "Kochi",
  ];
  let areaNames = ["Rajajinagar", "Yalahanka", "Malleshwaram", "Banashankari"];

  const toggleCustDetailView = (viewType) => {
    if (viewType === "iconView") {
      setIconView(true);
      setIconViewDisable(true);
      setTableViewDisable(false);
    } else {
      setIconView(false);
      setIconViewDisable(false);
      setTableViewDisable(true);
    }
  };

  const manualOverrideWindId = document.getElementById(
    "manual-override-window_id"
  );

  const manualOverride = () => {
    // getLockNumbers(manualOVerrideItems.MobileNo);
    setManaulOverrideDet({
      ...manualOverrideDet,
      MobileNo: manualOVerrideItems.MobileNo,
      terminalID: manualOVerrideItems.terminalID,
    });
    manualOverrideWindId.style.display = "block";
    setVisibleWindow("display-window");
    setAnchorEl(null);
  };

  const hideWindowFunction = () => {
    manualOverrideWindId.style.display = "none";
    setVisibleWindow("hide-window");
    setManaulOverrideDet({
      ...manualOverrideDet,
      terminalID: "",
      reason: "",
      remarks: "",
      ReqType: "",
      LOCKNO: "",
    });
    setLockNo([]);
    setIsChecked(false);
  };

  const eventHandler = (e) => {
    e.preventDefault();
    const name = e.target.name;
    setManaulOverrideDet({
      ...manualOverrideDet,
      [name]: e.target.value,
    });
  };

  const submitManualOverride = (e) => {
    e.preventDefault();
    if (manualOverrideDet.LOCKNO !== "") {
      setIsLoading(true);
      console.log(manualOverrideDet);
      const manDetailsToServer = { ...manualOverrideDet };
      delete manDetailsToServer.reason;
      delete manDetailsToServer.remarks;
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
            storeManualOverrideInDB();
            // alert("Manual Override initiated")
            // setIsLoading(false);
          } else if (data.resposeCode === "REQF-201") {
            setIsError(true);
            setIsLoading(false);
            hideWindowFunction();

            alert("inside REQF-201");
          } else {
            setIsLoading(false);
            setIsError(true);
          }
        })
        .catch((err) => {
          console.log("error :" + err);
          setIsError(true);
          setIsLoading(false);
        });
    } else {
      console.log("Locker No is required");
      setIsLoading(false);
    }
  };

  // to store the manual
  const storeManualOverrideInDB = () => {
    fetch(Auth.serverPaths.localAdminPath + "FetchTransactionDetails", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify(manualOverrideDet),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data.status === "success") {
          const userLogsObj = {
            eventType: "tdManualOVerride",
            remarks: manualOverrideDet.LOCKNO + " is opened by manual override",
          };
          let timeCount = 2;
          const interval = setInterval(() => {
            console.log(timeCount + "-----******-----");
            if (timeCount <= 0) {
              console.log("interval cleared -----******-----");
              clearInterval(interval);
              hideWindowFunction();
              fetchCustemerDetails(manualOverrideDet.terminalID);
              setIsSuccess(true);
              setIsLoading(false);
            }
            timeCount = timeCount - 1;
          }, 1000);
          useLogDetials.storeUserLogs(userLogsObj);
          // setManaulOverrideDet({
          //   ...manualOverrideDet,
          //   terminalID: "",
          //   reason: "",
          //   remarks: "",
          //   ReqType: "",
          //   LOCKNO:""
          // });
          // setLockNo([]);
          // to fetch the transaction details data after manually overriding
        } else {
          hideWindowFunction();
          setIsLoading(false);
          setIsError(true);
        }
      })
      .catch((err) => {
        console.log("err : " + err);
        hideWindowFunction();
        setIsError(true);
        setIsLoading(false);
      });
  };

  const changeView = () => {
    if (dataStatus) {
      setDataStatus(false);
      setBtnText("TD Active");
      setIconViewDisable(true);
      setTableViewDisable(true);
    } else {
      setDataStatus(true);
      setBtnText("TD History");
      setIconViewDisable(true);
      setTableViewDisable(false);
    }
  };

  const checkBoxHandler = (e) => {
    console.log(e.target.checked);
    let val = e.target.value;
    if (e.target.checked) {
      setManaulOverrideDet({
        ...manualOverrideDet,
        LOCKNO: val,
      });
      setIsChecked(true);
    }

    // uncomment and use it if you gonna let user to select more than 1 lock
    // if (e.target.checked) {
    //   const previusVal = [...manualOverrideDet.LOCKNO, val];
    //   setManaulOverrideDet({
    //     ...manualOverrideDet,
    //     LOCKNO: previusVal,
    //   });

    //   console.log(previusVal);
    // } else {
    //   const previusVal = [...manualOverrideDet.LOCKNO];
    //   const index = previusVal.indexOf(val);
    //   if (index > -1) {
    //     previusVal.splice(index, 1);
    //     setManaulOverrideDet({
    //       ...manualOverrideDet,
    //       LOCKNO: previusVal,
    //     });
    //     console.log(previusVal);
    //   }
    // }
  };

  const changeNumberVisibility = () => {
    // const changeNumId = document.getElementById("change-mobile-wind-id");
    setChangeNumberWindVisible(!changeNummberWindVisible);
    setVisibleWindow("display-window");
    setAnchorEl(null);
  };

  const showUnconditionalOpenLock = () => {
    // getLockNumbers(manualOVerrideItems.MobileNo);
    setUncondLockOpenVisibility(!uncondLockOpenVisibility);
    setVisibleWindow("display-window");
    setAnchorEl(null);
  };

  const hideWindowVisible = () => {
    setChangeNumberWindVisible(!setChangeNumberWindVisible);
    setVisibleWindow("hide-window");
  };

  const hideOpenLockWindVisibility = () => {
    setVisibleWindow("hide-window");
    setUncondLockOpenVisibility(!uncondLockOpenVisibility);
  };

  //close el (drop box icon items)
  const handleClose = () => {
    setAnchorEl(null);
  };

  const terminalIdEventHandler = (e, value) => {
    // setSelectedTerminalId(e.target.value);
    // fetchCustemerDetails(e.target.value);

    console.log(value);
    if (value !== null) {
      setSelectedTerminalId(value);

      const termRes = value.split(",");
      const termId = termRes[1].replace(/\s+/g, "");

      fetchCustemerDetails(termId);
    }
  };

  const hideAlertFunction = () => {
    setIsError(false);
    setIsCancelBookingError(false);
    setIsCancelBookingSuccess(false);
    setIsSuccess(false);
    setIsVerifyPaymentStatusFailed(false);
    setIsVerifyPaymentStatusSuccess(false);
  };

  const cancelBooking = () => {
    setOpenCancelBookingDailogue(true);
    setAnchorEl(null);
  };

  const closeCancelBookingDailogue = () => {
    setOpenCancelBookingDailogue(false);
  };

  const handleCancelBooking = () => {
    const respObj = {
      PacketType: cancelPayPacket,
      terminalID: manualOVerrideItems.terminalID,
      MobileNo: manualOVerrideItems.MobileNo,
      LockerNo: [lockNo],
      amount: totAmnt,
      // reason: "choose another locker",
    };

    setLoadBackdrop(true);
    setCancelPaymentWind(false);
    console.log(respObj);

    fetch(Auth.serverPaths.serverUrl, {
      method: "POST",
      headers: {
        accept: "application/json",
      },
      body: JSON.stringify(respObj),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        // if (data.responseCode === "RACANB-200") {
        if (data.responseCode === "cantracnfpay-200") {
          setIsCancelBookingSuccess(true);

          const userLogsObj = {
            eventType: "cancelbooking",
            remarks:
              manualOVerrideItems.terminalID +
              " from " +
              manualOVerrideItems.MobileNo +
              ", LockNo: " +
              lockNo +
              " For Amount " +
              totAmnt +
              " Rs " +
              " booking is cancelled " +
              " And PacketType is " +
              cancelPayPacket,
          };

          useLogDetials.storeUserLogs(userLogsObj);
        } else if (data.responseCode === "cantracnfpay-201") {
          setIsCancelBookingError(true);
          // setCancelPaymentWind(false);
        }
        setLoadBackdrop(false);
      })
      .catch((err) => {
        console.log("error : " + err);
        setIsCancelBookingError(true);
        // setCancelPaymentWind(false);
        setLoadBackdrop(false);
      });
    closeCancelBookingDailogue();
  };

  const checkPaymentStatusHandler = () => {
    const checkPaymentStatus = {
      MobileNo: manualOVerrideItems.MobileNo,
      LockerNo: lockNo,
      terminalID: manualOVerrideItems.terminalID,
      PacketType: "checkPayStatus",
    };
    setAnchorEl(null);

    fetch(Auth.serverPaths.serverUrl, {
      method: "POST",
      headers: {
        accept: "application/json",
      },
      body: JSON.stringify(checkPaymentStatus),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);

        if (data.responseCode === "checkpaystatus-200") {
          setIsVerifyPaymentStatusSuccess(true);
          fetchCustemerDetails(checkPaymentStatus.terminalID);
        } else if (data.responseCode === "checkpaystatus-201") {
          setIsVerifyPaymentStatusFailed(true);
        }
      })

      .catch((err) => {
        setIsVerifyPaymentStatusFailed(true);
        console.log("err : " + err);
      });
  };

  const initaiteRefundFunction = () => {
    const refundObj = {
      mobileNo: manualOVerrideItems.MobileNo,
      dateOfTransactionOpen: dateOfTransaction,
      type: "store",
    };
    props.onRefundClick(refundObj);
    setAnchorEl(null);
  };

  // TODO praveen for verifying the balance payment , and details about balance amounnt of a perticular usage
  // yet to completes

  // const verifyBalanceAmountHandler = () => {
  //   const getBalanceObj = {
  //     PacketType: "verbalance",
  //     mobileNo: manualOVerrideItems.MobileNo,
  //     balance: balanceAmount,
  //   };
  //   fetch(PathUrl.localServerPath + "FetchTransactionDetails", {
  //     method: "POST",
  //     headers: {
  //       Accept: "application/json",
  //     },
  //     body: JSON.stringify(getBalanceObj),
  //   })
  //     .then((resp) => resp.json())
  //     .then((data) => {
  //       console.log(data);
  //       if (data.status === "success") {

  //       } else {
  //         hideWindowFunction();
  //         setIsLoading(false);
  //         setIsError(true);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log("err : " + err);
  //       hideWindowFunction();
  //       setIsError(true);
  //       setIsLoading(false);
  //     });
  // };

  // updates payment to success TODO :- praveen april 14 2023

  const paymentUpdateResult = (req) => {
    fetch(Auth.serverPaths.serverUrl, {
      method: "POST",
      accept: "application/json",
      body: JSON.stringify(req),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data.responseCode === "confirmpay-200") {
          const reqObj = req;

          reqObj["PacketType"] = "strpaysuc";
          reqObj["LockerNo"] = req.LockerNo[0];

          console.log(reqObj);
          console.log(req);
          // JSON.parse(req);

          // console.log(reqObj);

          updatePayStatusInDb(reqObj);
        } else {
          setUpdatePaymentStatusDetailNotFound(true);
        }
        // return data;
      })
      .catch((err) => {
        setUpdatePaymentStatusDetailNotFound(true);
        setAnchorEl(null);
      });
  };

  const updatePaymentToSuccess = () => {
    const checkPaymentStatus = {
      MobileNo: manualOVerrideItems.MobileNo,
      LockerNo: [lockNo],
      terminalID: manualOVerrideItems.terminalID,
      PacketType: "confirmpay",
    };
    //strpaysuc

    paymentUpdateResult(checkPaymentStatus);

    // console.log(serverResp);
  };

  const updatePayStatusInDb = (checkPaymentStatus) => {
    fetch(Auth.serverPaths.localAdminPath + "FetchTransactionDetails", {
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
          fetchCustemerDetails(checkPaymentStatus.terminalID);
        } else if (data.responseCode === "updtpayfail-202") {
          setUpdatePaymentStutsFailed(true);
        } else if (data.responseCode === "notd-404") {
          setUpdatePaymentStatusDetailNotFound(true);
        } else if (data.responseCode === "paysucexist-500") {
          setUpdatePaymentStatusExistAlready(true);
        }

        const userLogsObj = {
          eventType: "tdPaySuccessUpdated",
          remarks:
            checkPaymentStatus.MobileNo +
            " from " +
            checkPaymentStatus.terminalID +
            ", LockNo: " +
            checkPaymentStatus.LockerNo +
            " is update as paymentSuccess",
        };
        setAnchorEl(null);
        useLogDetials.storeUserLogs(userLogsObj);
      })

      .catch((err) => {
        setUpdatePaymentStatusDetailNotFound(true);
        setAnchorEl(null);
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

  const handleCancelPaymentop = (packet) => {
    setCancelPaymentWind(true);
    setcancelpayPacket(packet);
  };

  const handleCloseCancelPayOp = () => {
    setOpenCancelBookingDailogue(true);
    setCancelPaymentWind(false);
  };

  const handleStateName = (stateName) => {
    setStateName(stateName);
    getStatewiseTerminals(stateName);
  };

  const handleUserEnteredMobileNo = (e) => {
    const regex = /^[0-9\b]+$/;
    if (
      (e.target.value.length < 11 && regex.test(e.target.value)) ||
      e.target.value === ""
    ) {
      setEnteredMobileNo(e.target.value);
    }
  };

  const fetchCustomerDataByMobileNumber = async () => {
    setLoadPage(true);
    const reqObj = {
      mobileNo: enteredMobileNo,
      PacketType: "getTDbyMobileNo",
    };

    const data = await commonApiForPostConenction(
      "FetchTransactionDetails",
      reqObj,
      Auth.accessAppType
    ).catch((err) => {
      setLoadPage(false);
      console.log("Error is : " + err);
    });

    if (data.responseCode === "TD-200") {
      setCustData({
        ...custData,
        slno: data.slno,
        transactionId: data.transactionId,
        custemerName: data.custName,
        mobileNumber: data.mobileNum,
        terminalId: data.terminalId,
        status: data.status,
        amount: data.amount,
        dateOfOpen: data.dateOfOpen,
        noOfHours_inmins: data.noOfHours,
        timeOfOpen: data.timeOfOpen,
        lockNo: data.lockNo,
        passcode: data.passcode,
        stored_item: data.itemStored,
        excess_amount: data.excess_amount,
        excess_hour_inmins: data.excess_hour,
        balance: data.balance,
        partialOpen: data.partialOpen,
        amount_withoutGST: data.amount_withGST,
        CGST: data.CGST,
        SGST: data.SGST,
        amount_withGST: data.amount_withoutGST,
      });

      setLoadPage(false);
    } else if (data.responseCode === "TD-404") {
      alert("No Data Present");
      setCustData({
        slno: "",
        terminalId: "",
        custemerName: "",
        mobileNumber: "",
        amount: "",
        dateOfOpen: "",
        timeOfOpen: "",
        status: "",
        noOfHours_inmins: "",
        transactionId: "",
        lockNo: "",
        passcode: "",
        excess_amount: "",
        excess_hour_inmins: "",
        stored_item: "",
        balance: "",
        partialOpen: "",
        amount_withoutGST: "",
        CGST: "",
        SGST: "",
        amount_withGST: "",
      });

      setLoadPage(false);
    } else {
      alert("Server Connection Lost, Try Again Later");
      setLoadPage(false);
    }
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

      {/*  cancel booking error */}
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={isCancelBookingError}
        autoHideDuration={6000}
        onClose={() => hideAlertFunction()}
      >
        <Alert onClose={() => hideAlertFunction()} severity="error">
          Somthing went Wrong ! please try again.
        </Alert>
      </Snackbar>

      {/* cancel booking success */}
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={isCancelBookingSuccess}
        autoHideDuration={6000}
        onClose={() => hideAlertFunction()}
      >
        <Alert onClose={() => hideAlertFunction()} severity="success">
          Cancel Booking was Successfull .
        </Alert>
      </Snackbar>

      {/* for check payment status success */}
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={isVerifyPaymentStatusSuccess}
        autoHideDuration={6000}
        onClose={() => hideAlertFunction()}
      >
        <Alert onClose={() => hideAlertFunction()} severity="success">
          verified. Payment Success !!
        </Alert>
      </Snackbar>

      {/* for check payment status error */}
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={isVerifyPaymentStatusFailed}
        autoHideDuration={6000}
        onClose={() => hideAlertFunction()}
      >
        <Alert onClose={() => hideAlertFunction()} severity="error">
          verified!! payment is not Success
        </Alert>
      </Snackbar>

      {/* for updating the payment status */}

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

      <div className="manual-override-window" id="manual-override-window_id">
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
                    checked={isChecked}
                    value={lockNo}
                    onChange={(e) => checkBoxHandler(e)}
                  />
                }
                label={lockNo}
              />
            </div>
          </FormGroup>

          <div className="textfield-container">
            <TextField
              label="mobile number"
              type="text"
              name="user_phone"
              size="small"
              value={manualOverrideDet.MobileNo}
              readOnly
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
                onChange={(e) => eventHandler(e)}
                value={manualOverrideDet.reason}
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
              value={manualOverrideDet.remarks}
              onChange={(e) => eventHandler(e)}
              variant="outlined"
              size="small"
              required
              focused
              fullWidth
            />
          </div>

          <div className="textfield-container">
            <FormControl focused fullWidth required>
              <InputLabel>Request Type</InputLabel>

              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                name="ReqType"
                size="small"
                label="Request Type"
                onChange={(e) => eventHandler(e)}
                value={manualOverrideDet.ReqType}
                required
              >
                <MenuItem value="Store">{"Store"}</MenuItem>
                <MenuItem value="Retrieve">{"Retrieve"}</MenuItem>

                {/* <MenuItem value="storecnf">{"Store Payment Confirm"}</MenuItem>
              
                <MenuItem value="retrievecnf">{"Retrieve Payment Confirm"}</MenuItem> */}
              </Select>
              <FormHelperText color="warning">
                select the request type
              </FormHelperText>
            </FormControl>
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

      {changeNummberWindVisible && (
        <div className="change-mobile-wind">
          <ChangeMobileNo
            currentNumber={manualOVerrideItems.MobileNo}
            terminalID={manualOVerrideItems.terminalID}
            hideWindowVisible={() => hideWindowVisible()}
            fetchDetails={fetchCustemerDetails.bind(this)}
          />
        </div>
      )}

      {uncondLockOpenVisibility && (
        <div className="change-uncondLock-wind">
          <UncondOpenLock
            currentNumber={manualOVerrideItems.MobileNo}
            terminalID={manualOVerrideItems.terminalID}
            lockNo={lockNo}
            updateTransactionDetails={fetchCustemerDetails.bind(this)}
            hideWindowVisible={() => hideOpenLockWindVisibility()}
          />
        </div>
      )}

      <div className="transaction-dash-container">
        {/* <div className="container-items">
          <DashBoardOperationItems />
          <hr />
        </div> */}
        <div className="transaction-details-item-container">
          <div className="header-container">
            <div className="dash-header">
              <h2>Transaction Dashboard</h2>
            </div>

            <StateWiseFormSelection
              onStateChangeCallback={(stateName) => handleStateName(stateName)}
            />

            <div className="terminal-id-drop-container">
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
                  </InputLabel> */}

                  {/* <NativeSelect
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
                        className={
                          props.transitTerminalID.includes(termID)
                            ? "option-container-transit"
                            : "option-container"
                        }
                        value={termID}
                        key={index}
                      >
                        {termID}
                      </option>
                    ))}
                  </NativeSelect> */}

                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={allTerminalIds}
                    value={sellectedTerminalId}
                    sx={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Choose terminalId"
                        focused
                      />
                    )}
                    onChange={(e, value) => terminalIdEventHandler(e, value)}
                    focused
                  />
                </FormControl>
              </Box>
            </div>

            <div className="searchbymobile_no_field">
              <TextField
                type="number"
                color="secondary"
                label="Search by mobile No"
                value={enteredMobileNo}
                // focused
                onChange={(e) => handleUserEnteredMobileNo(e)}
                sx={{
                  width: 200,
                  
                }}
                // fullWidth
              />

              {enteredMobileNo.length === 10 ? (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => fetchCustomerDataByMobileNumber()}
                  className="mobileNo-search-btn"
                  sx={{ width: 200 }}
                  // fullWidth
                  disabled={loadPage}
                >
                  Search Mobile No
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="error"
                  disabled
                  sx={{ width: 200 }}
                  className="mobileNo-search-btn"
                  // fullWidth
                >
                  Search Mobile No
                </Button>
              )}
            </div>

            <div className="transaction-details-container">
              {/* uncomment it incase of mapping through city names */}

              {/* <table className="form-table">
              <tr>
                <td className="table-label">
                  <label htmlFor="cityName" className="from-label">
                    city name :{" "}
                  </label>
                </td>
                <td className="table-input-body">
                  <select
                    name="cityName"
                    id="cityNAme"
                    className="form-input"
                    onChange={selectedCity}
                  >
                    {cityNames.map((cityName) => {
                      return (
                        <option key={cityName} value={cityName}>
                          {" "}
                          {cityName}
                        </option>
                      );
                    })}
                  </select>
                </td>
              </tr>

              <tr>
                <td className="table-label">
                  <label htmlFor="areaNames" className="from-label">
                    area name :{" "}
                  </label>
                </td>

                <td className="table-input-body">
                  <select
                    name="areaName"
                    id="areaName"
                    className="form-input"
                    onChange={displayLockers}
                  >
                    {areaNames.map((areaName) => {
                      return (
                        <option key={areaName} value={areaName}>
                          {" "}
                          {areaName}
                        </option>
                      );
                    })}
                  </select>
                </td>
              </tr>
            </table> */}
            </div>

            <div className="lockers-container" id="lockerContainerId">
              <div className="album py-5 td-container">
                <div className="btn-container">
                  <button
                    onClick={() => toggleCustDetailView("iconView")}
                    className="buttons btn-iconView"
                    disabled={iconViewDisable}
                  >
                    {" "}
                    Icon View{" "}
                  </button>
                  <button
                    onClick={() => toggleCustDetailView("tableView")}
                    className="buttons btn-tableView"
                    disabled={tableViewDisable}
                  >
                    {" "}
                    Detailed View{" "}
                  </button>
                </div>

                {/* <div className="active-btn-container">
                    <Button
                      color="secondary"
                      variant="contained"
                      size="medium"
                      onClick={() => changeView()}
                    >
                      {btnText}
                    </Button>
                  </div> */}

                {dataStatus &&
                  (iconView ? (
                    <>
                      <div className="row row-cols-md-2 g-2 td-icon-view-containers">
                        {custData.custemerName.length > 0 ? (
                          custData.custemerName.map((name, index) => {
                            return (
                              <div className="card  card-body-main">
                                <FontAwesomeIcon
                                  className="icon-class"
                                  icon={faUserLock}
                                  size="4x"
                                />
                                <div className="para-container" key={index}>
                                  <p className="td-para lock-contain">
                                    <strong>{custData.lockNo[index]}</strong>
                                  </p>
                                  <p className="td-para">{name}</p>

                                  <p className="td-para">
                                    {custData.mobileNumber[index]}
                                  </p>
                                </div>
                                <div className="info-icon-container">
                                  <BsFillInfoSquareFill
                                    aria-haspopup="true"
                                    onClick={(e) =>
                                      // manualOverride(
                                      //   custData.mobileNumber[index],
                                      //   custData.terminalId[index]
                                      // )
                                      openOptions(
                                        custData.custemerName[index],
                                        custData.mobileNumber[index],
                                        custData.terminalId[index],
                                        custData.lockNo[index],
                                        custData.dateOfOpen[index],
                                        custData.amount_withGST[index],
                                        custData.excess_amount[index],
                                        custData.status[index],
                                        e
                                      )
                                    }
                                    className="man-override-icon"
                                    size={15}
                                  />
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <h2 className="empty-td">
                            {" "}
                            Transaction details is empty{" "}
                          </h2>
                        )}
                      </div>
                    </>
                  ) : (
                    <div>
                      {custData.custemerName.length > 0 ? (
                        <LockerCatagoryTable
                          tableData={custData}
                          tableType={"transactionDetails"}
                          // manualOverrideFun={manualOverride.bind(this)}
                          manualOverrideFun={openOptions.bind(this)}
                        />
                      ) : (
                        <h2 className="empty-td">
                          {" "}
                          transaction details is empty{" "}
                        </h2>
                      )}
                    </div>
                  ))}
              </div>
              {/* {dataStatus === false && (
                <TDHistory
                  // tdhistoryData={tdHistory}
                  terminalID={sellectedTerminalId}
                />
              )} */}
            </div>
          </div>
          
          <Menu
            id="demo-customized-menu"
            MenuListProps={{
              "aria-labelledby": "demo-customized-button",
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={() => changeNumberVisibility()} disableRipple>
              <EditIcon />
              &nbsp; &nbsp; Change Mobile Number
            </MenuItem>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem onClick={() => manualOverride()} disableRipple>
              <ManageAccountsIcon />
              &nbsp; &nbsp; Manual override
            </MenuItem>
            <Divider sx={{ my: 2 }} />

            {/* confirms payment and updates to retreivecnf or storecnf in case of store, status from transaction details or transaction history */}

            <MenuItem onClick={() => updatePaymentToSuccess()} disableRipple>
              <VerifiedIcon />
              &nbsp; &nbsp; Confirm payment
            </MenuItem>
            <Divider sx={{ my: 2 }} />

            <MenuItem onClick={() => cancelBooking()} disableRipple>
              <NoEncryptionIcon />
              &nbsp; &nbsp; Cancel Booking
            </MenuItem>
            <Divider sx={{ my: 2 }} />

            {/* checks payment status from the razorpay dashboard in case if the payment is success and not captuered  */}

            <MenuItem onClick={() => checkPaymentStatusHandler()} disableRipple>
              <PaymentsIcon />
              &nbsp; &nbsp; Check Payment Status
            </MenuItem>
            <Divider sx={{ my: 2 }} />

            <MenuItem onClick={() => initaiteRefundFunction()} disableRipple>
              <CurrencyRupeeIcon />
              &nbsp; &nbsp; Initiate Refund
            </MenuItem>
            <Divider sx={{ my: 2 }} />

            {/* <MenuItem
              onClick={() => verifyBalanceAmountHandler()}
              disableRipple
            >
              <FactCheckIcon />
              &nbsp; &nbsp; Verify Balance
            </MenuItem>
            <Divider sx={{ my: 2 }} /> */}

            {/* <MenuItem onClick={() => showUnconditionalOpenLock()} disableRipple>
              <LockOpenIcon />
              &nbsp; &nbsp; Unconditionally Open lock
            </MenuItem> */}
          </Menu>
        </div>
      </div>

      <Dialog
        open={openCancelBookingDailogue}
        // aria-labelledby="responsive-dialog-title"
        onClose={() => {
          setOpenCancelBookingDailogue(false);
        }}
        style={{
          textAlign: "center",
          width: "500px",
          alignItems: "center",
          margin: "auto",
        }}

        // maxWidth="10"
      >
        <DialogTitle>
          {/* {"Do You Want To Cancel current Booking ?"} */}
          <b
            style={{
              color: "crimson",
              textAlign: "center",
              alignItems: "center",
            }}
          >
            {"Please select valid operation."}
          </b>
          <hr style={{ marginTop: "5px", marginBottom: "0px" }} />
        </DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            Selected Booking <b> Locker No: {lockNo} </b> Will Be Cancelled From{" "}
            <b> From Terminal Id : {manualOVerrideItems.terminalID}</b>, And
            Will No Longer Belongs To <b> {customerName} </b>.
          </DialogContentText> */}
          <DialogContentText>
            <Button
              sx={{ mb: 1 }}
              color="info"
              variant="contained"
              onClick={() => handleCancelPaymentop("cantrapartretrieve")}
              fullWidth
            >
              {" "}
              Cancel Partial Retrieve
            </Button>
            <Button
              sx={{ mb: 1 }}
              color="info"
              variant="contained"
              onClick={() => handleCancelPaymentop("cantralockerchange")}
              fullWidth
            >
              {" "}
              Cancel Locker Change
            </Button>
            <Button
              sx={{ mb: 1 }}
              color="info"
              variant="contained"
              onClick={() => handleCancelPaymentop("cantraexcespaydone")}
              fullWidth
            >
              {" "}
              Cancel with Transaction
            </Button>
            <Button
              sx={{ mb: 1 }}
              color="info"
              variant="contained"
              onClick={() => handleCancelPaymentop("cantraexcespayndone")}
              fullWidth
            >
              {" "}
              Cancel Without Transaction
            </Button>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {/* <Button autoFocus onClick={closeCancelBookingDailogue}>
            Cancel
          </Button>
          <Button onClick={() => handleCancelBooking()} autoFocus>
            confirm
          </Button> */}
        </DialogActions>
      </Dialog>

      {/* praveen edit here for cancel payment's */}

      <Dialog
        open={cancelPaymentWind}
        // aria-labelledby="responsive-dialog-title"
        onClose={() => {
          setCancelPaymentWind(false);
        }}
        style={{
          textAlign: "center",
          // width: "500px",
          // alignItems: "center",
          margin: "auto",
        }}

        // maxWidth="10"
      >
        <DialogTitle>
          {/* {"Do You Want To Cancel current Booking ?"} */}
          <b
            style={{
              color: "crimson",
              textAlign: "center",
              alignItems: "center",
            }}
          >
            {"Please verify before submitting."}
          </b>
          <hr style={{ marginTop: "5px", marginBottom: "0px" }} />
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {cancelPayPacket === "cantraexcespaydone" ? (
              <>
                <b style={{ color: "chocolate" }}>Selected Booking Details:</b>{" "}
                <b> Locker No: {lockNo} </b> Will Be Cancelled{" "}
                <b> From Terminal Id : {manualOVerrideItems.terminalID}</b>, And
                Will No Longer Belongs To <b> {customerName} </b>. And the
                amount
                <b style={{ color: "green" }}>
                  {" " + totAmnt + " Rs has been paid"}
                </b>
              </>
            ) : cancelPayPacket === "cantraexcespayndone" ? (
              <>
                <b style={{ color: "chocolate" }}>Selected Booking Details:</b>{" "}
                <b> Locker No: {lockNo} </b> Will Be Cancelled{" "}
                <b> From Terminal Id : {manualOVerrideItems.terminalID}</b>, And
                Will No Longer Belongs To <b> {customerName} </b>. And the
                amount
                <b style={{ color: "green" }}>
                  {" " + totAmnt + " Rs has not been paid"}
                </b>
              </>
            ) : (
              <>
                <b style={{ color: "chocolate" }}>Selected Booking Details:</b>{" "}
                <b> Locker No: {lockNo} </b> Will Be Cancelled{" "}
                <b> From Terminal Id : {manualOVerrideItems.terminalID}</b>, And
                Will No Longer Belongs To <b> {customerName} </b>.
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCloseCancelPayOp}>
            Cancel
          </Button>
          <Button onClick={() => handleCancelBooking()} autoFocus>
            confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadBackdrop}
        // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
}

export default TransactionDashboardCom;
