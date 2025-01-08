import React, { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import LockResetIcon from "@mui/icons-material/LockReset";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { yellow } from "@mui/material/colors";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";

import ReleaseLock from "./releaseLock/ReleaseLock";
import UnconditionalLockerOpen from "./uncoditionalOpenLock/UnconditionalLockerOpen";
import DashBoardOperationItems from "../mainDashBoard/dashboardCards/DashBoardOperationItems";
import NoEncryptionIcon from "@mui/icons-material/NoEncryption";
import MalfunctionLockers from "./malfunctionLockers/MalfunctionLockers";
import { Alert, IconButton, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/Email";

const LockerOperations = (props) => {
  
  const [state, setState] = useState({
    vertical: "top",
    horizontal: "left",
  });

  const { vertical, horizontal } = state;

  const [isWarning, setIsWarning] = useState(false);

  const [modeOfOperationDailogue, setModeOfOperationDailogue] = useState(true);
  const [releaseLockWind, setReleaseLockWindow] = useState(false);
  const [unconditionalLockWind, setUnconditionalLockWind] = useState(false);
  const [malfunctionLockerWind, setMalfunctionLockerWind] = useState(false);
  const [openLockBySmsWind, setOpenLockBySmsWind] = useState(false);

  const onReleaseLockSelect = () => {
    setModeOfOperationDailogue(false);
    setReleaseLockWindow(true);
    setMalfunctionLockerWind(false);
    setUnconditionalLockWind(false)
    setOpenLockBySmsWind(false);
  };

  console.log(props.releasLocker);

  useEffect(() => {
    setModeOfOperationDailogue(true);
    setReleaseLockWindow(false);
    setMalfunctionLockerWind(false);
    setOpenLockBySmsWind(false);
  }, [props.status]);

  const onUnconditionalOpenLockSelect = () => {
    // getTerminalIdsOfTransactionDetails();
    setModeOfOperationDailogue(false);
    setUnconditionalLockWind(true);
    setOpenLockBySmsWind(false);
    setMalfunctionLockerWind(false);
  };

  const onMalfunctionLockerSelect = () => {
    setModeOfOperationDailogue(false);
    setUnconditionalLockWind(false);
    setMalfunctionLockerWind(true);
    setOpenLockBySmsWind(false);
  };

  const onOpenLockBySmsSelect = () => {
    setModeOfOperationDailogue(false);
    setUnconditionalLockWind(false);
    setMalfunctionLockerWind(false);
    setOpenLockBySmsWind(true);
  };

  const closeLockerOperationWindow = () => {
    props.onCloseHandler("transactionDetails");
  };

  const noAccessWindow = () => {
    setIsWarning(true);
  };

  const hideAlertFunction = () => {
    setIsWarning(false);
  };

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={isWarning}
        autoHideDuration={6000}
        onClose={() => hideAlertFunction()}
      >
        <Alert onClose={() => hideAlertFunction()} severity="warning">
          Access Restricted !!
        </Alert>
      </Snackbar>
      {/* dailogue box for choosing between unconditionally opoen lock and release lock */}
      <Dialog open={modeOfOperationDailogue}>
        <DialogTitle> Select Mode Of Operation </DialogTitle>
        <IconButton
          aria-label="delete"
          color="primary"
          sx={{
            mt: -6,
            ml: "88%",
          }}
          onClick={() => closeLockerOperationWindow()}
        >
          <CloseIcon color="error" />
        </IconButton>
        <List sx={{ pt: 1, width: 350 }}>
          <ListItem
            sx={{
              cursor: "pointer",
            }}
            // uncomment when you want to give permission to the release locker, need to make little change im the database
            //only if you want to give extra permissions to the existing user

            onClick={
              props.releasLocker
                ? () => onReleaseLockSelect()
                : () => noAccessWindow()
            }
            // onClick={() => onReleaseLockSelect()}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: yellow[100], color: yellow[500] }}>
                <LockResetIcon
                  // uncomment when release locker permission is given
                  color={props.releasLocker ? "primary" : "warning"}
                  // color="primary"
                />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              // uncomment when release locker permission is given

              sx={{
                color: props.releasLocker ? "#000" : "#6b6b6b",
              }}
              primary={"Release Locker"}
            />
          </ListItem>

          <ListItem
            sx={{
              cursor: "pointer",
            }}
            onClick={() => onUnconditionalOpenLockSelect()}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: yellow[100], color: yellow[500] }}>
                <LockOpenIcon color="primary" />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              sx={{
                color: "#000",
              }}
              primary={"Unconditional Open Lock"}
            />
          </ListItem>

          <ListItem
            sx={{
              cursor: "pointer",
            }}
            onClick={() => onMalfunctionLockerSelect()}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: yellow[100], color: yellow[500] }}>
                <NoEncryptionIcon color="primary" />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              sx={{
                color: "#000",
              }}
              primary={"Malfunction Lockers"}
            />
          </ListItem>

          <ListItem
            sx={{
              cursor: "pointer",
            }}
            onClick={() => onOpenLockBySmsSelect()}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: yellow[100], color: yellow[500] }}>
                <EmailIcon color="primary" />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              sx={{
                color: "#000",
              }}
              primary={"Open Lock By SMS"}
            />
          </ListItem>
        </List>
      </Dialog>

      {/* <div className="container-items">
        <DashBoardOperationItems />
        <hr />
      </div> */}

      {releaseLockWind && <ReleaseLock />}
      {unconditionalLockWind && <UnconditionalLockerOpen viaSms={false} />}
      {malfunctionLockerWind && <MalfunctionLockers />}
      {openLockBySmsWind && <UnconditionalLockerOpen viaSms={true} />}
    </div>
  );
};

export default LockerOperations;
