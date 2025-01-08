import React, { useEffect } from "react";

import lockers from "../../GlobalVariable/lockers.json";
import Button from "@mui/material/Button";

import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useState } from "react";
import MuiAlert from "@mui/material/Alert";
import { Box, Snackbar } from "@mui/material";
import "./btnLayout.css";

const options = ["block", "unblock"];

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="standard" {...props} />;
});

const NXSNKNlayout = (props) => {
  const locksMapping = {
    allLocks: lockers.NXSNKN,
    seatNoA: ["S1", "S2", "M3", "M4"],
    seatNoB: ["S5", "S8"],
    seatNoC: ["QR"],
    seatNoD: ["M6", "M9"],
    seatNoE: ["M7", "M10"],
    seatNoF: ["L11", "L12", "L13", "L14", "L15"],
  };

  const [openBlockDailogue, setOpenBlockDailogue] = useState(false);
  const [openUnblockDailogue, setOpenUnblockDailogue] = useState(false);
  const [value, setValue] = useState("");

  const [state, setState] = useState({
    vertical: "top",
    horizontal: "center",
  });

  // useEffect(() => {
  //   setValue('')
  // }, [])

  const { vertical, horizontal } = state;
  const [malfunctionTypeSelected, setMalfunctionTypeSelected] = useState(false);

  const handleCancel = () => {
    setValue("");
    setOpenBlockDailogue(false);
    setOpenUnblockDailogue(false);
  };

  const handleOk = () => {
    if (value) {
      props.malfunctionTypeHandler(value);
      setOpenBlockDailogue(false);
      setOpenUnblockDailogue(false);
    } else {
      setMalfunctionTypeSelected(true);
    }
  };

  const hanleEvent = (e) => {
    setValue(e.target.value);
  };

  const isMalfunction = props.isMalfunction;
  const inProgressLocks = props.lockersInUse;
  // const userSelectedLock = props.userSelectedLock;

  const userSelectedLock =
    typeof props.userSelectedLock === "string"
      ? [props.userSelectedLock]
      : [...props.userSelectedLock];

  console.log(inProgressLocks);
  console.log(isMalfunction);

  const userSelectedLockFun = (row) => {
    if (row !== "QR") {
      setValue("");
      if (isMalfunction) {
        if (inProgressLocks.indexOf(row) > -1) {
          setOpenUnblockDailogue(true);
        } else {
          setOpenBlockDailogue(true);
        }
      }
      props.userSelectedLockHandler(row);
    }
  };

  return (
    <div className="grid-container">
      <div className="garuda-layout-container">
        <div className="first-column">
          {locksMapping.seatNoA.map((row, index) =>
            locksMapping.allLocks.indexOf(row) > -1 ? (
              <button
                className={`${
                  row.includes("S")
                    ? "small-locks"
                    : row.includes("M")
                    ? "medium-locks"
                    : row.includes("L")
                    ? "large-locks"
                    : null
                }
                      ${"locker-common-des"}
                      
                       ${
                         // userSelectedLock === row
                         userSelectedLock.indexOf(row) > -1
                           ? "selected"
                           : inProgressLocks.indexOf(row) > -1 && isMalfunction
                           ? "malfunction"
                           : inProgressLocks.indexOf(row) > -1
                           ? "unavailable"
                           : "available"
                       }`}
                key={index}
                onClick={() => userSelectedLockFun(row)}
              >
                {row}
              </button>
            ) : null
          )}
        </div>

        <div className="second-column">
          <div className="second-column-row">
            {locksMapping.seatNoB.map((row, index) =>
              locksMapping.allLocks.indexOf(row) > -1 ? (
                <button
                  className={`${
                    row.includes("S")
                      ? "small-locks"
                      : row.includes("M")
                      ? "medium-locks"
                      : row.includes("L")
                      ? "large-locks"
                      : null
                  }
                        ${"locker-common-des"}
                         ${
                           // userSelectedLock === row
                           userSelectedLock.indexOf(row) > -1
                             ? "selected"
                             : inProgressLocks.indexOf(row) > -1 &&
                               isMalfunction
                             ? "malfunction"
                             : inProgressLocks.indexOf(row) > -1
                             ? "unavailable"
                             : "available"
                         }`}
                  key={index}
                  onClick={() => userSelectedLockFun(row)}
                >
                  {row}
                </button>
              ) : null
            )}
          </div>

          <div className="second-column-row">
            {locksMapping.seatNoC.map((row, index) =>
              locksMapping.allLocks.indexOf(row) > -1 ? (
                <button
                  className={`${
                    row.includes("S")
                      ? "small-locks"
                      : row.includes("M")
                      ? "medium-locks"
                      : row.includes("L")
                      ? "large-locks"
                      : row.includes("QR")
                      ? "qr-container"
                      : null
                  }
                        ${"locker-common-des"}
                         ${
                           // userSelectedLock === row
                           userSelectedLock.indexOf(row) > -1
                             ? "selected"
                             : inProgressLocks.indexOf(row) > -1 &&
                               isMalfunction
                             ? "malfunction"
                             : inProgressLocks.indexOf(row) > -1
                             ? "unavailable"
                             : "available"
                         }`}
                  key={index}
                  onClick={() => userSelectedLockFun(row)}
                >
                  {row}
                </button>
              ) : null
            )}
          </div>

          <div className="second-column-row">
            {locksMapping.seatNoD.map((row, index) =>
              locksMapping.allLocks.indexOf(row) > -1 ? (
                <button
                  className={`${
                    row.includes("S")
                      ? "small-locks"
                      : row.includes("M")
                      ? "medium-locks"
                      : row.includes("L")
                      ? "large-locks"
                      : null
                  }
                        ${"locker-common-des"}
                         ${
                           // userSelectedLock === row
                           userSelectedLock.indexOf(row) > -1
                             ? "selected"
                             : inProgressLocks.indexOf(row) > -1 &&
                               isMalfunction
                             ? "malfunction"
                             : inProgressLocks.indexOf(row) > -1
                             ? "unavailable"
                             : "available"
                         }`}
                  key={index}
                  onClick={() => userSelectedLockFun(row)}
                >
                  {row}
                </button>
              ) : null
            )}
          </div>

          <div className="second-column-row">
            {locksMapping.seatNoE.map((row, index) =>
              locksMapping.allLocks.indexOf(row) > -1 ? (
                <button
                  className={`${
                    row.includes("S")
                      ? "small-locks"
                      : row.includes("M")
                      ? "medium-locks"
                      : row.includes("L")
                      ? "large-locks"
                      : null
                  }
                        ${"locker-common-des"}
                         ${
                           // userSelectedLock === row
                           userSelectedLock.indexOf(row) > -1
                             ? "selected"
                             : inProgressLocks.indexOf(row) > -1 &&
                               isMalfunction
                             ? "malfunction"
                             : inProgressLocks.indexOf(row) > -1
                             ? "unavailable"
                             : "available"
                         }`}
                  key={index}
                  onClick={() => userSelectedLockFun(row)}
                >
                  {row}
                </button>
              ) : null
            )}
          </div>
        </div>

        <div className="fourth-column">
          {locksMapping.seatNoF.map((row, index) =>
            locksMapping.allLocks.indexOf(row) > -1 ? (
              <button
                className={`${
                  row.includes("S")
                    ? "small-locks"
                    : row.includes("M")
                    ? "medium-locks"
                    : row.includes("L")
                    ? "large-locks"
                    : null
                }
                      ${"locker-common-des"}
                         ${
                           // userSelectedLock === row
                           userSelectedLock.indexOf(row) > -1
                             ? "selected"
                             : inProgressLocks.indexOf(row) > -1 &&
                               isMalfunction
                             ? "malfunction"
                             : inProgressLocks.indexOf(row) > -1
                             ? "unavailable"
                             : "available"
                         }`}
                key={index}
                onClick={() => userSelectedLockFun(row)}
              >
                {row}
              </button>
            ) : null
          )}
        </div>
      </div>

      <Box sx={{ width: "100%" }}>
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={malfunctionTypeSelected}
          autoHideDuration={6000}
          onClose={() => {
            setMalfunctionTypeSelected(false);
          }}
        >
          <Alert
            onClose={() => {
              setMalfunctionTypeSelected(false);
            }}
            severity="warning"
          >
            please Choose Locker Malfunction Type !!
          </Alert>
        </Snackbar>
      </Box>
      <Dialog
        sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
        maxWidth="xs"
        open={openBlockDailogue}
      >
        <DialogTitle>Locker Malfunction Type</DialogTitle>
        <DialogContent dividers>
          <RadioGroup
            aria-label="malfunction"
            name="malfunction status"
            value={value}
            onChange={(e) => hanleEvent(e)}
          >
            <FormControlLabel
              value="block"
              control={<Radio size="medium" />}
              label="Block"
            />
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => handleCancel()}>
            Cancel
          </Button>
          <Button onClick={() => handleOk()}>Ok</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
        maxWidth="xs"
        open={openUnblockDailogue}
      >
        <DialogTitle>Locker Malfunction Type</DialogTitle>
        <DialogContent dividers>
          <RadioGroup
            aria-label="malfunction"
            name="malfunction status"
            value={value}
            onChange={(e) => hanleEvent(e)}
          >
            <FormControlLabel
              value="unblock"
              control={<Radio size="medium" />}
              label="Unblock"
            />
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => handleCancel()}>
            Cancel
          </Button>
          <Button onClick={() => handleOk()}>Ok</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NXSNKNlayout;
