import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import urlPath from "../GlobalVariable/urlPath.json";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  NativeSelect,
} from "@mui/material";
import ORNLayout from "../lockerOperations/layoutsAccorsingTerminalId/ORNLayout";
import GALLayout from "../lockerOperations/layoutsAccorsingTerminalId/GALLayout";
import FalconUptownLulub2Layout from "../lockerOperations/layoutsAccorsingTerminalId/FalconUptownLulub2Layout";
import NexusLayout from "../lockerOperations/layoutsAccorsingTerminalId/NexusLayout";
import GarudaLayout from "../lockerOperations/layoutsAccorsingTerminalId/GarudaLayout";
import NXSNKNlayout from "../lockerOperations/layoutsAccorsingTerminalId/NXSNKNlayout";
import NXSNKNlayoutUpdate from "../lockerOperations/layoutsAccorsingTerminalId/NXSNKNlayoutUpdate";
import NexusHyd2Layout from "../lockerOperations/layoutsAccorsingTerminalId/NexusHyd2Layout";
import MMBLR1Layout from "../lockerOperations/layoutsAccorsingTerminalId/MMBLR1Layout";
import ORN2Layout from "../lockerOperations/layoutsAccorsingTerminalId/ORN2Layout";
import PMCBB1Layout from "../lockerOperations/layoutsAccorsingTerminalId/PMCBB1Layout";
import PMCCNGFLayout from "../lockerOperations/layoutsAccorsingTerminalId/PMCCNGFLayout";
import NXPAVMZLayout from "../lockerOperations/layoutsAccorsingTerminalId/NXPAVMZLayout";
import NXPAVMZupdatedLayout from "../lockerOperations/layoutsAccorsingTerminalId/NXPAVMZupdatedLayout";
import PMCCNBLLayout from "../lockerOperations/layoutsAccorsingTerminalId/PMCCNBLLayout";
import NXSWB1Layout from "../lockerOperations/layoutsAccorsingTerminalId/NXSWB1Layout";
import HLCALIGFlayout from "../lockerOperations/layoutsAccorsingTerminalId/HLCALIGFlayout";
import FMCALIGFlayout from "../lockerOperations/layoutsAccorsingTerminalId/FMCALIGFlayout";
import MOAEAST1layout from "../lockerOperations/layoutsAccorsingTerminalId/MOAEAST1layout";
import MOAWEST2layout from "../lockerOperations/layoutsAccorsingTerminalId/MOAWEST2layout";
import MOALUXLLlayout from "../lockerOperations/layoutsAccorsingTerminalId/MOALUXLLlayout";
import MOAEDENB1layout from "../lockerOperations/layoutsAccorsingTerminalId/MOAEDENB1layout";
import MMBLR3Layout from "../lockerOperations/layoutsAccorsingTerminalId/MMBLR3Layout";
import NXSNKNB1layout from "../lockerOperations/layoutsAccorsingTerminalId/NXSNKNB1layout";

import { commonApiForPostConenction } from "../GlobalVariable/GlobalModule";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import NXVCNB1layout from "../lockerOperations/layoutsAccorsingTerminalId/NXVCNB1layout";
import NXVCJNRMlayout from "../lockerOperations/layoutsAccorsingTerminalId/NXVCJNRMlayout";
import AHCEBGFlayout from "../lockerOperations/layoutsAccorsingTerminalId/AHCEBGFlayout";
import AHCEB2Flayout from "../lockerOperations/layoutsAccorsingTerminalId/AHCEB2Flayout";
import LULUHYDUGlayout from "../lockerOperations/layoutsAccorsingTerminalId/LULUHYDUGlayout";
import CommonLayoutForAll from "../lockerOperations/layoutsAccorsingTerminalId/CommonLayoutForAll";

