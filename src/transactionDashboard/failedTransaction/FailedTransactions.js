import { TextField } from "@mui/material";
import React, { useState } from "react";
import { useEffect } from "react";
import urlPath from "../../GlobalVariable/urlPath.json";
import LockerCatagoryTable from "../../settingsComponent/TableFunction/LockerCatagoryTable";
import "./failedTransaction.css";
import { useAuth } from "../../utils/Auth";
const FailedTransactions = () => {
  const [failedTrnsactions, setFailedTransaction] = useState({
    slno: "",
    mobileNo: "",
    customerName: "",
    dateofOpen: "",
    timeofOpen: "",
    terminalId: "",
    transactionId: "",
    noOfHours: "",
    amount: "",
    status: "",
    balance: "",
    lockerNo: "",
    itemStored: "",
    excessAmount: "",
    excessHour: "",
    Passcode: ""
  });
  const [isDateWrong, setIsDateWrong] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const Auth = useAuth()

  useEffect(() => {
    getFailedTransactions(currentDate());
  }, []);

  const currentDate = () => {
    const date = new Date();
    return (
      date.getFullYear() +
      "-" +
      (Number(date.getMonth()) + 1) +
      "-" +
      date.getDate()
    );
  };

  const getFailedTransactions = (providedDate) => {
    const reqBody = {
      PacketType: "ftrans",
      date: providedDate,
    };
    fetch(Auth.serverPaths.localAdminPath+ "FetchFailedTransaction", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify(reqBody),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data.responseCode === "ftd-202") {
          // alert("no failed transaction available")
          setFailedTransaction({
            ...failedTrnsactions,
            slno: "",
            mobileNo: "",
            customerName: "",
            dateofOpen: "",
            timeofOpen: "",
            terminalId: "",
            transactionId: "",
            noOfHours: "",
            amount: "",
            status: "",
            balance: "",
            lockerNo: "",
            itemStored: "",
            excessAmount: "",
            excessHour: "",
            Passcode: "",
          });
        } else {
          setFailedTransaction({
            ...failedTrnsactions,
            slno: data.slno,
            mobileNo: data.mobileNumber,
            customerName: data.customerName,
            dateofOpen: data.dateOfOpen,
            timeofOpen: data.timeOfOpen,
            terminalId: data.terminalID,
            transactionId: data.transactionID,
            noOfHours: data.noOfHours,
            amount: data.amount,
            status: data.status,
            balance: data.balance,
            lockerNo: data.lockerNo,
            itemStored: data.itemStored,
            excessAmount: data.excessAmount,
            excessHour: data.excessHour,
            Passcode: data.passcode,
          });
          // alert("present")
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onChangeSelectedDate = (e) => {
    const selecteDate = e.target.value;
    setSelectedDate(selecteDate);

    console.log(selecteDate);
    const isSelectedDateOk = verifyDate(selecteDate);

    if (isSelectedDateOk) {
      setIsDateWrong(false);
      getFailedTransactions(selecteDate);
    } else {
      setIsDateWrong(true);
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
  return (
    <div className="failed-td-container">
      <h2 className="page-header">Failed Transaction</h2>

      <div className="mui-mobile-date-picker">
        <TextField
          label="choose date here ..."
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
      {failedTrnsactions.slno ? (
        <LockerCatagoryTable
          tableData={failedTrnsactions}
          tableType={"failedTransaction"}
        />
      ) : (
        <h2> No Failed Transaction present in selected Date </h2>
      )}
      {/* <p>{failedTrnsactions}</p> */}
    </div>
  );
};

export default FailedTransactions;
