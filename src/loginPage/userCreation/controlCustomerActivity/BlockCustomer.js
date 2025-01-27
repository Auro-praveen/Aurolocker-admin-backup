import { Alert, Snackbar, Button, TextField } from "@mui/material";
import React from "react";
import {
  commonApiForPostConenction,
  commonApiForPostConenctionServer,
  storeUserLogs,
} from "../../../GlobalVariable/GlobalModule";
import { classUseAuth } from "../../../utils/Auth";
import { useLogDetails } from "../../../utils/UserLogDetails";

class BlockCustomer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mobileNo: "",
      reason: "",
      city: "",
      dateofblock: "",
      name: "",
      openSuccess: false,
      openError: false,
    };

    this.submitBlockCustomer = this.submitBlockCustomer.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.serverCommuncation = this.serverCommuncation.bind(this);
    this.handleChangeStateEvent = this.handleChangeStateEvent.bind(this);
    // this.componentDidMount = this.componentDidMount();
  }

  // componentDidMount = () => {
  //   const { auth } = this.props;
  //   console.log("--------- inside class component --------------");
  //   console.log(auth.accessAppType);
  // };

  async submitBlockCustomer(event) {
    console.log("clicked here");
    event.preventDefault();

    const isCustomerBlocked = await this.serverCommuncation();

    if (isCustomerBlocked) {
      this.setState({
        openSuccess: true,
        mobileNo: "",
        reason: "",
        dateofblock: "",
        name: "",
        city: "",
      });
    } else {
      this.setState({
        openError: true,
      });
    }
  }

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return; // Ignore if the user clicks away
    }
    this.setState({ openError: false, openSuccess: false }); // Close the alert
  };

  async serverCommuncation() {
    const reqObj = this.state;

    delete reqObj.openError;
    delete reqObj.openSuccess;

    console.log("inside sending button ");

    const { auth } = this.props;

    const accessType = auth.accessAppType;

    console.log("inside access type");

    console.log(accessType);

    const result = await commonApiForPostConenction(
      "fetchBlockedCustomers",
      {
        ...reqObj,
        packetType: "BLOCKCUST",
      },
      auth.accessType
    ).catch((err) => {
      console.log("err : " + err);
      return false;
    });

    if (result) {
      if (result.status === "SAVE-200") {
        const logObj = {
          eventType: "BLOCK-CUSTOMER",
          remarks: `customer with mob: ${reqObj.mobileNo} has been blocked`,
          username: auth.user,
        };

        storeUserLogs(logObj);
        return true;
      } else if (result.status === "FAIL-200") {
        return false;
      }
    } else {
      alert("server communication Error, try later");
      return false;
    }
  }

  handleChangeStateEvent(event) {
    console.log(event.target.name);

    if (event.target.name === "mobileNo") {
      const regex = /^[0-9\b]+$/;
      if (
        (event.target.value.length < 11 && regex.test(event.target.value)) ||
        event.target.value === ""
      ) {
        this.setState({
          [event.target.name]: event.target.value,
        });
      }
    } else {
      this.setState({
        [event.target.name]: event.target.value,
      });
    }
  }
  render() {
    const {
      mobileNo,
      reason,
      openSuccess,
      openError,
      city,
      name,
      dateofblock,
    } = this.state;

    return (
      <div className="useractivity-handler">
        <Snackbar
          open={openSuccess}
          autoHideDuration={6000} // Alert disappears after 5 seconds
          onClose={this.handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert onClose={this.handleClose} severity="success" variant="filled">
            Customer Has Been Blocked
          </Alert>
        </Snackbar>

        <Snackbar
          open={openError}
          autoHideDuration={6000} // Alert disappears after 5 seconds
          onClose={this.handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          <Alert onClose={this.handleClose} severity="error" variant="filled">
            Some Error Occured, try again later
          </Alert>
        </Snackbar>

        <div className="page-header">
          <h2 className="page-title">Block Customer</h2>
        </div>

        <div className="block-customer-fields-container">
          <h4>Please Enter All The Fields</h4>
          <form onSubmit={(e) => this.submitBlockCustomer(e)}>
            <TextField
              id="outlined-basic"
              label="mobile no"
              variant="outlined"
              value={mobileNo}
              type="number"
              name="mobileNo"
              fullWidth
              required
              sx={{ mt: 1 }}
              onChange={(event) => this.handleChangeStateEvent(event)}
            />
            <TextField
              id="outlined-basic"
              label="reason"
              variant="outlined"
              value={reason}
              name="reason"
              fullWidth
              required
              sx={{ mt: 1 }}
              onChange={(event) => this.handleChangeStateEvent(event)}
            />

            <TextField
              id="outlined-basic"
              label="city"
              variant="outlined"
              value={city}
              name="city"
              fullWidth
              required
              sx={{ mt: 1 }}
              onChange={(event) => this.handleChangeStateEvent(event)}
            />

            <TextField
              id="outlined-basic"
              type="date"
              variant="outlined"
              value={dateofblock}
              name="dateofblock"
              fullWidth
              required
              sx={{ mt: 1, mb: 2 }}
              helperText="date of blocking *"
              onChange={(event) => this.handleChangeStateEvent(event)}
            />

            <Button type="submit" variant="contained" color="error" fullWidth>
              {" "}
              Submit{" "}
            </Button>
          </form>
        </div>
      </div>
    );
  }
}

export default classUseAuth(BlockCustomer);
