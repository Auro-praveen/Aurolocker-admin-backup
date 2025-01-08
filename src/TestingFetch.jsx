import { Button } from "@mui/material";
import axios from "axios";

import React from "react";
import { useState } from "react";
import { exportToExcel } from "react-json-to-excel";

const TestingFetch = () => {

    const [xlStoreObj, setXlStoreObj] = useState([])
  const obj = {
    PacketType: "getxl",
    fromDate: "2023-06-01",
    toDate: "2023-11-07",
  };
  const getAllData = () => {
    fetch("http://192.168.0.198:8080/AuroAutoLocker/FetchToXlSheet", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify(obj),
    })
      .then((data) => data.json())
      .then((resp) => {
        // console.log(resp);

        const arr = resp.jsontoxldata;
        // console.log(arr);
        // console.log(arr.length);

        let storeInXlSheet = [];

        arr.forEach((obj) => {
        //   console.log(obj);

          const sheetName = obj.sheetName;

          let xlSheetWise;
          let allDetails = [];

          obj.details.forEach((dObj) => {
            const details = {
              custName: dObj.custName,
              MobileNo: dObj.MobileNo,
              terminalID: dObj.terminalID,
              closingTime: dObj.closingTime,
              closingDate: dObj.closingTime,
              lockers: dObj.lockers,
              noOfHours: dObj.noOfHours,
              itemStored: dObj.itemStored,
              excess_hour: dObj.excess_hour,
              passcode: dObj.passcode,
              amount: dObj.amount,
              balance: dObj.balance,
              excess_amount: dObj.excess_amount,
              TotalAmountWithout_GST: dObj.TotalAmountWithout_GST,
              CGST: dObj.CGST,
              SGST: dObj.SGST,
              TotalAmountWith_GST: dObj.TotalAmountWith_GST,
            };

            allDetails.push(details);
          });

          xlSheetWise = { sheetName: sheetName, details: allDetails };
          storeInXlSheet.push(xlSheetWise);
        });

        console.log(storeInXlSheet);
        setXlStoreObj([...storeInXlSheet])
      })
      .catch((err) => {
        console.log(err);
      });
  };


  const storeTiXl = () => {
    exportToExcel(xlStoreObj, "someSortedFile", true)
  }


  /*

  plots to study
   XLSX utils, Blob,  URL.createObjectURL()

   const blob  = new Blob([excelBuffere], {type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet; charset=utf-8"})

  */
  return (
    <div>
      <Button onClick={() => getAllData()}>Submit</Button>
      <Button variant="contained" color="warning" onClick={() => storeTiXl()}>Submit</Button>
    </div>
  );
};

export default TestingFetch;
