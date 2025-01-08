import { Button } from "@mui/material";
import React from "react";
import BlockCustomer from "./controlCustomerActivity/BlockCustomer";
import UnblockCustomer from "./controlCustomerActivity/UnblockCustomer";
import "./customerActivity.css";
import Navbar from "../../mainDashBoard/Navbar";

class CustomerControl extends React.Component {
  constructor(props) {
    super(props);
  }
  state = { blockCustomer: false, UnblockCustomer: true };

  handleUserSelection(type) {
    switch (type) {
      case "BLOCK":
        this.setState({
          blockCustomer: true,
          UnblockCustomer: false,
        });
        break;

      case "UNBLOCK":
        this.setState({
          blockCustomer: false,
          UnblockCustomer: true,
        });
        break;
    }
  }

  render() {
    const blockCust = this.state.blockCustomer;
    const viewCust = this.state.UnblockCustomer;

    return (
      <>
        <Navbar />
        <div className="customer-activity-container">
          Control Customer activity
          <div className="cust-activity-buttons-container">
            <Button
              variant="contained"
              color="success"
              onClick={() => this.handleUserSelection("BLOCK")}
              disabled={blockCust}
            >
              {" "}
              Block Customer{" "}
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => this.handleUserSelection("UNBLOCK")}
              disabled={viewCust}
            >
              {" "}
              Unblock/View Customer{" "}
            </Button>
          </div>
          {blockCust ? (
            <BlockCustomer />
          ) : viewCust ? (
            <UnblockCustomer />
          ) : "Nothing to show"}
        </div>
      </>
    );
  }
}

export default CustomerControl;
