import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TablePagination,
  TextField,
} from "@mui/material";
import { Component } from "react";
import TableDataWithPagination from "../../utils/TablePaginationData";
import {
  commonApiForPostConenction,
  getCurrentDateSQL,
  getCurrentTimeSQL,
} from "../../GlobalVariable/GlobalModule";
import { classUseAuth } from "../../utils/Auth";
import CustomerFollowupTrDetails from "./models/TrDetails";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FolloupcusomterModel from "./models/FollowupCustomer";
import "./followup.css";

const data = {
  response: 200,
  tdDetails:
    '[{"slno":187482,"customerName":"bharat","mobileNo":"2222222222","date_of_open":"Jan 23, 2025","time_of_open":"03:49:02 pm","terminalid":"ORN","no_of_hours":60.0,"amount":1400.0,"status":"paymentSuccess","transactionID":"42610123251548451","excess_hours":1400.0,"excess_amount":32200.0,"lockNo":"S1","passcode":"1111","balance":0,"itemsStored":"Helmet","browtype":"terminal","partretamount":0},{"slno":187484,"customerName":"Ecec","mobileNo":"4545454545","date_of_open":"Jan 23, 2025","time_of_open":"04:58:26 pm","terminalid":"ORN","no_of_hours":60.0,"amount":1400.0,"status":"payFailPaylater","transactionID":"88170123251658101","excess_hours":1331.0,"excess_amount":30613.0,"lockNo":"S2","passcode":"1111","balance":0,"itemsStored":"Helmet","browtype":"terminal","partretamount":0},{"slno":187485,"customerName":"Xfsf","mobileNo":"8989898989","date_of_open":"Jan 23, 2025","time_of_open":"04:59:09 pm","terminalid":"ORN","no_of_hours":60.0,"amount":2000.0,"status":"payFailPaylater","transactionID":"03790123251658452","excess_hours":1330.0,"excess_amount":43890.0,"lockNo":"M3","passcode":"1111","balance":0,"itemsStored":"Helmet","browtype":"terminal","partretamount":0},{"slno":187486,"customerName":"Rrrr","mobileNo":"2225525252","date_of_open":"Jan 24, 2025","time_of_open":"02:57:12 pm","terminalid":"ORN","no_of_hours":60.0,"amount":1400.0,"status":"payFailPaylater","transactionID":"66120124251456541","excess_hours":12.0,"excess_amount":276.0,"lockNo":"S5","passcode":"1111","balance":0,"itemsStored":"Helmet","browtype":"terminal","partretamount":0}]',
};

const followupOperationTypes = [
  "PARTIAL-RETRIEVE",
  "EXCESS-USAGE",
  "CANCEL-BOOKING",
  "OTHER",
];

