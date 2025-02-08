import React, { useEffect, useState } from "react";
import LockerCatagoryTable from "../settingsComponent/TableFunction/LockerCatagoryTable";

import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import PathUrl from "../GlobalVariable/urlPath.json";
import DashBoardOperationItems from "../mainDashBoard/dashboardCards/DashBoardOperationItems";
import "./lockerStatus.css";
import {
  Autocomplete,
  Box,
  FormControl,
  InputLabel,
  NativeSelect,
  TextField,
} from "@mui/material";
import StateWiseFormSelection from "../GlobalVariable/StateWiseFormSelection";
import { commonApiForGetConenction } from "../GlobalVariable/GlobalModule";
import { useAuth } from "../utils/Auth";

function LockerStatus(props) {
  const [lockerStatus, setLockerStatus] = useState({
    slno: "",
    lockerNumber: "",
    lockerName: "",
    terminalId: "",
    deviceDate: "",
    deviceTime: "",
    packetType: "",
    rdate: "",
    remarks: "",
    rtime: "",
    status: "",
    userId: "",
    boxstatus: "",
  });

  const [stateName, setStateName] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [selectedTerminalId, setSelectedTerminalId] = useState("");
  const [allTerminalIds, setAllTerminalIds] = useState([]);

  const Auth = useAuth();

  // useEffect(() => {
  //   getTerminalIdsOfTransactionDetails();
  // }, []);

  // const lockerStatusUrl = "http://192.168.0.198:8080/AuroAutoLocker/FetchLockerStatus";

  const lockerStatusFunction = (terminalID) => {
    fetch(
      Auth.serverPaths.localAdminPath +
        "FetchLockerStatus?terminalId=" +
        terminalID,
      {
        method: "GET",
        headers: {
          accept: "application/json",
        },
      }
    )
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);

        if (data.responseCode === "lockstatus") {
          setLockerStatus({
            ...lockerStatus,
            slno: data.slno,
            lockerNumber: data.lockerNumber,
            lockerName: data.lockerName,
            terminalId: data.terminalId,
            deviceDate: data.deviceDate,
            deviceTime: data.deviceTime,
            packetType: data.packetType,
            remarks: data.remarks,
            rdate: data.rdate,
            rtime: data.rtime,
            status: data.status,
            userId: data.userId,
            boxstatus: data.boxtype,
          });
        } else {
          setLockerStatus({});
          alert("no lockers found fro the terminalID: " + terminalID);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        console.log("err : " + err);
      });
  };

  const getTerminalIdsOfTransactionDetails = () => {
    const getLocksObj = {
      PacketType: "gettermid",
      type: "ACTIVE",
    };

    console.log(getLocksObj);
    fetch(Auth.serverPaths.localAdminPath + "FetchStates", {
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
          const termIdArr = data.terminalID[0].split(",");
          const termId = termIdArr[1].replace(/\s+g/, "").trim();

          setAllTerminalIds(data.terminalID);
          lockerStatusFunction(termId);
        } else if (data.responseCode === "notd-201") {
          alert("no terminalId found, refresh and try again");
        }
      })
      .catch((err) => {
        console.log("err : " + err);
      });
  };

  const chooseTerminalIdHEventHAndler = (e, value) => {
    if (value !== null) {
      setSelectedTerminalId(value);
      const termRes = value.split(",");
      const termId = termRes[1].replace(/\s+/g, "").trim();
      lockerStatusFunction(termId);
    }
  };

  const handleStateName = (stateName) => {
    setStateName(stateName);
    getStatewiseTerminals(stateName);
  };

  const getStatewiseTerminals = async (stateName) => {
    const terminalIds = await commonApiForGetConenction(
      Auth.serverPaths.localAdminPath +
        "FetchStates?value=" +
        stateName +
        "&type=ACTIVE"
    );

    const terminalIdArr = terminalIds.terminals;
    setAllTerminalIds(terminalIdArr);

    if (terminalIdArr.length > 0) {
      const termIdRes = terminalIdArr[0].split(",");

      const termId = termIdRes[1].replace(/\s+/g, "").trim();
      setSelectedTerminalId(terminalIdArr[0]);
      lockerStatusFunction(termId);
    }
  };

  return (
    <div>
      {/* <div className="container-items">
        <DashBoardOperationItems />
        <hr />
      </div> */}
      <div className="page-header">
        <h2 className="page-title">Locker Status</h2>
      </div>

      <StateWiseFormSelection
        appSwitchedTo={props.appSwitchedTo}
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
            </InputLabel>
            <NativeSelect
              defaultValue={30}
              variant="outlined"
              color="success"
              inputProps={{
                name: "Choose terminalId",
                id: "uncontrolled-native",
              }}
              value={selectedTerminalId}
              onChange={(e) => chooseTerminalIdHEventHAndler(e)}
            >
              {allTerminalIds.map((termID, index) => (
                <option className="option-container" value={termID} key={index}>
                  {termID}
                </option>
              ))}
            </NativeSelect> */}

            <Autocomplete
              // disablePortal

              id="combo-box-demo"
              options={allTerminalIds}
              value={selectedTerminalId}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Choose terminalId" focused />
              )}
              onChange={(e, value) => chooseTerminalIdHEventHAndler(e, value)}
              focused
            />
          </FormControl>
        </Box>
      </div>
      {lockerStatus.slno ? (
        <LockerCatagoryTable
          tableData={lockerStatus}
          // fetchtableFun={fetchDataToTable}
          tableType={"lockerStatus"}
        />
      ) : (
        <div className="no-locker-status">
          <p>No Locker status where found</p>
          <p>Please Try again! later</p>
        </div>
      )}

      {isLoading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={true}
          // onClick={handleClose}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </div>
  );
}

export default LockerStatus;
