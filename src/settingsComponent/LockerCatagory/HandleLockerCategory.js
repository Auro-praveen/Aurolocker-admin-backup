import React from "react";
import { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";

import { yellow } from "@mui/material/colors";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";

import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

import LockCategoryNewReg from "./LockCategoryNewReg";
import LockerLockCatagory from "./LockerLockCatagory";
import AdminAccessInfo from "./AdminAccessInfo";
import SecurityIcon from '@mui/icons-material/Security';

const HandleLockerCategory = () => {

    
    const [isUserCreactionSelect, setIsUserCreationSelected] = useState(false);
    const [isEditUserSelected, setEditUserSelected] = useState(false);
    const [forAdminAccess, setForAdminAccess] = useState(false)
  
    const [usersHandler, setUsersHandler] = useState(true);
  
    const Navigate = useNavigate();
  
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
      setForAdminAccess(false)
    };
  
    const onEditNewUserSelected = () => {
      setIsUserCreationSelected(false);
      setEditUserSelected(true);
      setUsersHandler(false);
      setForAdminAccess(false)
    };

    const onForAdminSelected = () => {
      setIsUserCreationSelected(false);
      setEditUserSelected(false);
      setUsersHandler(false);
      setForAdminAccess(true)
    }
  
    return (
      <div>
        {isUserCreactionSelect ? (
          <LockCategoryNewReg />
        ) : isEditUserSelected ? (
          <LockerLockCatagory />
        ) : forAdminAccess ? (
          <AdminAccessInfo />
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
                <ListItemText primary={"Add New Locker Category"} />
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
                <ListItemText primary={"Edit Existing Locker Category"} />
              </ListItem>

              <ListItem
                sx={{
                  cursor: "pointer",
                }}
                onClick={() => onForAdminSelected()}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: yellow[100], color: yellow[500] }}>
                    <SecurityIcon color="primary" />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={"Admin Access"} />
              </ListItem>
            </List>
          </Dialog>
        </div>
      </div>
    );
  };

export default HandleLockerCategory