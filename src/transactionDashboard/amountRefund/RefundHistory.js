import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import pathUrl from "../../GlobalVariable/urlPath.json";
import LockerCatagoryTable from "../../settingsComponent/TableFunction/LockerCatagoryTable";
import { TextField } from "@mui/material";
import { useAuth } from "../../utils/Auth";

const RefundHistory = () => {
  const [refundHistoryObj, setRefundHistoryObj] = useState({});
  const [isDateWrong, setIsDateWrong] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");


  const Auth = useAuth()

  useEffect(() => {
    const getRefundHistObj = {
      PacketType: "allrefhist",
    };

    fetchRefundHistoryDetails(getRefundHistObj);
  }, []);

  const fetchRefundHistoryDetails = (refundObj) => {
    fetch(Auth.serverPaths.localAdminPath + "FetchRefundHistory", {
      method: "Post",
      headers: {
        accept: "application/json",
      },
      body: JSON.stringify(refundObj),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data.slno) {
          setRefundHistoryObj(data);
        } else {
            setRefundHistoryObj({})
        }
      })
      .catch((err) => {
        console.log("error -- " + err);
      });
  };

  const onChangeSelectedDate = (e) => {
    const selecteDate = e.target.value;
    setSelectedDate(selecteDate);

    console.log(selecteDate);
    const isSelectedDateOk = verifyDate(selecteDate);

    if (isSelectedDateOk) {
      setIsDateWrong(false);
      const obj = {
        PacketType: "refhistbydate",
        reqdate: selecteDate,
      };
      fetchRefundHistoryDetails(obj);
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
    <div>
      <div className="page-header">
        <h2 className="page-title">Transaction Refund History</h2>
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

      {refundHistoryObj.slno ? (
        <LockerCatagoryTable
          tableData={refundHistoryObj}
          // fetchtableFun={fetchDataToTable}
          tableType={"refundhistory"}
        />
      ) : (
        <div className="no-locker-status">
          <p>No Refund History on Selected Date !!</p>
          <p>select different date </p>
        </div>
      )}
    </div>
  );
};

export default RefundHistory;
