import {
  Backdrop,
  Box,
  Button,
  FormControl,
  InputLabel,
  NativeSelect,
  TextField,
} from "@mui/material";
import React from "react";
import {
  commonApiForPostConenction,
  commonApiForPostConenctionServer,
} from "../../GlobalVariable/GlobalModule";
import Navbar from "../../mainDashBoard/Navbar";
import { classUseAuth } from "../../utils/Auth";

class AdminAccessInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      backdropOpen: false,
      terminalIds: [],
      terminalId: "",
    };

    // accessing auth directly which been exported from classUseAuth of useAuth
    this.getAllTerminalIds = this.getAllTerminalIds.bind(this);
    this.terminalIdEventHandler = this.terminalIdEventHandler.bind(this);
    this.submitHandlerHere = this.submitHandlerHere.bind(this);
    // this.componentDidMount = this.componentDidMount();
  }

  componentDidMount = () => {
    this.getAllTerminalIds();
  };

  getAllTerminalIds = async () => {
    this.setState({
      //   ...this.state,
      backdropOpen: true,
    });
    const path = "FetchTransactionDetails";
    const payloadObject = {
      PacketType: "gettermid",
    };

    const { auth } = this.props;
    await commonApiForPostConenction(path, payloadObject, auth.accessAppType)
      .then((data) => {
        console.log(data);

        this.setState({
          backdropOpen: false,
          terminalIds: [...data.terminalID],
          terminalId: data.terminalID[0],
        });
      })
      .catch((reject) => {
        this.setState({
          backdropOpen: false,
          terminalIds: [],
        });
        console.log(reject);
        alert("Something Went Wrong Please Try again later");
      });
  };

  terminalIdEventHandler = (e) => {
    this.setState({
      ...this.state,
      terminalId: e.target.value,
    });
  };

  async submitHandlerHere() {
    await commonApiForPostConenctionServer({
      PacketType: "getmac",
      terminalID: this.state.terminalId,
    })
      .then((data) => {
        console.log(data);

        if (data.responseCode === "success-200") {
          alert(" Success! Got success Response code ");
        } else {
          alert(" Failed! something went wrong ");
        }
      })
      .catch((reject) => {
        console.log(reject);

        alert("server communication Error :  " + reject);
      });
  }

  render() {
    const { backdropOpen, terminalIds, terminalId } = this.state;
    // const terminalIdEventHandler = this.terminalIdEventHandler();
    // const submitHandlerHere = this.submitHandlerHere();

    return (
      <>
        <Navbar />
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={backdropOpen}
          // onClick={handleClose}
        ></Backdrop>
        <div
          className="components-below-navbar"
          style={{ margin: "auto", textAlign: "center", alignItems: "center" }}
        >
          For Admin Access ONLY
          <div className="admin-access-window">
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
                  value={terminalId}
                  onChange={(e) => this.terminalIdEventHandler(e)}
                >
                  {terminalIds.map((termID, index) => (
                    <option
                      className="option-container"
                      value={termID}
                      key={index}
                    >
                      {termID}
                    </option>
                  ))}
                </NativeSelect>
              </FormControl>
            </Box>

            <Button
              onClick={() => this.submitHandlerHere()}
              sx={{ width: 200 }}
              variant="contained"
              color="error"
            >
              SUBMIT
            </Button>
          </div>
        </div>
      </>
    );
  }
}

export default classUseAuth(AdminAccessInfo);