class FollowupCustomers extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    currentCustomerDetails: {
      slno: "",
      terminalId: "",
      custemerName: "",
      mobileNumber: "",
      amount: "",
      dateOfOpen: "",
      timeOfOpen: "",
      status: "",
      noOfHours_inmins: "",
      transactionId: "",
      lockNo: "",
      excess_amount: "",
      excess_hour_inmins: "",
      stored_item: "",
      partialOpen: "",
      browtype: "",
    },
    TransactionDetails: [],
    Auth: "",
    customerFollowupDetails: {},
    eventTriggered: false,
    openDialog: false,
    selectedCustomerFromDetails: "",
    followUpCustomers: [],
    selectedFollowupCustomer: {},
    dateSelected: getCurrentDateSQL(),
    isDateWrong: false,
    followCustomerEnteredDetails: {
      remarks: "",
      type: followupOperationTypes[0],
      date: "",
      time: "",
    },
  };

  componentDidMount = () => {
    const { auth } = this.props;

    this.handleBeforeAppLoadsApis(
      "customer-events",
      {
        PacketType: "GET-TD",
      },
      auth
    );

    this.handleBeforeAppLoadsApis(
      "customer-events",
      {
        PacketType: "GET-FOLLOW-BY-DATE",
        selectedDate: this.state.dateSelected,
      },
      auth
    );

    // if (result) {

    // } else {
    //   this.handleBeforeAppLoadsApis(
    //     "customer-events",
    //     {
    //       PacketType: "GET-TD",
    //     },
    //     auth.accessType
    //   );
    // }
  };

  handleBeforeAppLoadsApis = async (path, payload, auth) => {
    console.log(payload);

    const result = await commonApiForPostConenction(
      path,
      payload,
      auth.accessType
    ).catch((err) => {
      if (payload.PacketType === "GET-TD") {

        alert("error: transaction details follow-up")

        this.setState((prev) => ({
          ...prev,
          TransactionDetails: [],
          Auth: !prev.Auth && prev.Auth !== "" && auth,
        }));
      } else if (payload.PacketType === "GET-FOLLOW-BY-DATE") {
        // console.log("here inside GET-FOLLO");

        alert("error: fetching follow-up data")

        this.setState((prev) => ({
          ...prev,
          followUpCustomers: [],
          Auth: !prev.Auth && prev.Auth !== "" && auth,
          dateSelected: payload.selecteDate,
          isDateWrong:false
        }));
      }
      console.log("err : " + err);
    });

    if (result) {
      console.log(result);
      console.log(payload);
      if (result.response === 200) {
        console.log(result);
        if (payload.PacketType === "GET-TD") {
          const transactionDetails = JSON.parse(result.tdDetails).map(
            (transactionDetails) =>
              new CustomerFollowupTrDetails(transactionDetails)
          );
          this.setState((prev) => ({
            ...prev,
            TransactionDetails: transactionDetails,
            Auth: !prev.Auth && prev.Auth !== "" && auth,
          }));
        } else if (payload.PacketType === "GET-FOLLOW-BY-DATE") {
          console.log("here inside GET-FOLLO");

          const followupCustomers = JSON.parse(result.customers).map(
            (followupCustomers) => new FolloupcusomterModel(followupCustomers)
          );

          console.log(followupCustomers);
          this.setState((prev) => ({
            ...prev,
            followUpCustomers: followupCustomers,
            Auth: !prev.Auth && prev.Auth !== "" && auth,
            dateSelected: payload.selecteDate,
            isDateWrong:false
          }));
        }
      } else {
        if (payload.PacketType === "GET-TD") {

          alert("Note: Nothing on transaction details to follow-up")
          this.setState((prev) => ({
            ...prev,
            TransactionDetails: [],
            Auth: !prev.Auth && prev.Auth !== "" && auth,
          }));
        } else if (payload.PacketType === "GET-FOLLOW-BY-DATE") {
          // console.log("here inside GET-FOLLO");
          alert("Note: No follow-up details on selected-date")
          this.setState((prev) => ({
            ...prev,
            followUpCustomers: [],
            Auth: !prev.Auth && prev.Auth !== "" && auth,
            dateSelected: payload.selecteDate,
            isDateWrong:false
          }));
        }
      }
    } else {
      // console.log(result);

      if (payload.PacketType === "GET-TD") {
        alert("error: transaction details follow-up")
        this.setState((prev) => ({
          ...prev,
          TransactionDetails: [],
          Auth: !prev.Auth && prev.Auth !== "" && auth,
        }));
      } else if (payload.PacketType === "GET-FOLLOW-BY-DATE") {
        // console.log("here inside GET-FOLLO");
        alert("error: fetching follow-up data")

        this.setState((prev) => ({
          ...prev,
          followUpCustomers: [],
          Auth: !prev.Auth && prev.Auth !== "" && auth,
          dateSelected: payload.selecteDate,
          isDateWrong:false
        }));
      }
    }
  };

  async handleApiRequests(path, payload, type) {
    const result = await commonApiForPostConenction(
      path,
      payload,
      this.state.Auth.accessType
    ).catch((err) => {
      if (type === "STORE-EVENT") {
        this.setState((prev) => ({
          selectedCustomerFromDetails: "",
          openDialog: false,
          followCustomerEnteredDetails: {
            remarks: "",
            type: followupOperationTypes[0],
            date: "",
            time: "",
          },
        }));
      }
      console.log("error : " + err);
    });

    if (result) {
      if (result.response === 200) {
        if (type === "STORE-EVENT") {
          this.setState((prev) => ({
            selectedCustomerFromDetails: "",
            openDialog: false,
            followCustomerEnteredDetails: {
              remarks: "",
              type: followupOperationTypes[0],
              date: "",
              time: "",
            },
          }));

          this.handleBeforeAppLoadsApis(
            "customer-events",
            {
              PacketType: "GET-FOLLOW-BY-DATE",
              selectedDate: this.state.dateSelected,
            },
            this.state.Auth
          );
        }
      } else if (result.response === 400) {
        alert("operation failed!");

        if (type === "STORE-EVENT") {
          this.setState((prev) => ({
            selectedCustomerFromDetails: "",
            openDialog: false,
            followCustomerEnteredDetails: {
              remarks: "",
              type: followupOperationTypes[0],
              date: "",
              time: "",
            },
          }));
        }
      } else {
        alert("something went wrong1");

        if (type === "STORE-EVENT") {
          this.setState((prev) => ({
            selectedCustomerFromDetails: "",
            openDialog: false,
            followCustomerEnteredDetails: {
              remarks: "",
              type: followupOperationTypes[0],
              date: "",
              time: "",
            },
          }));
        }
      }
    } else {
      alert("some error");
    }
  }

  handleFollowupTableSelection = (data) => {
    console.log("inside here in follow up customer ");
    console.log(data);

    this.setState((prevData) => ({
      openDialog: true,
      selectedCustomerFromDetails: data,
    }));
  };

  closeDailogue = () => {
    this.setState((prev) => ({
      openDialog: false,
    }));
  };

  submitCustomerFollowup = () => {
    // selectedFollowupCustomer

    if (this.state.followCustomerEnteredDetails.remarks) {
      const selectedCustDetailsFromDetails = new CustomerFollowupTrDetails(
        this.state.selectedCustomerFromDetails
      );

      const followUpcustomerModel = new FolloupcusomterModel({
        slno: 0,
        customerName: selectedCustDetailsFromDetails.customerName,
        eventType: this.state.followCustomerEnteredDetails.type,
        eventDate: getCurrentDateSQL(),
        eventTime: getCurrentTimeSQL(),
        lockerNo: selectedCustDetailsFromDetails.lockNo,
        terminalId: selectedCustDetailsFromDetails.terminalid,
        eventTriggeredUser: this.state.Auth.user,
        remarks: this.state.followCustomerEnteredDetails.remarks,
        mobileNo: selectedCustDetailsFromDetails.mobileNo,
        state: "",
        city: "",
      });

      const reqPayload = {
        PacketType: "STORE-FOLLOW-DATA",
        customer: followUpcustomerModel,
      };

      console.log(reqPayload);

      this.handleApiRequests("customer-events", reqPayload, "STORE-EVENT");
    } else {
      alert("please enter all the details!");
    }
  };

  handleUserEnterEvents = (event) => {
    this.setState((prev) => ({
      followCustomerEnteredDetails: {
        remarks:
          event.target.name === "remarks"
            ? event.target.value
            : prev.followCustomerEnteredDetails.remarks,
        type:
          event.target.name === "type"
            ? event.target.value
            : prev.followCustomerEnteredDetails.type,
      },
    }));
  };

  handleDateSelection = (event) => {
    const selecteDate = event.target.value;

    const isDateValid = this.verifyDate(selecteDate);

    if (isDateValid) {
      this.handleBeforeAppLoadsApis(
        "customer-events",
        {
          PacketType: "GET-FOLLOW-BY-DATE",
          selectedDate: selecteDate,
        },
        this.state.Auth
      );
    } else {
      this.setState((prevDate) => ({
        // dateSelected: isDateValid ? selecteDate : prevDate.dateSelected,
        dateSelected: selecteDate,
        isDateWrong: !isDateValid,
      }));
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

  render() {
    const {
      TransactionDetails,
      openDialog,
      followCustomerEnteredDetails,
      followUpCustomers,
      dateSelected,
      isDateWrong,
    } = this.state;
    const columns =
      TransactionDetails.length > 0 ? Object.keys(TransactionDetails[0]) : "";

    const followupCustomersColumns =
      followUpCustomers.length > 0 ? Object.keys(followUpCustomers[0]) : "";

    const closeDailogue = () => this.closeDailogue();

    const handleUserEnterEvents = (e) => this.handleUserEnterEvents(e);
    const submitCustomerFollowup = () => this.submitCustomerFollowup();

    const handleDateSelection = (e) => this.handleDateSelection(e);

    return (
      <>
        <div className="follow-up-component">
          <h4 className="follow-up-content">Customers to follow-up</h4>
        </div>

        {TransactionDetails.length > 0 ? (
          <TableDataWithPagination
            tableType={"OPERATIONAL-TABLE"}
            handleClickEvent={(rowData) =>
              this.handleFollowupTableSelection(rowData)
            }
            tablecolumns={columns}
            tablerows={TransactionDetails}
          />
        ) : (
          <h4 className="follow-up-no-content"> No data found on TRANSACTION-DETAILS to follow-up</h4>
        )}


        <hr />

        <div className="follow-up-details">
          <div className="follow-up-component">
            <h4 className="follow-up-content">Follow-up customer Activity</h4>
          </div>

          <div className="mui-mobile-date-picker">
            <TextField
              label="select date to view followup"
              type="date"
              variant="standard"
              inputFormat="MM/DD/YYYY"
              error={isDateWrong}
              color="info"
              value={dateSelected}
              onChange={(e) => handleDateSelection(e)}
              helperText={isDateWrong ? "Please Choose Valid date" : ""}
              focused
              fullWidth
            />
          </div>

          {followUpCustomers.length > 0 ? (
            <TableDataWithPagination
              tableType={"NON-OPERATIONAL-TABLE"}
              // handleClickEvent={(rowData) =>
              //   this.handleFollowupTableSelection(rowData)
              // }
              tablecolumns={followupCustomersColumns}
              tablerows={followUpCustomers}
            />
          ) : (
            <h4 className="follow-up-no-content"> No data found on follow-up details for selected date</h4>
          )}
        </div>

        <Dialog
          open={openDialog}
          onClose={() => closeDailogue()}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Please Add Remarks to the customer"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              id="alert-dialog-description"
              sx={{ ml: 3, mr: 3, mt: 2, mb: 1 }}
            >
              <form action="">
                <div style={{ marginBottom: "8px" }}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Age</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="type"
                      // value={age}
                      value={followCustomerEnteredDetails.type}
                      label="Age"
                      // onChange={handleChange}
                      onChange={(e) => handleUserEnterEvents(e)}
                    >
                      {followupOperationTypes.map((value, index) => {
                        return (
                          <MenuItem value={value} key={index}>
                            {value}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </div>

                <div style={{ marginBottom: "8px" }}>
                  {" "}
                  <TextField
                    id="outlined-basic"
                    label="Outlined"
                    variant="outlined"
                    name="remarks"
                    value={followCustomerEnteredDetails.remarks}
                    onChange={(e) => handleUserEnterEvents(e)}
                    fullWidth
                  />
                </div>
              </form>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => closeDailogue()}>CANCEL</Button>
            <Button onClick={() => submitCustomerFollowup()} autoFocus>
              SUBMIT
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

export default classUseAuth(FollowupCustomers);