const MallAuthActive = (props) => {
  const [siteDetails, setSiteDetails] = useState({
    siteName: "",
    siteLocation: "",
  });

  const [terminalIds, setTerminalIds] = useState([]);

  const [activeLockers, setActiveLockers] = useState([]);
  const [singleTerminalId, setSingleTerminalId] = useState("");

  const [areAnyActiveLocks, setAreAnyActiveLocks] = useState(false);
  const [areMoreTerminalIdThere, setAreMoreTerminalIdThere] = useState(false);
  const [isTerminalPresent, setIsTerminalPresent] = useState(false);
  const [totActiveLocks, setTotActiveLocks] = useState(0);

  const [isLayoutVisible, setIsLayoutVisible] = useState(false);

  const [openStatusDailogue, setOpenStatusDailogue] = useState(false);
  const [terminalStatusObj, setTerminalStatusObj] = useState([]);
  const [siteNameStr, setSiteNameStr] = useState("");

  useEffect(() => {
    console.log(props);
    setSiteDetails({
      siteName: props.siteName,
      siteLocation: props.siteLocation,
    });
    setSiteNameStr(props.siteName.substring(2, props.siteName.length - 2));
    serverCommunicateFun("get-td", props.siteName, props.siteLocation);
  }, []);

  const serverCommunicateFun = (packet, siteName, siteLoc) => {
    let requestObj;
    if (packet === "getactlocks") {
      requestObj = {
        PacketType: packet,
        terminalId: siteName,
      };
    } else {
      requestObj = {
        PacketType: packet,
        siteName: siteName,
        siteLocation: siteLoc,
      };
    }

    console.log(requestObj);
    fetch(urlPath.localServerPath + "FetchActiveTransactionMallAuth", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify(requestObj),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data.responseCode === "tid-202") {
          // more than 1 terminal id's are present for the provided site name and site location
          setTerminalIds([...data.termIdArr]);
          setAreMoreTerminalIdThere(true);
          setIsTerminalPresent(false);
          setAreAnyActiveLocks(false);
          setIsLayoutVisible(true);
          alert("there are more than 1 terminal id");
        } else if (data.responseCode === "tid-200") {
          // only single terminal id is present so directly push the single layout
          if (data.actLocks === "status-200") {
            setTotActiveLocks(data.allLocks.length);
            setActiveLockers([...data.allLocks]);
            setSingleTerminalId(data.terminalId);
            setIsTerminalPresent(true);
            setAreAnyActiveLocks(true);
          } else if (data.actLocks === "status-404") {
            setIsTerminalPresent(true);
            setAreAnyActiveLocks(false);
            alert("No active locks at the moment");
          }
          setIsLayoutVisible(true);
          setAreMoreTerminalIdThere(false);
        } else if (data.responseCode === "acttid-200") {
          // active bookings on selecting a terminal id for multiple terminal id

          // praveen changed here nov 16-11-2023

          setTotActiveLocks(data.actlocks.length);
          setActiveLockers([...data.actlocks]);

          setAreMoreTerminalIdThere(true);
          setIsTerminalPresent(false);
          setAreAnyActiveLocks(false);
          setIsLayoutVisible(true);
        } else if (data.responseCode === "acttid-404") {
          // no bookings found on selecting a terminal id from multiple terminalId

          // Praveen changed here nov 16-11-2023

          setTotActiveLocks(0);
          setActiveLockers([]);

          setAreMoreTerminalIdThere(true);
          setIsTerminalPresent(false);
          setAreAnyActiveLocks(false);
          setIsLayoutVisible(true);
        } else if (data.responseCode === "tid-404") {
          // no terminalId found for the specified site name or site location
          setAreMoreTerminalIdThere(false);
          setIsTerminalPresent(false);
          setIsLayoutVisible(false);
          setAreAnyActiveLocks(false);
          alert(
            "No terminal id from the selected site Location please check with the admin"
          );
        }
      })
      .catch((err) => {
        console.log("error : " + err);
      });
  };

  const chooseTerminalID = (e) => {
    setSingleTerminalId(e.target.value);
    serverCommunicateFun("getactlocks", e.target.value, "");
  };

  const userSelectedLockFun = (lock) => {};

  console.log(terminalStatusObj.length > 0);

  const verifyTerminalLockerStatus = async (terminalName) => {
    // alert(terminalName)

    const payloadObj = {
      PacketType: "TERMINAL-STATUS",
      siteName: terminalName,
    };

    console.log(payloadObj);

    await commonApiForPostConenction("MallAuthorityOperations", payloadObj, "MALL_LOCKERS")
      .then((data) => {
        console.log(data);

        if (data.responseCode === 200) {
          setOpenStatusDailogue(true);
          setTerminalStatusObj([...data.terminalHealth]);
        } else {
          alert("No TerminalIDs Found");
        }
      })
      .catch((e) => {
        alert("Something Went Wrong");
        console.log("Error : " + e);
      });
  };

  return (
    <div className="mall-auth-item-container">
      <Dialog
        open={openStatusDailogue}
        onClose={() => setOpenStatusDailogue(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Device Status For Terminal Location : " + siteDetails.siteName}
        </DialogTitle>
        <DialogContent>
          {/* <DialogContentText id="alert-dialog-description"> */}
          <div>
            <hr />
            {terminalStatusObj.length > 0
              ? terminalStatusObj.map((deviceObj, id) => (
                  <h6 key={id}>
                    {" "}
                    Terminal Id : {deviceObj.terminalId + " "} , Status :{" "}
                    {deviceObj.status + " "}, inet Mode : {deviceObj.inet_mode}{" "}
                  </h6>
                ))
              : "No TerminalIds Found"}
          </div>
          {/* </DialogContentText> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStatusDailogue(false)}>CLOSE</Button>
        </DialogActions>
      </Dialog>

      <div className="mall-auth-title">
        {areMoreTerminalIdThere ? (
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
                  value={singleTerminalId}
                  onChange={(e) => chooseTerminalID(e)}
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
            {/* <div>
              {" "}
              Active Locker Layout For The TerminalID = {singleTerminalId}{" "}
            </div> */}
          </div>
        ) : areAnyActiveLocks ? (
          <div>
            {" "}
            Active Locker Layout For The TerminalID ={" "}
            <b style={{ color: "crimson" }}>{singleTerminalId}</b>{" "}
          </div>
        ) : isTerminalPresent ? (
          <div> No Bookings Are Active At The Moment</div>
        ) : (
          <div> no terminal id found. please contact the admin </div>
        )}
      </div>

      {siteNameStr.includes("Mall of Asia Bangalore") && (
        <div style={{ marginBottom: 20 }}>
          <Button
            color="secondary"
            variant="outlined"
            onClick={() => verifyTerminalLockerStatus(siteNameStr)}
          >
            Check Terminal Status
          </Button>
        </div>
      )}

      {isLayoutVisible ? (
        <div>
          {" "}
          {singleTerminalId === "ORN" ? (
            <>
              <ORNLayout
                isMalfunction={false}
                lockersInUse={activeLockers}
                userSelectedLock={""}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
            </>
          ) : singleTerminalId === "PSITPL" ? (
            <>
              <GALLayout
                isMalfunction={false}
                lockersInUse={activeLockers}
                userSelectedLock={""}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
            </>
          ) : singleTerminalId === "FALCON" ||
            singleTerminalId === "UPTOWN" ||
            singleTerminalId === "LULUB2" ||
            singleTerminalId === "NXWFLD" ||
            singleTerminalId === "NXHYD1" ||
            singleTerminalId === "GGCALILG" ||
            singleTerminalId === "HLCALIB2" ||
            singleTerminalId === "ORN1" ||
            singleTerminalId === "MJMJPN" ||
            singleTerminalId === "ORNUTUB" ||
            singleTerminalId === "LULUB1" ? (
            <>
              <FalconUptownLulub2Layout
                isMalfunction={false}
                lockersInUse={activeLockers}
                userSelectedLock={""}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
            </>
          ) : singleTerminalId === "NXFIZA" ||
            singleTerminalId === "NCCMYS" ||
            singleTerminalId === "GAL" ? (
            <>
              <NXSNKNlayout
                isMalfunction={false}
                lockersInUse={activeLockers}
                userSelectedLock={""}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
            </>
          ) : singleTerminalId === "NEXUS" ? (
            <>
              <NexusLayout
                isMalfunction={false}
                lockersInUse={activeLockers}
                userSelectedLock={""}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
            </>
          ) : singleTerminalId === "GARUDA" ? (
            <>
              <GarudaLayout
                isMalfunction={false}
                lockersInUse={activeLockers}
                userSelectedLock={""}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
            </>
          ) : singleTerminalId === "MMBLR3" ||
            singleTerminalId === "NXSNKNLG" ? (
            <>
              <MMBLR3Layout
                isMalfunction={false}
                lockersInUse={activeLockers}
                userSelectedLock={""}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
            </>
          ) : singleTerminalId === "NXSNKNB1" ? (
            <>
              <NXSNKNB1layout
                isMalfunction={false}
                lockersInUse={activeLockers}
                userSelectedLock={""}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
            </>
          ) : singleTerminalId === "NXSNKN" ? (
            <>
              <NXSNKNlayoutUpdate
                isMalfunction={false}
                lockersInUse={activeLockers}
                userSelectedLock={""}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
            </>
          ) : singleTerminalId === "NXHYD2" ? (
            <>
              <NexusHyd2Layout
                isMalfunction={false}
                lockersInUse={activeLockers}
                userSelectedLock={""}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
            </>
          ) : singleTerminalId === "PMCBB1" ||
            singleTerminalId === "VEGCITB1" ? (
            <>
              <PMCBB1Layout
                isMalfunction={false}
                lockersInUse={activeLockers}
                userSelectedLock={""}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
            </>
          ) : singleTerminalId === "ORN2" ? (
            <>
              <ORN2Layout
                isMalfunction={false}
                lockersInUse={activeLockers}
                userSelectedLock={""}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
            </>
          ) : singleTerminalId === "PMCCNGF" ||
            singleTerminalId === "MOALPE" ||
            singleTerminalId === "NXWESTG2" ? (
            <>
              <PMCCNGFLayout
                isMalfunction={false}
                lockersInUse={activeLockers}
                userSelectedLock={""}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
            </>
          ) : singleTerminalId === "NXPAVMZ" ? (
            <>
              <NXPAVMZupdatedLayout
                isMalfunction={false}
                lockersInUse={activeLockers}
                userSelectedLock={""}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
            </>
          ) : singleTerminalId === "NXSWLG" ? (
            <>
              <NXPAVMZLayout
                isMalfunction={false}
                lockersInUse={activeLockers}
                userSelectedLock={""}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
            </>
          ) : singleTerminalId === "NXSWB1" ? (
            <>
              <NXSWB1Layout
                isMalfunction={false}
                lockersInUse={activeLockers}
                userSelectedLock={""}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
            </>
          ) : singleTerminalId === "PMCCNBL" ||
            singleTerminalId === "NXWESTUB" ||
            singleTerminalId === "ELPROCST" ||
            singleTerminalId === "ELPROCSL" ||
            singleTerminalId === "NXSWUG" ||
            singleTerminalId === "NXSW2F" ? (
            <>
              <PMCCNBLLayout
                isMalfunction={false}
                lockersInUse={activeLockers}
                userSelectedLock={""}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
            </>
          ) : singleTerminalId === "MMBLR1" ||
            singleTerminalId === "FORUMKOLG" ||
            singleTerminalId === "MMBLR2" ||
            singleTerminalId === "NXVIJM" ? (
            <>
              <MMBLR1Layout
                isMalfunction={false}
                lockersInUse={activeLockers}
                userSelectedLock={""}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
            </>
          ) : singleTerminalId === "MOAEDENB1" ? (
            <>
              <MOAEDENB1layout
                isMalfunction={false}
                lockersInUse={activeLockers}
                userSelectedLock={""}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
            </>
          ) : singleTerminalId === "MOALUXLL" ||
            singleTerminalId === "MOAWEST1" ? (
            <>
              <MOALUXLLlayout
                isMalfunction={false}
                lockersInUse={activeLockers}
                userSelectedLock={""}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
            </>
          ) : singleTerminalId === "MOAWEST2" ||
            singleTerminalId === "LULUHYDLG" ? (
            <>
              <MOAWEST2layout
                isMalfunction={false}
                lockersInUse={activeLockers}
                userSelectedLock={""}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
            </>
          ) : singleTerminalId === "MOAEAST1" ? (
            <>
              <MOAEAST1layout
                isMalfunction={false}
                lockersInUse={activeLockers}
                userSelectedLock={""}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
            </>
          ) : singleTerminalId === "FMCALIGF" ? (
            <>
              <FMCALIGFlayout
                isMalfunction={false}
                lockersInUse={activeLockers}
                userSelectedLock={""}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
            </>
          ) : singleTerminalId === "HLCALIGF" ? (
            <>
              <HLCALIGFlayout
                isMalfunction={false}
                lockersInUse={activeLockers}
                userSelectedLock={""}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
            </>
          ) : singleTerminalId === "NXVCNB1" ? (
            <>
              <NXVCNB1layout
                isMalfunction={false}
                lockersInUse={activeLockers}
                userSelectedLock={""}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
            </>
          ) : singleTerminalId === "NXVCJNRM" ||
            singleTerminalId === "NXVCARCR" ? (
            <>
              <NXVCJNRMlayout
                isMalfunction={false}
                lockersInUse={activeLockers}
                userSelectedLock={""}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
            </>
          ) : singleTerminalId === "AHCEBGF" ? (
            <>
              <AHCEBGFlayout
                isMalfunction={false}
                lockersInUse={activeLockers}
                userSelectedLock={""}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
            </>
          ) : singleTerminalId === "AHCEB2F" ? (
            <>
              <AHCEB2Flayout
                isMalfunction={false}
                lockersInUse={activeLockers}
                userSelectedLock={""}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
            </>
          ) : singleTerminalId === "LULUHYDUG" ? (
            <>
              <LULUHYDUGlayout
                isMalfunction={false}
                lockersInUse={activeLockers}
                userSelectedLock={""}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
            </>
          ) : (
            <>
              <CommonLayoutForAll
                terminalID={singleTerminalId}
                isMalfunction={false}
                lockersInUse={activeLockers}
                userSelectedLock={""}
                userSelectedLockHandler={userSelectedLockFun.bind(this)}
              />
            </>
          )}
          <div
            style={{
              marginTop: "20px",
            }}
          >
            {" "}
            Total Active Lockers ={" "}
            <b style={{ color: "crimson" }}>{totActiveLocks}</b>{" "}
          </div>
        </div>
      ) : (
        <h4>No layout found</h4>
      )}
    </div>
  );
};

export default MallAuthActive;
