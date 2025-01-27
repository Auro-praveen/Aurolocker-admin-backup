import React, { useState } from "react";
import "./updatetoDevice.css";
import StateWiseFormSelection from "../GlobalVariable/StateWiseFormSelection";
import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import {
  commonApiForGetConenction,
  commonApiForPostConenctionServer,
  getCurrentDateSQL,
  storeUserLogs,
} from "../GlobalVariable/GlobalModule";
import { useAuth } from "../utils/Auth";

const conType = ["SIMLANWIFI", "SIMLAN", "SIM"];

const UpdateDevice = () => {
  const [allTerminalIds, setAllTerminalIds] = useState([]);

  const [stateName, setStateName] = useState("");
  const [terminalId, setTerminalId] = useState("");
  const [selConType, setSelConType] = useState(conType[0]);

  const Auth = useAuth();

  const handleStateChange = (state) => {
    setStateName(state);
    getStatewiseTerminals(state);
  };

  const getStatewiseTerminals = async (stateName) => {
    const terminalIds = await commonApiForGetConenction(
      Auth.serverPaths.localAdminPath +
        "FetchStates?value=" +
        stateName +
        "&type=ALL"
    );

    setAllTerminalIds(terminalIds.terminals);

    const terminalValue = terminalIds.terminals[0].split(",");

    const termId = terminalValue[1].replace(/\s+/g, "");

    setTerminalId(terminalIds.terminals[0]);
  };

  const terminalIdEventHandler = (e, value) => {
    // setSelectedTerminalId(e.target.value);
    // fetchTransactionDetailHistory(
    //   "gettdhistorybyddate",
    //   e.target.value,
    //   selectedDate,
    //   "nonumber"
    // );

    // const terminalValue = value.split(",");
    // const termId = terminalValue[1].replace(/\s+/g, "");

    // if (termId) {
    //   setTerminalId(termId);
    // }

    setTerminalId(value);
  };

  const submitUpdateToDevice = (e) => {
    e.preventDefault();

    if (terminalId !== "" && selConType !== "") {
      console.log(terminalId);

      const terminalValue = terminalId.split(",");
      const termId = terminalValue[1].replace(/\s+/g, "");

      if (termId) {
        const obj = {
          PacketType: "devconntype",
          terminalID: termId,
          uDate: getCurrentDateSQL(),
          conType: selConType,
        };

        makeServerRequest(obj);
      }
    } else {
      alert("please fill all the details");
    }
  };

  const makeServerRequest = async (payload) => {
    const result = await commonApiForPostConenctionServer(
      payload,
      Auth.accessAppType
    ).catch((err) => {
      alert("server didnt respond");
      console.log(err);
    });

    if (result) {
      if (result.responseCode === "SUCCESS-200") {
        alert("Device Updated Successfully");
        setSelConType(conType[0]);
        setTerminalId(allTerminalIds.length > 0 ? allTerminalIds[0] : "");

        const logObj = {
          eventType: "UPDATE-TO-DEVICE",
          remarks: `updated to ${payload.terminalID} changed to ${payload.conType}`,
          username: Auth.user,
        };

        storeUserLogs(logObj);
      } else if (result.responseCode === "INVTERM-201") {
        alert("invalid terminalid");
      } else {
        alert("request failed!");
      }
    } else {
      alert("something went wrong!");
    }
  };

  const handleSelectConType = (e) => {
    setSelConType(e.target.value);
  };

  return (
    <div className="update-device-component">
      <div className="update-device-content">
        <>
          <div className="page-header">
            <h4 className="header-text">Update To Device</h4>
          </div>

          <form action="#" onSubmit={(e) => submitUpdateToDevice(e)}>
            <StateWiseFormSelection
              onStateChangeCallback={(state) => handleStateChange(state)}
            />

            <Box>
              <FormControl
                sx={{
                  mt: 2,
                  textAlign: "center",
                }}
                fullWidth
                focused
              >
                <Autocomplete
                  // disablePortal

                  id="combo-box-demo"
                  options={allTerminalIds}
                  value={terminalId}
                  //   sx={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Choose terminalId" focused />
                  )}
                  onChange={(e, value) => terminalIdEventHandler(e, value)}
                  focused
                />
              </FormControl>
            </Box>

            <FormControl
              sx={{
                mt: 2,
                textAlign: "center",
              }}
              fullWidth
            >
              <InputLabel id="demo-simple-select-label">Age</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selConType}
                label="Age"
                onChange={(e) => handleSelectConType(e)}
                required
              >
                {conType.length > 0 &&
                  conType.map((con, index) => (
                    <MenuItem value={con} key={index}>
                      {con}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              style={{ marginTop: "18px", marginBottom: "20px" }}
            >
              Submit
            </Button>
          </form>
        </>
      </div>
    </div>
  );
};

export default UpdateDevice;
