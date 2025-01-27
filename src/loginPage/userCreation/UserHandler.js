import React, { useEffect } from "react";
import { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import LockResetIcon from "@mui/icons-material/LockReset";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { blue, yellow } from "@mui/material/colors";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";

import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import NoAccountsIcon from "@mui/icons-material/NoAccounts";

import { Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EmailIcon from "@mui/icons-material/Email";
import { useNavigate } from "react-router-dom";
import UserCreation from "./UserCreation";
import EditExistingUser from "./EditExistingUser";
import CustomerControl from "./CustomerControl";
import { useAuth } from "../../utils/Auth";

const UserHandler = () => {
  const [isUserCreactionSelect, setIsUserCreationSelected] = useState(false);
  const [isEditUserSelected, setEditUserSelected] = useState(false);
  const [userControl, setUserControl] = useState(false);

  const Auth = useAuth();

  const [usersHandler, setUsersHandler] = useState(true);

  const Navigate = useNavigate();

  // useEffect(() => {
  //   console.log("----- access type in functional conponentn :-----");

  //   console.log(Auth.accessAppType);
  // }, []);

  const handleClickOpen = () => {
    setUsersHandler(true);
  };

  const handleClose = () => {
    setUsersHandler(false);
  };

  const closeCreateUserOperation = () => {
    Navigate("/", { replace: true });
  };

  const onCreateNewUsreSelected = () => {
    setIsUserCreationSelected(true);
    setEditUserSelected(false);
    setUsersHandler(false);
    setUserControl(false);
  };

  const onEditNewUserSelected = () => {
    setIsUserCreationSelected(false);
    setEditUserSelected(true);
    setUsersHandler(false);
    setUserControl(false);
  };

  const onUserActivityClicked = () => {
    setIsUserCreationSelected(false);
    setEditUserSelected(false);
    setUsersHandler(false);
    setUserControl(true);
  };

  return (
    <div>
      {Auth.accessAppType !== "MALL-LOCKERS" ? (
        <div
          style={{
            textAlign: "center",
            border: "2px solid crimson",
            borderRadius: "2px",
            padding: "20px",
            // color: blue,
            width: "fit-content",
            alignItems: "center",
            margin: "auto",
            marginTop: "30px",
          }}
        >
          <h6 style={{ color: blue }}>
            You cant create/edit user from{" "}
            <b style={{ color: "crimson" }}>{Auth.accessAppType}</b>, Change to
            mall lockers and try
          </h6>

          <Button
            color="warning"
            variant="contained"
            sx={{ mt: 3 }}
            onClick={() => closeCreateUserOperation()}
          >
            return to home
          </Button>
        </div>
      ) : (
        <>
          {isUserCreactionSelect ? (
            <UserCreation />
          ) : isEditUserSelected ? (
            <EditExistingUser />
          ) : userControl ? (
            <CustomerControl />
          ) : null}
          <div>
            <Dialog open={usersHandler}>
              <DialogTitle> Select Mode Of Operation </DialogTitle>
              <IconButton
                aria-label="delete"
                color="primary"
                sx={{
                  mt: -6,
                  ml: "88%",
                }}
                onClick={() => closeCreateUserOperation()}
              >
                <CloseIcon color="error" />
              </IconButton>
              <List sx={{ pt: 1, width: 350 }}>
                <ListItem
                  sx={{
                    cursor: "pointer",
                  }}
                  onClick={() => onCreateNewUsreSelected()}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: yellow[100], color: yellow[500] }}>
                      <PersonAddIcon color="primary" />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={"create new user"} />
                </ListItem>

                <ListItem
                  sx={{
                    cursor: "pointer",
                  }}
                  onClick={() => onEditNewUserSelected()}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: yellow[100], color: yellow[500] }}>
                      <ManageAccountsIcon color="primary" />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={" edit existing user "} />
                </ListItem>

                <ListItem
                  sx={{
                    cursor: "pointer",
                  }}
                  onClick={() => onUserActivityClicked()}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: yellow[100], color: yellow[500] }}>
                      <NoAccountsIcon color="primary" />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={" Block/Unblock Customer "} />
                </ListItem>
              </List>
            </Dialog>
          </div>
        </>
      )}
    </div>
  );
};

export default UserHandler;
