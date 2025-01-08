import React, { useEffect, useRef, useState } from "react";
import "./dashboardItemContent.css";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import EnhancedEncryptionIcon from "@mui/icons-material/EnhancedEncryption";
import AddCardIcon from "@mui/icons-material/AddCard";
import LockClockIcon from "@mui/icons-material/LockClock";
import ImportantDevicesIcon from "@mui/icons-material/ImportantDevices";
import ReceiptIcon from "@mui/icons-material/Receipt";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { IconButton } from "@mui/material";
import Badge from "@mui/material/Badge";
import Stack from "@mui/material/Stack";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const DashBoardOperationItems = (props) => {
  // console.log("props items : " + props.ClickedItemToView);
  const [openAlertDialogue, setOpenAlertDialogue] = useState(false);

  const alertCount = props.count;
  const userPerm = props.userPermissions;
  const isNotificationActive = props.isNotificationActive;
  const isLocksOpen = props.isLocksOpen;
  const isTerminalInavtive = props.isTerminalInactive;
  const transitLocks = props.transitLocks;
  const tIdInWhichLocksOpen = props.tIdInWhichLocksOpen;
  const inactiveTerminals = props.inactiveTerminalNames;
  const TransitLocksId = props.transitLocksId;


  const handleAlertOpen = () => {
    setOpenAlertDialogue(true);
  };

  const handleAlertClose = () => {
    setOpenAlertDialogue(false);
  };

  const alertBtnEventHandler = (loadPage) => {
    props.clickEventForItems(loadPage);
    handleAlertClose();
  };
  return (
    <div className="dashboard-operation-items-container">
      {isNotificationActive && (
        <Stack spacing={2} alignItems={"center"} sx={{ marginBottom: "8px" }}>
          <Badge badgeContent={alertCount} color="success">
            <NotificationsIcon
              sx={{ color: "#ff330a", cursor: "pointer" }}
              className="alertAnimation"
              fontSize="large"
              onClick={() => handleAlertOpen()}
            />
          </Badge>
        </Stack>
      )}

      <div className="dashboard-items">
        {/* <Link to="/transactionDashboard"> */}
        <div
          className={
            props.ClickedItemToView === "transactionDetails"
              ? "dashobaord-item-selected dashboard-item"
              : "dashobaord-item-non-selected dashboard-item"
          }
          onClick={() => props.clickEventForItems("transactionDetails")}
        >
          <p className="dashboard-item-text">Transaction Details</p>
          <ReceiptLongIcon
            fontSize="large"
            color="error"
            sx={{
              mb: 1,
            }}
          />
        </div>
        {/* </Link> */}
        {/* 
        <Link to="/lockerOperations"> */}
        <div
          className={
            userPerm.indexOf("locker_operation") === -1
              ? "dashboard-item access-denied"
              : props.ClickedItemToView === "lockerOperations"
              ? "dashobaord-item-selected dashboard-item"
              : "dashobaord-item-non-selected dashboard-item"
          }
          onClick={
            userPerm.indexOf("locker_operation") === -1
              ? () => props.accessRestricted()
              : () => props.clickEventForItems("lockerOperation")
          }
        >
          <p className="dashboard-item-text">Locker Operations</p>
          <LockClockIcon
            fontSize="large"
            color="error"
            className=""
            sx={{
              mb: 1,
            }}
          />
        </div>
        {/* </Link> */}

        {/* <Link to="/amountRefund"> */}
        <div
          className={
            userPerm.indexOf("refund") === -1
              ? "dashboard-item access-denied"
              : props.ClickedItemToView === "refund"
              ? "dashobaord-item-selected dashboard-item"
              : "dashobaord-item-non-selected dashboard-item"
          }
          onClick={
            userPerm.indexOf("refund") === -1
              ? () => props.accessRestricted()
              : () => props.clickEventForItems("refund")
          }
        >
          <p className="dashboard-item-text">Refund</p>
          <AddCardIcon
            fontSize="large"
            color="error"
            sx={{
              mb: 1,
            }}
          />
        </div>
        {/* </Link> */}

        {/* <Link to="/transaction-history"> */}
        <div
          className={
            userPerm.indexOf("transaction_history") === -1
              ? "dashboard-item access-denied"
              : props.ClickedItemToView === "transactionHistory"
              ? "dashobaord-item-selected dashboard-item"
              : "dashobaord-item-non-selected dashboard-item"
          }
          onClick={
            userPerm.indexOf("transaction_history") === -1
              ? () => props.accessRestricted()
              : () => props.clickEventForItems("transactionHistory")
          }
        >
          <p className="dashboard-item-text">Transaction Operation</p>
          <ReceiptIcon
            fontSize="large"
            color="error"
            sx={{
              mb: 1,
            }}
          />
        </div>
        {/* </Link> */}

        {/* <Link to="/deviceStatus"> */}
        <div
          className={
            props.ClickedItemToView === "deviceStatus"
              ? "dashobaord-item-selected dashboard-item"
              : "dashobaord-item-non-selected dashboard-item"
          }
          onClick={() => props.clickEventForItems("deviceStatus")}
        >
          <p className="dashboard-item-text">Device Status</p>
          <ImportantDevicesIcon
            fontSize="large"
            color="error"
            sx={{
              mb: 1,
            }}
          />
        </div>
        {/* </Link> */}

        {/* <Link to="/lockStatus"> */}
        <div
          className={
            props.lockersOpen
              ? "dashboard-item locker-open-alert"
              : props.ClickedItemToView === "lockerStatus"
              ? "dashobaord-item-selected dashboard-item"
              : "dashobaord-item-non-selected dashboard-item"
          }
          onClick={() => props.clickEventForItems("lockerStatus")}
        >
          <p className="dashboard-item-text">Locker Status</p>

          <EnhancedEncryptionIcon
            fontSize="large"
            color={props.lockersOpen ? "" : "error"}
            sx={{
              mb: 1,
            }}
          />
        </div>
        {/* </Link> */}
      </div>

      {/* <div className="bef-next-icon-btn">
        <IconButton
          color="primary"
          aria-label="before"
          className="prev-btn"
          component="label"
          onClick={() => onNextClick("left")}
        >
          <KeyboardArrowLeftIcon fontSize="large" />
        </IconButton>
        <IconButton
          color="primary"
          aria-label="next"
          className="next-btn"
          component="label"
          onClick={() => onNextClick("right")}
        >
          <KeyboardArrowRightIcon fontSize="large" />
        </IconButton>
      </div> */}

      <Dialog open={openAlertDialogue} onClose={handleAlertClose} fullWidth>
        <DialogTitle textAlign={"center"} color={"crimson"}>
          ALERT !!
        </DialogTitle>
        <DialogContent>
          {isTerminalInavtive && (
            <Button
              sx={{ mb: 1 }}
              color="info"
              variant="outlined"
              onClick={() => alertBtnEventHandler("deviceStatus")}
              fullWidth
            >
              terminal Id's = {inactiveTerminals}
              {". "} are inactive at the moment, please check!!
            </Button>
          )}
          {isLocksOpen && (
            <Button
              sx={{ mb: 1 }}
              color="info"
              variant="outlined"
              onClick={() => alertBtnEventHandler("lockerStatus")}
              fullWidth
            >
              Lockers door may not been closed properly in the Terminal Id's ={" "}
              {tIdInWhichLocksOpen + ". "} please check!!
            </Button>
          )}

          {transitLocks && (
            <Button
              sx={{ mb: 1 }}
              color="info"
              variant="outlined"
              onClick={() => alertBtnEventHandler("transactionDetails")}
              fullWidth
            >
              Lockers may have transit status in the Terminal id's ={" "}
              {TransitLocksId + ". "} please check!!
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashBoardOperationItems;
