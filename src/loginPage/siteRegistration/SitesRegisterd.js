import React, { Component } from "react";
import { classUseAuth } from "../../utils/Auth";
import {
  commonApiForGetConenction,
  commonApiForPostConenction,
} from "../../GlobalVariable/GlobalModule";
import LockerCatagoryTable from "../../settingsComponent/TableFunction/LockerCatagoryTable";
import StateWiseFormSelection from "../../GlobalVariable/StateWiseFormSelection";

class SiteRegistrationDetails extends Component {
  constructor(props) {
    super(props);
  }
  state = {
    siteData: {
      slno: [],
      area: [],
      areaCode: [],
      city: [],
      imeiNo: [],
      lattitute: [],
      longitude: [],
      mobileNo: [],
      no_of_locks: [],
      siteId: [],
      siteName: [],
      state: [],
      terminalId: [],
      userCreated: [],
      status: [],
      outletType: [],
    },
    Auth: "",
    stateName: "ALL_STATES",
  };

  componentDidMount() {
    const { auth } = this.props;
    if (auth) {
      this.handleApiRequest(auth, { packetType: "GET_SITES" });

      this.setState((prevState) => ({
        ...this.state.siteData,
        Auth: auth,
      }));
    } else {
      console.log("auth is null ");
    }
  }

  async handleApiRequest(auth, payload) {
    let Auth;
    if (auth == null || auth === undefined || auth === "") {
      Auth = auth;
    } else {
      Auth = this.state.Auth;
    }

    const result = await commonApiForPostConenction(
      "SiteRegOperations",
      payload,
      Auth.accessType
    );

    if (result) {
      console.log(result);

      if (result.response === 200) {
        // if request is ok

        this.setState((prevState) => ({
          siteData: {
            slno: result.slno,
            area: result.area,
            areaCode: result.areaCode,
            city: result.city,
            imeiNo: result.imei,
            lattitute: result.lattitude,
            longitude: result.longitude,
            mobileNo: result.mobileNo,
            no_of_locks: result.no_of_locks,
            siteId: result.siteId,
            siteName: result.siteName,
            state: result.state,
            terminalId: result.terminalId,
            userCreated: result.user,
            status: result.status,
            outletType: result.outlet,
          },
          Auth: prevState.Auth ? prevState.Auth : Auth,
          statename: payload.statename ? payload.statename : "ALL_STATES",
        }));
      } else if (result.response === 204) {
        // no content

        this.setState((prevState) => ({
          siteData: {
            slno: [],
            area: [],
            areaCode: [],
            city: [],
            imeiNo: [],
            lattitute: [],
            longitude: [],
            mobileNo: [],
            no_of_locks: [],
            siteId: [],
            siteName: [],
            state: [],
            terminalId: [],
            userCreated: [],
            status: [],
            outletType: [],
          },
          Auth: prevState.Auth ? prevState.Auth : Auth,
          statename: payload.statename ? payload.statename : "ALL_STATES",
        }));
      } else {
        // other responses

        this.setState((prevState) => ({
          siteData: {
            slno: [],
            area: [],
            areaCode: [],
            city: [],
            imeiNo: [],
            lattitute: [],
            longitude: [],
            mobileNo: [],
            no_of_locks: [],
            siteId: [],
            siteName: [],
            state: [],
            terminalId: [],
            userCreated: [],
            status: [],
            outletType: [],
          },
          Auth: prevState.Auth ? prevState.Auth : Auth,
          statename: payload.statename ? payload.statename : "ALL_STATES",
        }));
      }
    } else {
      alert("Server communcication error");
    }
  }

  handleStateName(stateName) {
    this.handleApiRequest("", {
      packetType: "STATE_WISE_SITE",
      statename: stateName,
    });
  }

  render() {
    const state = this.state;
    const { siteData } = this.state;
    const handleStateName = this.handleStateName;
    return (
      <>
        <h4 className="h4-style" style={{textAlign: 'center'}}>
          Terminal-Sitre Details for: {state.stateName}
        </h4>

        <StateWiseFormSelection
          onStateChangeCallback={(stateName) => handleStateName(stateName)}
        />

        {siteData.slno.length > 0 ? (
          <LockerCatagoryTable tableData={siteData} tableType={"SITE_TABLE"} />
        ) : (
          "Nothing to show from Site registration"
        )}
      </>
    );
  }
}

export default classUseAuth(SiteRegistrationDetails);
