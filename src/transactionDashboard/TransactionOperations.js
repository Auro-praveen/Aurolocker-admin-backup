import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";

import { yellow } from "@mui/material/colors";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import EmailIcon from "@mui/icons-material/Email";
import HistoryIcon from "@mui/icons-material/History";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";

import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TDHistory from "./TDHistory";
import FailedTransactions from "./failedTransaction/FailedTransactions";
import LossedCustomers from "./LossedCustomers";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import LockClockIcon from "@mui/icons-material/LockClock";
import PartialLocksDetails from "./PartialLocksDetails";
import { useEffect } from "react";

const TransactionOperations = (props) => {
  const [modeOfTransactionOperation, setModeOfTransactionOperation] =
    useState(true);
  const [isTransHistorySelected, setIsTransHistorySelected] = useState(false);
  const [isFailedTransactionSelected, setIsFailedTransactionSelected] =
    useState(false);
  const [isLossedCustomersSelected, setIsLossedCustomersSelected] =
    useState(false);
  const [isPartialLockSelected, setIsPartialLockSelected] = useState(false);

  const closeLockerOperationWindow = () => {
    props.onCloseHandler("transactionDetails");
  };

  console.log(props.status);
  useEffect(() => {
    setModeOfTransactionOperation(true);
    setIsFailedTransactionSelected(false);
    setIsLossedCustomersSelected(false);
    setIsPartialLockSelected(false);
    setIsTransHistorySelected(false);
  }, [props.status]);

  const openTransactionHistory = () => {
    setIsTransHistorySelected(true);
    setIsFailedTransactionSelected(false);
    setModeOfTransactionOperation(false);
    setIsLossedCustomersSelected(false);
    setIsPartialLockSelected(false);
  };

  const openFailedTransaction = () => {
    setIsFailedTransactionSelected(true);
    setIsTransHistorySelected(false);
    setModeOfTransactionOperation(false);
    setIsLossedCustomersSelected(false);
    setIsPartialLockSelected(false);
  };

  const openLossedCustomers = () => {
    setIsFailedTransactionSelected(false);
    setIsTransHistorySelected(false);
    setModeOfTransactionOperation(false);
    setIsLossedCustomersSelected(true);
    setIsPartialLockSelected(false);
  };

  const openPArtialLocksSelected = () => {
    setIsFailedTransactionSelected(false);
    setIsTransHistorySelected(false);
    setModeOfTransactionOperation(false);
    setIsLossedCustomersSelected(false);
    setIsPartialLockSelected(true);
  };

  return (
    <div>
      <Dialog open={modeOfTransactionOperation}>
        <DialogTitle> Select Type Of Transaction Operation </DialogTitle>
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

        <List sx={{ pt: 1, width: 420 }}>
          <ListItem
            sx={{
              cursor: "pointer",
            }}
            onClick={() => openTransactionHistory()}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: yellow[100], color: yellow[800] }}>
                <HistoryIcon color="primary" />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={"Transaction History"} />
          </ListItem>

          <ListItem
            sx={{
              cursor: "pointer",
            }}
            onClick={() => openFailedTransaction()}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: yellow[100], color: yellow[500] }}>
                <DeleteSweepIcon color="primary" />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={"Failed Transactions"} />
          </ListItem>

          <ListItem
            sx={{
              cursor: "pointer",
            }}
            onClick={() => openLossedCustomers()}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: yellow[100], color: yellow[500] }}>
                <PersonOffIcon color="primary" />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={"Lossed Customers"} />
          </ListItem>

          <ListItem
            sx={{
              cursor: "pointer",
            }}
            onClick={() => openPArtialLocksSelected()}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: yellow[100], color: yellow[500] }}>
                <LockClockIcon color="primary" />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={"Partial Locks"} />
          </ListItem>
        </List>
      </Dialog>

      <>
        {isTransHistorySelected ? (
          <TDHistory refundClickHandler={props.onRefundClick} />
        ) : isFailedTransactionSelected ? (
          <FailedTransactions />
        ) : isLossedCustomersSelected ? (
          <LossedCustomers />
        ) : isPartialLockSelected ? (
          <PartialLocksDetails />
        ) : null}
      </>
    </div>
  );
};

export default TransactionOperations;
