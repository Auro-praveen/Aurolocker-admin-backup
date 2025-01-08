import React, { useState } from "react";
import { useEffect } from "react";
import { JsonToExcel, exportToExcel } from "react-json-to-excel";
import urlPath from "../GlobalVariable/urlPath.json";
import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  bottomNavigationActionClasses,
  useTheme,
} from "@mui/material";
import "./historydatatoxl.css";
import Navbar from "../mainDashBoard/Navbar";
import { useAuth } from "../utils/Auth";

const samplejson2 = [
  {
    name: "asdf",
    age: 123,
  },
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(termid, terminalid, theme) {
  return {
    fontWeight:
      terminalid.indexOf(termid) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const HistoryDatatoXlsheet = () => {
  const [terminalID, setTerminalID] = useState([]);
  const [allTerminalIds, setAllTerminalIds] = useState([]);

  const [selectedItems, setSelectedItems] = useState({
    fromDate: "",
    toDate: "",
  });

  const [isDateWrong, setIsDateWrong] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadableXlFile, setDownloadableXlFile] = useState("");

  const [dataFromServertoSheet, setDataFromServerToSheet] = useState([]);

  const theme = useTheme();
  const Auth = useAuth()

  useEffect(() => {
    // testFun();
    getAllTerminalIds();
  }, []);

  const getAllTerminalIds = () => {
    // setLoading(true);
    const getLocksObj = {
      PacketType: "gettermid",
    };

    console.log(getLocksObj);

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
          if (data.terminalID.length > 1) {
            setAllTerminalIds(["all", ...data.terminalID]);
          } else {
            setAllTerminalIds(data.terminalID);
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

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    if (value.includes("all") || value.length === allTerminalIds.length - 1) {
      setTerminalID(["all"]);
    } else {
      setTerminalID(
        // On autofill we get a stringified value.
        typeof value === "string" ? value.split(",") : value
      );
    }
  };

  const chartForTHistorySelectHandler = (e) => {
    if (e.target.name === "toDate") {
      const fDate = new Date(selectedItems.fromDate).getTime();
      const tDate = new Date(e.target.value).getTime();
      if (tDate >= fDate) {
        setIsDateWrong(false);
      } else {
        setIsDateWrong(true);
      }
    }
    setSelectedItems({
      ...selectedItems,
      [e.target.name]: e.target.value,
    });
  };

  const getHistoryTableDataForXlsx = (obj) => {
    setIsLoading(true);

    // Path Changed Here praveen to get details from invoice detials june-2024  FetchToXlSheet
    fetch(Auth.serverPaths.localAdminPath + "FetchToXlFromIvnoice", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify(obj),
    })
      .then((resp) => resp.json())
      .then((data) => {
        // console.log(data);

        if (data.responseCode === "tddata-200") {
          const arr = data.jsontoxldata;
          console.log(arr);
          // console.log(arr.length);

          let storeInXlSheet = [];

          arr.forEach((obj) => {
            // console.log(obj);

            const sheetName = obj.sheetName;

            let xlSheetWise;
            let allDetails = [];

            obj.details.forEach((dObj) => {
              // console.log(dObj);

              const details = {
                Slno : dObj.slno,
                custName: dObj.custName,
                MobileNo: dObj.MobileNo,
                terminalID: dObj.terminalID,
                invoice_date: dObj.invoice_date,
                invoice_time: dObj.invoice_time,
                lockers: dObj.lockers,
                noOfHours: dObj.noOfHours,
                // itemStored: dObj.itemStored,
                excess_hour: dObj.excess_hour,
                // passcode: dObj.passcode,
                amount: dObj.amount,
                balance: dObj.balance,
                excess_amount: dObj.excess_amount,
                partialRetAmount : dObj.partialRetAmount,
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
          // setXlStoreObj([...storeInXlSheet])
          setDataFromServerToSheet([...storeInXlSheet]);
        } else if (data.responseCode === "tddata-400") {
          setDataFromServerToSheet([]);
        }

        setIsLoading(false);
      })
      .catch((err) => {
        console.log("err : " + err);
        setIsLoading(false);
        // setLoading(false);
      });
  };

  const submitFormHAndler = () => {
    
    if (terminalID.includes("all")) {
      const obj = {
        PacketType: "getxl",
        ...selectedItems,
      };
      setDownloadableXlFile(
        "allTermidData-" + selectedItems.fromDate + "-" + selectedItems.toDate
      );

      getHistoryTableDataForXlsx(obj);

    } else {
      const obj = {
        // PacketType: "getforxlsxtermwise",
        PacketType: "gettermwise-xl",
        terminalID: terminalID,
        ...selectedItems,
      };
      setDownloadableXlFile(
        "termIdData-" + selectedItems.fromDate + "-" + selectedItems.toDate
      );
      getHistoryTableDataForXlsx(obj);
    }
  };

  const downloadAsxlsxSheetWise = () => {
    terminalID.includes("all")
      ? exportToExcel(dataFromServertoSheet, downloadableXlFile, true)
      : exportToExcel(dataFromServertoSheet, downloadableXlFile, true);
    alert("File Downloaded Successfully");
    setDataFromServerToSheet([]);
  };

  return (
    <div>
      <Navbar />
      <div className="components-below-navbar">
        <div className="toxlsheet-container">
          <h4 className="h4-style">
            Download transaction histroy data as xlsheet
          </h4>
          <div className="firmware-div">
            <FormControl sx={{ width: 210 }} required>
              <InputLabel id="demo-multiple-chip-label">Terminal ID</InputLabel>
              <Select
                labelId="demo-multiple-chip-label"
                id="demo-multiple-chip"
                multiple
                value={terminalID}
                onChange={handleChange}
                input={
                  <OutlinedInput
                    id="select-multiple-chip"
                    label="Terminal ID"
                  />
                }
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
                MenuProps={MenuProps}
              >
                {allTerminalIds.map((termid) => (
                  <MenuItem
                    key={termid}
                    value={termid}
                    style={getStyles(termid, terminalID, theme)}
                  >
                    {termid}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="textfield-container">
            <TextField
              variant="outlined"
              label="From date"
              type="date"
              focused
              name="fromDate"
              value={selectedItems.fromDate}
              required
              onChange={(e) => chartForTHistorySelectHandler(e)}
              sx={{
                width: 250,
                m: 1,
              }}
            />
            <TextField
              variant="outlined"
              label="To date"
              type="date"
              name="toDate"
              color={isDateWrong ? "error" : "primary"}
              value={selectedItems.toDate}
              focused
              required
              onChange={(e) => chartForTHistorySelectHandler(e)}
              sx={{
                width: 250,
                m: 1,
              }}
              helperText={isDateWrong ? "please select valid date" : ""}
            />
          </div>
          <div className="textfield-container">
            <Button
              variant="contained"
              color="warning"
              sx={{
                width: 250,
              }}
              disabled={isDateWrong ? true : isLoading ? true : false}
              onClick={() => submitFormHAndler()}
            >
              submit
            </Button>
          </div>
          {dataFromServertoSheet.length > 0 && (
            <div className="toxlsheet-btn">
              <Button
                variant="contained"
                color="error"
                sx={{
                  width: 200,
                  height: 50,
                }}
                onClick={() => downloadAsxlsxSheetWise()}
              >
                Download as Excel
              </Button>
            </div>
          )}

          {/* <Button onClick={testHere}>Test</Button> */}
        </div>
      </div>
    </div>
  );
};

export default HistoryDatatoXlsheet;
