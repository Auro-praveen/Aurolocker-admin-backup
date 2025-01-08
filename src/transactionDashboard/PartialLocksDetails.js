import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import LockerCatagoryTable from "../settingsComponent/TableFunction/LockerCatagoryTable";
import PathUrl from "../GlobalVariable/urlPath.json";
import { useAuth } from "../utils/Auth";

const PartialLocksDetails = () => {
  const [partialLockersObj, setPartialLocksObj] = useState({
    slno: "",
    mobileNo: "",
    terminalID: "",
    lockerNo: "",
    dateofOpen: "",
    timeofOpen: "",
    openStatus: "",
    dateOfFullClose: "",
    timeOfFullClose: "",
  });
  const [isDateWrong, setIsDateWrong] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const Auth = useAuth();

  useEffect(() => {
    getAllLossedCustomers(currentDate());
  }, []);

  const getAllLossedCustomers = (givenDate) => {
    const reqObj = {
      PacketType: "partialdata",
      date: givenDate,
    };

    fetch(Auth.serverPaths.localAdminPath+ "FetchPartialRetrieve", {
      method: "POST",
      headers: {
        accept: "application/json",
      },
      body: JSON.stringify(reqObj),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.slno.length > 0) {
          setPartialLocksObj({
            ...partialLockersObj,
            slno: data.slno,
            mobileNo: data.mobileNo,
            lockerNo: data.lockerNo,
            terminalID: data.terminalId,
            dateofOpen: data.dateOfOpen,
            timeofOpen: data.timeOfOpen,
            openStatus: data.openStatus,
            dateOfFullClose: data.dateOfFullClose,
            timeOfFullClose: data.timeOfFullClose,
          });
        } else {
          setPartialLocksObj({
            ...partialLockersObj,
            slno: "",
            mobileNo: "",
            lockerNo: "",
            dateofOpen: "",
            timeofOpen: "",
            openStatus: "",
            dateOfFullClose: "",
            timeOfFullClose: "",
          });
        }
      })
      .catch((err) => {
        console.log("err :" + err);
      });
  };

  const currentDate = () => {
    const date = new Date();
    console.log(
      date.getFullYear() +
        "-" +
        String(date.getMonth() + 1) +
        "-" +
        date.getDate()
    );
    setSelectedDate(
      date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate()
    );

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
      String(date.getMonth() + 1) +
      "-" +
      date.getDate()
    );
  };

  const onChangeSelectedDate = (e) => {
    const selecteDate = e.target.value;
    setSelectedDate(selecteDate);

    console.log(selecteDate);
    const isSelectedDateOk = verifyDate(selecteDate);

    if (isSelectedDateOk) {
      setIsDateWrong(false);
      getAllLossedCustomers(selecteDate);
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
    <div className="lossed-customer-component">
      <div className="page-header">
        <h2 className="page-title">partially opened locks</h2>
      </div>

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

      {partialLockersObj.slno ? (
        <LockerCatagoryTable
          tableData={partialLockersObj}
          tableType={"partiallocks"}
        />
      ) : (
        <p>No Lossed Customers on selected Date</p>
      )}
    </div>
  );
};

export default PartialLocksDetails;
