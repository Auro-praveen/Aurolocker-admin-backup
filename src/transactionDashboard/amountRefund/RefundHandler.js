import React, { useEffect } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";

import { yellow } from "@mui/material/colors";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import HistoryIcon from "@mui/icons-material/History";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";

import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import RefundHistory from "./RefundHistory";
import AmountRefund from "./AmountRefund";

const RefundHandler = (props) => {
  const [typeOfRefundOperation, setTypeOfRefundOperation] = useState(true);
  const [isRefundSelected, setIsRefundSelected] = useState(false);
  const [isRefundHistorySelected, setIsRefundHistorySelected] = useState(false);

  const closeRefnundHqndler = () => {
    props.onCloseHandler("transactionDetails");
  };

  useEffect(() => {
    if (props.isRefundInitFromDiffComp) {
      setIsRefundHistorySelected(false);
      setIsRefundSelected(true);
      setTypeOfRefundOperation(false);
    } else {
      setIsRefundHistorySelected(false);
      setIsRefundSelected(false);
      setTypeOfRefundOperation(true);
    }
  }, [props.status]);

  const openRefundHistory = () => {
    setIsRefundHistorySelected(true);
    setIsRefundSelected(false);
    setTypeOfRefundOperation(false);
  };

  const openTransactionRefund = () => {
    setIsRefundHistorySelected(false);
    setIsRefundSelected(true);
    setTypeOfRefundOperation(false);
  };

  return (
    <div>
      <Dialog open={typeOfRefundOperation}>
        <DialogTitle> Select Type Of Refund Operation </DialogTitle>
        <IconButton
          aria-label="delete"
          color="primary"
          sx={{
            mt: -6,
            ml: "88%",
          }}
          onClick={() => closeRefnundHqndler()}
        >
          <CloseIcon color="error" />
        </IconButton>

        <List>
          <ListItem
            sx={{
              cursor: "pointer",
            }}
            onClick={() => openRefundHistory()}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: yellow[100], color: yellow[800] }}>
                <HistoryIcon color="primary" />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={"Refund History"} />
          </ListItem>

          <ListItem
            sx={{
              cursor: "pointer",
            }}
            onClick={() => openTransactionRefund()}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: yellow[100], color: yellow[500] }}>
                <DeleteSweepIcon color="primary" />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={"Refund Transactions"} />
          </ListItem>
        </List>
      </Dialog>

      {isRefundHistorySelected ? (
        <RefundHistory />
      ) : isRefundSelected ? (
        <AmountRefund
          refundObj = {props.refundInitObj}
        />
      ) : null}
    </div>
  );
};

export default RefundHandler;
