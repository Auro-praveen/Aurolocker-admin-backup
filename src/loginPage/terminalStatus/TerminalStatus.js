import React, { useEffect, useState } from "react";
import LockerCatagoryTable from "../../settingsComponent/TableFunction/LockerCatagoryTable";
import RingLoader from "react-spinners/ClipLoader";
import "./TerminalStat.css";
import Backdrop from "@mui/material/Backdrop";
import PathUrl from "../../GlobalVariable/urlPath.json";
import CircularProgress from "@mui/material/CircularProgress";
import DashBoardOperationItems from "../../mainDashBoard/dashboardCards/DashBoardOperationItems";
import StateWiseFormSelection from "../../GlobalVariable/StateWiseFormSelection";
import { Button } from "@mui/material";
import { useAuth } from "../../utils/Auth";

function TerminalStatus() {
  const [deviceStatus, setDeviceStatus] = useState({
    terminalID: [],
    deviceDate: [],
    deviceTime: [],
    recievedDate: [],
    recievedTime: [],
    version: [],
    inetMode: [],
    // mobileNo:[],
    status: [],
  });

  const [stateName, setStateName] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const Auth = useAuth()

  // useEffect(() => {
  //   fetchDeviceHealth();
  // }, []);

  // const healthPacketUrl =
  //   "http://192.168.0.198:8080/AuroAutoLocker/FetchDeviceHealth";

  const fetchDeviceHealth = (stateN, packetType) => {
    const getStatus = {
      packetType: "healthPacket",
      stateName: stateN,
      type: packetType,
    };
    fetch(Auth.serverPaths.localAdminPath + "FetchDeviceHealth", {
      method: "POST",
      headers: {
        accept: "application/json",
      },
      body: JSON.stringify(getStatus),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data.packetType === "devhlth") {
          setDeviceStatus({
            ...deviceStatus,
            terminalID: data.terminalId,
            deviceDate: data.ddate,
            deviceTime: data.dtime,
            recievedDate: data.rdate,
            recievedTime: data.rtime,
            version: data.version,
            inetMode: data.inetMode,
            // mobileNo: data.mob_number,
            status: data.deviceStatus,
          });
        } else if (data.packetType === "nodevhlth") {
          setDeviceStatus({
            terminalID: [],
            deviceDate: [],
            deviceTime: [],
            recievedDate: [],
            recievedTime: [],
            version: [],
            inetMode: [],
            // mobileNo:[],
            status: [],
          });
        } else if (data.packetType === "INACTIVE-404") {
          alert("All Devices Are Active");

          setDeviceStatus({
            terminalID: [],
            deviceDate: [],
            deviceTime: [],
            recievedDate: [],
            recievedTime: [],
            version: [],
            inetMode: [],
            // mobileNo:[],
            status: [],
          });
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const handleStateName = (stateName) => {

    setIsLoading(false)
    if (stateName) {
      setStateName(stateName);

      fetchDeviceHealth(stateName, "ACTIVE");
    }

  };

  return (
    <div>
      <StateWiseFormSelection
        onStateChangeCallback={(stateName) => handleStateName(stateName)}
      />

      <div style={{ marginTop: 2, textAlign: 'center' }}>
        <Button
          color="error"
          variant="contained"
          onClick={() => fetchDeviceHealth(stateName, "INACTIVE")}
          sx={{
            m: "auto",
          }}
        >
          Inactive Devices
        </Button>
      </div>

      {deviceStatus.terminalID.length ? (
        <>
          <div className="page-header">
            <h2>terminal health status table</h2>
          </div>
          <LockerCatagoryTable
            tableData={deviceStatus}
            tableType={"deviceHealthStatus"}
          />
        </>
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
export default TerminalStatus;
