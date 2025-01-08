import React, { useEffect, useRef, useState } from "react";
import "./mallAuthHist.css";
import MallAuthNav from "./MallAuthNav";
import { useAuth } from "../utils/Auth";
import PathUrl from "../GlobalVariable/urlPath.json";
import LockerCatagoryTable from "../settingsComponent/TableFunction/LockerCatagoryTable";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  TextField,
} from "@mui/material";

/*
 @Auther Praveenkumar Chikkajjanavar 

  Same basic details and the operations regarding the mall Transaction history mainly for the mall Authorities
  for the mall that we assigned to 

  last change 16-11-2023  praveenkumar
*/
const MallAuthHist = (props) => {
  const [siteDetails, setSiteDetails] = useState({
    siteName: "",
    siteLocation: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const [siteNameInString, setSiteNameInString] = useState("");

  const [selectedDate, setSelectedDate] = useState({
    fromDate: "",
    toDate: "",
  });

  const [isDateWrong, setIsDateWrong] = useState(false);

  const [mallAuthTdHistory, setMallAuthTdHistory] = useState({
    slno: "",
    customerName: "",
    // dateOfOpen: "",
    // timeOfOpen: "",
    terminalID: "",
    noOfHours_in_mins: "",
    lockerNumbers: "",
    // stored_item: "",
    closingDate: "",
    closingTime: "",
    excess_hour_in_mins: "",
    amount: "",
    excess_amount: "", //9
    balance: "",
    partRetreiveAmount: "",
    Totmount_excludingGST: "", //12
    CGST: "",
    SGST: "",
    Total_Amount: "",
  });

  // const [openXlDownload, setOpenXlDownload] = useState(true);

  useEffect(() => {
    console.log("mall auth history");
    console.log(props);

    setSiteDetails({
      siteName: props.siteName,
      siteLocation: props.siteLocation,
    });

    let siteNameInStr = "";

    console.log(typeof props.siteName);

    JSON.parse(props.siteName).map((val) => {
      siteNameInStr += val + ",";
    });

    setSiteNameInString(siteNameInStr);

    getTransactionHistoryForMallAuth(
      "cr-list",
      props.siteName,
      props.siteLocation
    );
  }, []);

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

  const getTransactionHistoryForMallAuth = (
    packetType,
    siteName,
    siteLocation
  ) => {
    setIsLoading(true);

    let reqestObj;
    if (packetType === "cr-hist") {
      reqestObj = {
        PacketType: packetType,
        siteName: siteName,
        siteLocation: siteLocation,
        currentDate: currentDate(),
      };
    } else {
      reqestObj = {
        PacketType: packetType,
        siteName: siteName,
        siteLocation: siteLocation,
        fromDate: selectedDate.fromDate,
        toDate: selectedDate.toDate,
      };
    }

    // fetching details from invoice details june 2024 FetchHistoryForMallAuth

    fetch(PathUrl.localServerPath + "FetchHistoryForMallAuthFromInvoice", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify(reqestObj),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data.responseCode === "tdhist-200") {
          setMallAuthTdHistory({
            ...mallAuthTdHistory,
            slno: data.slno,
            // dateOfOpen: data.dateOfTransaction,
            // timeOfOpen: data.timeOfTransaction,
            terminalID: data.terminalID,
            lockerNumbers: data.lockers,
            noOfHours_in_mins: data.noOfHours,
            customerName: data.custName,
            // stored_item: data.itemStored,
            closingDate: data.closing_date,
            closingTime: data.closingTime,
            excess_hour_in_mins: data.excess_hour,
            excess_amount: data.excess_amount,
            amount: data.amount,
            balance: data.balance,
            partRetreiveAmount: data.partRetAmount,
            Totmount_excludingGST: data.totAmntExcludingGST,
            CGST: data.CGST,
            SGST: data.SGST,
            Total_Amount: data.totAmntIncludingGST,
          });
          setIsLoading(false);
        } else if (data.responseCode === "tdhist-202") {
          alert("no terminalId in Site registtration");
          setMallAuthTdHistory({
            slno: "",
            customerName: "",
            // dateOfOpen: "",
            // timeOfOpen: "",
            terminalID: "",
            noOfHours_in_mins: "",
            lockerNumbers: "",
            // stored_item: "",
            closingDate: "",
            closingTime: "",
            excess_hour_in_mins: "",
            excess_amount: "",
            amount: "",
            balance: "",
            partRetreiveAmount: "",
            Totmount_excludingGST: "",
            CGST: "",
            SGST: "",
            Total_Amount: "",
          });
          setIsLoading(false);
        } else {
          setMallAuthTdHistory({
            slno: "",
            customerName: "",
            // dateOfOpen: "",
            // timeOfOpen: "",
            terminalID: "",
            noOfHours_in_mins: "",
            lockerNumbers: "",
            // stored_item: "",
            closingDate: "",
            closingTime: "",
            excess_hour_in_mins: "",
            excess_amount: "",
            amount: "",
            balance: "",
            partRetreiveAmount: "",
            Totmount_excludingGST: "",
            CGST: "",
            SGST: "",
            Total_Amount: "",
          });
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.log("err : " + err);
        setIsLoading(false);
      });
  };

  const onSubmitHandler = () => {
    getTransactionHistoryForMallAuth(
      "date-wise-hist",
      siteDetails.siteName,
      siteDetails.siteLocation
    );
  };

  const onSelectDateHandler = (e) => {
    if (e.target.name === "toDate") {
      const fDate = new Date(selectedDate.fromDate).getTime();
      const tDate = new Date(e.target.value).getTime();
      const cDate = new Date().getTime();

      if (tDate < fDate || tDate > cDate || fDate > cDate) {
        setIsDateWrong(true);
      } else {
        setIsDateWrong(false);
      }
    }

    setSelectedDate({
      ...selectedDate,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      {/* <MallAuthNav /> */}

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
        // onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <div className="mall-auth-item-container">
        <h4>
          Transaction History for the Terminals :{" "}
          <b style={{ color: "crimson" }}>{siteNameInString}</b>
        </h4>

        <div className="textfield-container">
          <TextField
            label="From Date"
            type="date"
            variant="outlined"
            error={isDateWrong}
            name="fromDate"
            color="info"
            value={selectedDate.fromDate}
            onChange={(e) => onSelectDateHandler(e)}
            sx={{
              m: 2,
              width: 250,
            }}
            focused
            required
          />

          <TextField
            label="To Date"
            variant="outlined"
            error={isDateWrong}
            type="date"
            color="info"
            name="toDate"
            value={selectedDate.toDate}
            onChange={(e) => onSelectDateHandler(e)}
            sx={{
              m: 2,
              width: 250,
            }}
            helperText={isDateWrong ? "Please Select Valid Date" : ""}
            focused
            required
          />
        </div>

        <div className="textfield-container">
          <Button
            color="info"
            variant="contained"
            disabled={isDateWrong}
            onClick={() => onSubmitHandler()}
            sx={{
              width: 300,
            }}
          >
            Submit
          </Button>
        </div>
      </div>


      {mallAuthTdHistory.slno ? (
        <LockerCatagoryTable
          // DownloadAsXl = {true}
          tableData={mallAuthTdHistory}
          tableType={"mallAuthHist"}
        />
      ) : (
        <p>No Data present</p>
      )}
    </>
  );
};

export default MallAuthHist;
