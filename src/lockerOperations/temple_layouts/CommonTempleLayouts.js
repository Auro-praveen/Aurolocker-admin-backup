import lockers from "../../GlobalVariable/lockers.json";
import Button from "@mui/material/Button";

import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useEffect, useState } from "react";
import MuiAlert from "@mui/material/Alert";
import { Alert, Box, Snackbar } from "@mui/material";
// import LayoutsConfig from "./LayoutsConfig";
import TempleLayoutConfig from "./TempleLayoutConfig";

const CommonTempleLayouts = (props) => {
  const locksMapping = {
    allLocks: lockers.LULU,
    seatNoA: ["M1", "S2", "S3", "S4", "S5", "M6"],
    seatNoB: ["S7", "S8", "S9", "S10"],
    seatNoC: ["M11", "M12", "QR", "M15", "M16"],
    seatNoD: ["S13", "S14"],
    seatNoE: ["M17", "M18", "M19", "M20", "M21", "M22"],
  };

  const [terminalID, setTerminalID] = useState();

  const [openBlockDailogue, setOpenBlockDailogue] = useState(false);
  const [openUnblockDailogue, setOpenUnblockDailogue] = useState(false);
  const [value, setValue] = useState("");

  const [state, setState] = useState({
    vertical: "top",
    horizontal: "center",
  });

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
      setValue("");
      setOpenBlockDailogue(false);
      setOpenUnblockDailogue(false);
    } else {
      setMalfunctionTypeSelected(true);
    }
  };

  //   useEffect(() => {
  //     console.log("praveenenenenenenene");
  //   }, []);

  useEffect(() => {
    setTerminalID(props.terminalID);
    console.log(props.terminalID);
  }, [props.terminalID]);

  const hanleEvent = (e) => {
    setValue(e.target.value);
  };

  const isMalfunction = props.isMalfunction;
  const inProgressLocks = props.lockersInUse;
  // const inProgressLocks = ["M1", "S2", "S3"]
  // const userSelectedLock = props.userSelectedLock;
  const userSelectedLock =
    typeof props.userSelectedLock === "string"
      ? [props.userSelectedLock]
      : [...props.userSelectedLock];

  // console.log(inProgressLocks);
  // console.log(isMalfunction);

  const userSelectedLockFun = (row) => {
    if (row !== "QR") {
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
    <div>
      <div>
        {terminalID && (
          <TempleLayoutConfig
            terminalID={terminalID}
            userSelectedLock={userSelectedLock}
            inProgressLocks={inProgressLocks}
            isMalfunction={isMalfunction}
            userSelectedLockFun={userSelectedLockFun.bind(this)}
          />
        )}
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

export default CommonTempleLayouts;
