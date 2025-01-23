import React, { Component } from "react";
import { classUseAuth } from "../../utils/Auth";
import Navbar from "../../mainDashBoard/Navbar";
import {
  Box,
  FormControl,
  InputLabel,
  NativeSelect,
  TextField,
} from "@mui/material";
import {
  commonApiForPostConenction,
  getCurrentDateSQL,
} from "../../GlobalVariable/GlobalModule";
import LockerCatagoryTable from "../../settingsComponent/TableFunction/LockerCatagoryTable";

class viewUserlogs extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    users: [],
    logsObj: {
      slno: [],
      operationType: [],
      operationTime: [],
      operationDate: [],
      operationUser: [],
      description: [],
    },
    selectedDate: "",
    selectedType: "",
    Auth: "",
    selectedUSer: "ALL_USERS",
    isDateWrong: false,
  };

  componentDidMount = () => {
    const { auth } = this.props;

    // to get the logs of current date
    let payload = {
      date: getCurrentDateSQL(),
      packetType: "GET_USERS",
      username: this.state.selectedUSer,
    };

    this.makeApiRequest(payload, auth);
  };

  onChangeSelectedDate = (e) => {
    const selecteDate = e.target.value;
    const isSelectedDateOk = this.verifyDate(selecteDate);

    if (isSelectedDateOk) {
      const obj = {
        packetType: "LOGS_BY_DATE",
        date: selecteDate,
        username: this.state.selectedUSer,
      };
      this.makeApiRequest(obj, "");
    } else {
      this.setState((prevState) => ({
        ...prevState,
        selecteDate: selecteDate,
        isDateWrong: true,
      }));
    }
  };

  makeApiRequest = async (payload, Auth) => {
    let auth;

    if (Auth === undefined || Auth === null || Auth === "") {
      auth = this.state.Auth;
    } else {
      auth = Auth;
    }

    const result = await commonApiForPostConenction(
      "handle-logs",
      payload,
      Auth.accessType
    );

    if (result) {
      if (result.response === 200) {
        // request is ok

        if (payload.packetType === "GET_USERS") {
          payload = {
            ...payload,
            packetType: "LOGS_BY_DATE",
          };

          console.log(result.users);

          let allUSers = ["ALL_USERS", ...result.users];

          console.log(allUSers);

          this.setState((prevData) => ({
            ...prevData,
            users: allUSers,
          }));

          this.makeApiRequest(payload, auth);
        } else {
          this.setState((prevData) => ({
            ...prevData,
            logsObj: {
              slno: result.slno,
              operationType: result.eventType,
              operationTime: result.eventTime,
              operationDate: result.eventDate,
              operationUser: result.username,
              description: result.remarks,
            },
            selectedDate: payload.date,
            selectedUSer: payload.username,
          }));
        }
      } else if (result.response === 204) {
        // no data present

        this.setState((prevData) => ({
          ...prevData,
          logsObj: {
            slno: [],
            operationType: [],
            operationTime: [],
            operationDate: [],
            operationUser: [],
            description: [],
          },
          selectedDate: payload.date,
          selectedUSer: payload.username,
        }));

        alert("no data present");
      } else {
        // other responses

        this.setState((prevData) => ({
          ...prevData,
          logsObj: {
            slno: [],
            operationType: [],
            operationTime: [],
            operationDate: [],
            operationUser: [],
            description: [],
          },
          selectedDate: payload.date,
          selectedUSer: payload.username,
        }));

        alert("something went wrong");
      }
    } else {
      this.setState((prevData) => ({
        ...prevData,
        logsObj: {
          slno: [],
          operationType: [],
          operationTime: [],
          operationDate: [],
          operationUser: [],
          description: [],
        },
        selectedDate: payload.date,
        selectedUSer: payload.username,
      }));
      alert("some communication error occured !");
    }
  };

  verifyDate = (selectedDate) => {
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

  handleUserSelection = (e) => {
    const userName = e.target.value;

    const obj = {
      packetType: "LOGS_BY_DATE",
      date: this.state.selectedDate,
      username: userName,
    };

    this.makeApiRequest(obj, "");
  };

  render() {
    const { selectedDate, selectedUSer, users, isDateWrong, logsObj } =
      this.state;

    const onChangeSelectedDate = this.onChangeSelectedDate;
    const handleUserSelection = this.handleUserSelection;

    return (
      <>
        <Navbar />
        <div className="components-below-navbar">
          <div className="toxlsheet-container">
            <h4 className="h4-style">View User-logs here</h4>

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
                  <InputLabel
                    variant="standard"
                    color="info"
                    htmlFor="uncontrolled-native"
                  >
                    Choose State
                  </InputLabel>
                  <NativeSelect
                    defaultValue={30}
                    variant="outlined"
                    color="success"
                    inputProps={{
                      name: "Choose State",
                      id: "uncontrolled-native",
                    }}
                    value={selectedUSer}
                    onChange={(e) => handleUserSelection(e)}
                  >
                    {users.map((user, index) => (
                      <option
                        className={"states-container"}
                        value={user}
                        key={index}
                      >
                        {user}
                      </option>
                    ))}
                  </NativeSelect>
                </FormControl>
              </Box>
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

            {logsObj.slno.length > 0 ? (
              <LockerCatagoryTable
                tableData={logsObj}
                tableType={"SITE_TABLE"}
              />
            ) : (
              `No logs found on ${selectedDate}`
            )}
          </div>
        </div>
      </>
    );
  }
}

export default classUseAuth(viewUserlogs);
