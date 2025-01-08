import React, { useEffect } from "react";
import "./nxhyd2des.css";
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

const LULUHYDUGlayout = (props) => {
  const locksMapping = {
    allLocks: lockers.LULUHYDUG,
    seatNoA: ["S1", "QR", "M2", "M3"],
    seatNoB: ["S4", "S5", "M6", "M7"],
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

  // console.log(inProgressLocks);
  // console.log(isMalfunction);

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
      <div className="layout-table-container-nxhyd">
        <div className="first-column">
          {locksMapping.seatNoA.map((row, index) =>
            locksMapping.allLocks.indexOf(row) > -1 ? (
              <button
                className={`${
                  row.includes("S")
                    ? "small-lockers-align"
                    : row.includes("QR")
                    ? "qr-lockers-align"
                    : row.includes("XL")
                    ? "elarge-locks"
                    : row.includes("M")
                    ? "medium-lockers-align"
                    : row.includes("L")
                    ? "large-locks"
                    : null
                }
                                      ${"locker-common-des"}
                                      
                                       ${
                                         //  userSelectedLock === row
                                         row === "QR"
                                           ? "qr-lockers-align"
                                           : userSelectedLock.indexOf(row) > -1
                                           ? "selected"
                                           : inProgressLocks.indexOf(row) >
                                               -1 && isMalfunction
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
          {locksMapping.seatNoB.map((row, index) =>
            locksMapping.allLocks.indexOf(row) > -1 ? (
              <button
                className={`${
                  row.includes("S")
                    ? "small-lockers-align"
                    : row.includes("QR")
                    ? "qr-lockers-align"
                    : row.includes("XL")
                    ? "elarge-locks"
                    : row.includes("M")
                    ? "medium-lockers-align"
                    : row.includes("L")
                    ? "large-locks"
                    : null
                }
                                      ${"locker-common-des"}
                                      
                                       ${
                                         //  userSelectedLock === row
                                         userSelectedLock.indexOf(row) > -1
                                           ? "selected"
                                           : row === "QR"
                                           ? "qr-lockers-align"
                                           : inProgressLocks.indexOf(row) >
                                               -1 && isMalfunction
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

        {/* <div className="second-column">
              {locksMapping.seatNoC.map((row, index) =>
                locksMapping.allLocks.indexOf(row) > -1 ? (
                  <button
                    className={`${
                      row.includes("S")
                        ? "small-lockers-align"
                        : row.includes("QR")
                        ? "qr-lockers-align"
                        : row.includes("XL")
                        ? "elarge-locks"
                        : row.includes("M")
                        ? "medium-lockers-align"
                        : row.includes("L")
                        ? "large-locks"
                        : null
                    }
                                      ${"locker-common-des"}
                                      
                                       ${
                                         //  userSelectedLock === row
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
            </div> */}
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

export default LULUHYDUGlayout;
