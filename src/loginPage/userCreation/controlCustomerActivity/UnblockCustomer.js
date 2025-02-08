import React from "react";
import {
  commonApiForPostConenction,
  storeUserLogs,
} from "../../../GlobalVariable/GlobalModule";
import LockerCatagoryTable from "../../../settingsComponent/TableFunction/LockerCatagoryTable";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PersonIcon from "@mui/icons-material/Person";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import Fade from "@mui/material/Fade";
import { Button, Divider } from "@mui/material";
import { classUseAuth } from "../../../utils/Auth";

class UnblockCustomer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isDataPresent: false,
      blockedUserData: {
        slno: [],
        name: [],
        mobileNo: [],
        reason: [],
        dateOfBlocking: [],
        dateOfUnblocking: [],
        city: [],
        status: [],
      },
      anchorEl: null,
      selectedCustomerDetails: {
        slno: "",
        name: "",
        mobileNo: "",
        status: "",
      },
    };

    this.closeAnchorELMethod = this.closeAnchorELMethod.bind(this);
    this.OpenAchorElMethod = this.OpenAchorElMethod.bind(this);
    this.blockUserHandlerMethod = this.blockUserHandlerMethod.bind(this);
  }

  componentDidMount() {
    this.getBlockedCustomerData();
  }

  getBlockedCustomerData = async () => {
    const { auth } = this.props;
    console.log("------------inside unblock --------------------");

    console.log(auth);

    const restult = await commonApiForPostConenction(
      "fetchBlockedCustomers",
      {
        packetType: "GETBLOCKEDCUST",
      },
      auth.accessAppType
    )
      .then((data) => {
        console.log(data);

        return data;
      })
      .catch((err) => console.log("err : " + err));

    if (restult) {
      if (restult.status === "ACTIVE-200") {
        this.setState({
          isDataPresent: true,
          blockedUserData: {
            slno: restult.slno,
            name: restult.name,
            mobileNo: restult.mobileNo,
            reason: restult.reason,
            dateOfBlocking: restult.dateofblock,
            dateOfUnblocking: restult.dateofunblock,
            city: restult.city,
            status: restult.custStatus,
          },
        });
      } else if (restult.status === "INACTIVE-200") {
        this.setState({
          isDataPresent: false,
          blockedUserData: {
            slno: [],
            name: [],
            mobileNo: [],
            reason: [],
            dateOfUnblocking: [],
            dateOfBlocking: [],
            city: [],
            status: [],
          },
        });
      }
    } else {
      alert("server communication error, try again later");
      this.setState({
        isDataPresent: false,
        blockedUserData: {
          slno: [],
          name: [],
          mobileNo: [],
          reason: [],
          dateOfUnblocking: [],
          dateOfBlocking: [],
          city: [],
          status: [],
        },
      });
    }
  };

  blockUserHandlerMethod = (slno, name, mobileNo, status, event) => {
    this.setState({
      selectedCustomerDetails: {
        slno: slno,
        mobileNo: mobileNo,
        name: name,
        status: status,
      },
      anchorEl: event.currentTarget,
    });

    console.log(event.currentTarget);
  };

  customerBlockHandler = async (type) => {
    switch (type) {
      case "BLOCK":
        // call server to handle requests here

        if (this.state.selectedCustomerDetails.status === "BLOCKED") {
          alert("User is already Blocked!");
          this.closeAnchorELMethod();
        } else {
          const payload = {
            packetType: "BLOCKEXISTINGUSER",
            ...this.state.selectedCustomerDetails,
          };

          const result = await this.serverCommuncation(payload);
          if (result) {
            alert("Customer Blocked Successfully");
            this.closeAnchorELMethod();
            this.getBlockedCustomerData();
          } else {
            alert("something went wrong");
            this.closeAnchorELMethod();
          }
        }

        break;

      case "UNBLOCK":
        // call server to handle requests here

        if (this.state.selectedCustomerDetails.status === "UNBLOCKED") {
          alert("User already Unblocked!");
          this.closeAnchorELMethod();
        } else {
          const payload2 = {
            packetType: "UNBLOCKCUST",
            ...this.state.selectedCustomerDetails,
          };

          const result2 = await this.serverCommuncation(payload2);
          if (result2) {
            alert("Customer Unblocked Successfully");
            this.closeAnchorELMethod();
            this.getBlockedCustomerData();
          } else {
            alert("something went wrong");
            this.closeAnchorELMethod();
          }
        }

        break;
    }
  };

  serverCommuncation = async (payload) => {
    const { auth } = this.props;
    const result = await commonApiForPostConenction(
      "fetchBlockedCustomers",
      {
        ...payload,
      },
      auth.accessAppType
    )
      .then((data) => {
        console.log(data);
        return data;
      })
      .catch((err) => console.log("err : " + err));

    if (result) {
      if (result.status === "UNBLOCK-200") {
        const logObj = {
          eventType: "UNBLOCK-CUSTOMER",
          remarks: `customer with mob: ${payload.mobileNo} has been unblocked`,
          username: auth.user,
        };

        storeUserLogs(logObj);
        return true;
      } else if (result.status === "UNBLOCK-404") {
        const logObj = {
          eventType: "UNBLOCK-CUSTOMER",
          remarks: `customer with mob: ${payload.mobileNo} has been blocked`,
          username: auth.user,
        };

        storeUserLogs(logObj);
        return false;
      } else if (result.status === "BLOCKUPDATE-200") {
        const logObj = {
          eventType: "BLOCK-CUST-AGAIN",
          remarks: `customer with mob: ${payload.mobileNo} has been blocked again`,
          username: auth.user,
        };

        storeUserLogs(logObj);
        return true;
      } else if (result.status === "BLOCKUPDATE-404") {
        return false;
      }
    } else {
      alert("server communication Error, try later");
      return false;
    }
  };

  closeAnchorELMethod() {
    this.setState({
      anchorEl: null,
    });
  }

  OpenAchorElMethod(event) {
    this.setState({
      anchorEl: event.currentTarget,
    });
  }

  render() {
    const { isDataPresent, blockedUserData, anchorEl } = this.state;
    const closeAnchorELMethod = this.closeAnchorELMethod;
    const openAnchorEl = Boolean(anchorEl);

    // console.log(anchorEl);

    return (
      <>
        <div className="useractivity-handler">
          <div className="page-header">
            <h2 className="page-title">Customers blocked by tuckit.in</h2>
          </div>

          {isDataPresent ? (
            <LockerCatagoryTable
              tableData={blockedUserData}
              blockUSerHandler={this.blockUserHandlerMethod.bind(this)}
              tableType={"blockedCustomers"}
            />
          ) : (
            "No Data Present"
          )}
        </div>

        <Menu
          id="fade-menu"
          MenuListProps={{
            "aria-labelledby": "fade-button",
          }}
          anchorEl={anchorEl}
          open={openAnchorEl}
          onClose={closeAnchorELMethod}
          TransitionComponent={Fade}
        >
          <MenuItem onClick={() => this.customerBlockHandler("BLOCK")}>
            <PersonIcon />
            &nbsp; &nbsp; Block
          </MenuItem>
          <Divider sx={{ my: 2 }} />
          <MenuItem onClick={() => this.customerBlockHandler("UNBLOCK")}>
            <PersonOffIcon />
            &nbsp; &nbsp; Unblock
          </MenuItem>
        </Menu>
      </>
    );
  }
}

export default classUseAuth(UnblockCustomer);
