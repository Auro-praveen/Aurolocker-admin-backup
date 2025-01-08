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

const options = ["block", "unblock"];

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="standard" {...props} />;
});

const ORNLayout = (props) => {
  const locksMapping = {
    allLocks: lockers.ORN,
    seatNoA: ["S1", "S5", "S9", "S12", "L15", "L19"],
    seatNoB: ["S2", "S6", "QR", "L16", "L20"],
    seatNoC: ["M3", "M7", "L17", "L21"],
    seatNoD: ["S10", "S13", "XL18", "XL22"],
    seatNoE: ["M4", "M8", "M11", "M14"],
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

  const userSelectedLock =
    typeof props.userSelectedLock === "string"
      ? [props.userSelectedLock]
      : [...props.userSelectedLock];

  // console.log(typeof props.userSelectedLock);
  // console.log(props.userSelectedLock);
  // console.log(inProgressLocks);
  // console.log(isMalfunction);

  console.log("------------=============-----------");
  console.log(userSelectedLock);

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
    <>
      <div className="layout-container">
        <table className="table table-responsive grid">
          <tbody>
            <tr>
              {locksMapping.seatNoA.map((row, index) =>
                locksMapping.allLocks.indexOf(row) > -1 ? (
                  <td
                    rowSpan={
                      row.includes("M") || row.includes("QR")
                        ? 2
                        : row.includes("XL")
                        ? 3
                        : 1
                    }
                    colSpan={
                      row.includes("L") ||
                      row.includes("XL") ||
                      row.includes("QR")
                        ? 2
                        : 1
                    }
                    className={
                      row.includes("QR")
                        ? "qr-scanner"
                        : // : userSelectedLock === row
                        userSelectedLock.indexOf(row) > -1
                        ? "selected"
                        : inProgressLocks.indexOf(row) > -1 && isMalfunction
                        ? "malfunction"
                        : inProgressLocks.indexOf(row) > -1
                        ? "unavailable"
                        : "available"
                    }
                    onClick={() => userSelectedLockFun(row)}
                    key={index}
                  >
                    {row}
                  </td>
                ) : null
              )}
            </tr>

            <tr>
              {locksMapping.seatNoB.map((row, index) =>
                locksMapping.allLocks.indexOf(row) > -1 ? (
                  <td
                    rowSpan={
                      row.includes("M") || row.includes("QR")
                        ? 2
                        : row.includes("XL")
                        ? 3
                        : 1
                    }
                    colSpan={
                      row.includes("L") ||
                      row.includes("XL") ||
                      row.includes("QR")
                        ? 2
                        : 1
                    }
                    className={
                      row.includes("QR")
                        ? "qr-scanner"
                        : // : userSelectedLock === row
                        userSelectedLock.indexOf(row) > -1
                        ? "selected"
                        : inProgressLocks.indexOf(row) > -1 && isMalfunction
                        ? "malfunction"
                        : inProgressLocks.indexOf(row) > -1
                        ? "unavailable"
                        : "available"
                    }
                    onClick={() => userSelectedLockFun(row)}
                    key={index}
                  >
                    {row}
                  </td>
                ) : null
              )}
            </tr>

            <tr>
              {locksMapping.seatNoC.map((row, index) =>
                locksMapping.allLocks.indexOf(row) > -1 ? (
                  <td
                    rowSpan={
                      row.includes("M") || row.includes("QR")
                        ? 2
                        : row.includes("XL")
                        ? 3
                        : 1
                    }
                    colSpan={
                      row.includes("L") ||
                      row.includes("XL") ||
                      row.includes("QR")
                        ? 2
                        : 1
                    }
                    className={
                      row.includes("QR")
                        ? "qr-scanner"
                        : // : userSelectedLock === row
                        userSelectedLock.indexOf(row) > -1
                        ? "selected"
                        : inProgressLocks.indexOf(row) > -1 && isMalfunction
                        ? "malfunction"
                        : inProgressLocks.indexOf(row) > -1
                        ? "unavailable"
                        : "available"
                    }
                    onClick={() => userSelectedLockFun(row)}
                    key={index}
                  >
                    {row}
                  </td>
                ) : null
              )}
            </tr>

            <tr>
              {locksMapping.seatNoD.map((row, index) =>
                locksMapping.allLocks.indexOf(row) > -1 ? (
                  <td
                    rowSpan={
                      row.includes("M") || row.includes("QR")
                        ? 2
                        : row.includes("XL")
                        ? 3
                        : 1
                    }
                    colSpan={
                      row.includes("L") ||
                      row.includes("XL") ||
                      row.includes("QR")
                        ? 2
                        : 1
                    }
                    className={
                      row.includes("QR")
                        ? "qr-scanner"
                        : // : userSelectedLock === row
                        userSelectedLock.indexOf(row) > -1
                        ? "selected"
                        : inProgressLocks.indexOf(row) > -1 && isMalfunction
                        ? "malfunction"
                        : inProgressLocks.indexOf(row) > -1
                        ? "unavailable"
                        : "available"
                    }
                    onClick={() => userSelectedLockFun(row)}
                    key={index}
                  >
                    {row}
                  </td>
                ) : null
              )}
            </tr>

            <tr>
              {locksMapping.seatNoE.map((row, index) =>
                locksMapping.allLocks.indexOf(row) > -1 ? (
                  <td
                    rowSpan={
                      row.includes("M") || row.includes("QR")
                        ? 2
                        : row.includes("XL")
                        ? 3
                        : 1
                    }
                    colSpan={
                      row.includes("L") ||
                      row.includes("XL") ||
                      row.includes("QR")
                        ? 2
                        : 1
                    }
                    className={
                      row.includes("QR")
                        ? "qr-scanner"
                        : // : userSelectedLock === row
                        userSelectedLock.indexOf(row) > -1
                        ? "selected"
                        : inProgressLocks.indexOf(row) > -1 && isMalfunction
                        ? "malfunction"
                        : inProgressLocks.indexOf(row) > -1
                        ? "unavailable"
                        : "available"
                    }
                    onClick={() => userSelectedLockFun(row)}
                    key={index}
                  >
                    {row}
                  </td>
                ) : null
              )}
            </tr>
          </tbody>
        </table>
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
    </>
  );
};

export default ORNLayout;
