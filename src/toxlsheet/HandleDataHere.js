import React from 'react'
import { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import { yellow } from "@mui/material/colors";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import { IconButton } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";

import DescriptionIcon from '@mui/icons-material/Description';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import HistoryDatatoXlsheet from './HistoryDatatoXlsheet';
import PartialUserData from './PartialUserData';
import { Navigate } from 'react-router-dom';

const HandleDataHere = () => {

    const [xlData, setXlData] = useState(false);
    const [partialData, setPartialData] = useState(false);
    const [usersHandler, setUserHandler] = useState(true)

    const handleUserSelectEvent = (type) => {
        if (type === "XL-DATA") {

            setXlData(true);
            setPartialData(false)
            setUserHandler(false)
        } else if (type === "PART-DATA") {
            setXlData(false);
            setPartialData(true)
            setUserHandler(false)
        } else {
            setUserHandler(true)
        }
    }

    const closeCreateUserOperation = () => {
        Navigate("/", { replace: true });
    };

    return (
        <div>
            {
                xlData ?
                    <HistoryDatatoXlsheet />
                    : partialData ?
                        <PartialUserData />
                        :
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
                                        onClick={() => handleUserSelectEvent("XL-DATA")}
                                    >
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: yellow[100], color: yellow[500] }}>
                                                <DescriptionIcon color="primary" />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={"Download Xl-Sheet"} />
                                    </ListItem>

                                    <ListItem
                                        sx={{
                                            cursor: "pointer",
                                        }}
                                        onClick={() => handleUserSelectEvent("PART-DATA")}
                                    >
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: yellow[100], color: yellow[500] }}>
                                                <FolderSharedIcon color="primary" />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={" Partial retrieve data"} />
                                    </ListItem>
                                </List>
                            </Dialog>
                        </div>

            }
        </div>
    )
}

export default HandleDataHere