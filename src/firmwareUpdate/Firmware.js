import React, { useEffect, useState } from "react";
import Navbar from "../mainDashBoard/Navbar";
import "./firmware.css";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import MuiAlert from "@mui/material/Alert";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Divider,
  Snackbar,
  TextField,
  useTheme,
} from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";

import PathUrl from "../GlobalVariable/urlPath.json";
import LockerCatagoryTable from "../settingsComponent/TableFunction/LockerCatagoryTable";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { useAuth } from "../utils/Auth";
import { json } from "react-router-dom";

/*
    Auther Praveenkumar 
    firmware update page 
    started on may 02 - 2023

*/

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function getStyles(termid, terminalid, theme) {
  return {
    fontWeight:
      terminalid.indexOf(termid) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

function Firmware() {
  const theme = useTheme();
  const [terminalID, setTerminalID] = useState([]);

  const [firmwareItems, setFirmwareItems] = useState({
    firmwareType: "",
    destPath: "",
    status: "notupdated",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileSize, setSelectedFileSize] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [allTerminalIds, setAllTerminalIds] = useState([]);
  const vertical = "top";
  const horizontal = "center";

  const [firmwareTableBtn, setFirmwareTableBtn] = useState(
    "view Firmware table"
  );

  const [downloadUrlPath, setDownloadUrlPath] = useState("");
  const [isFirmwareTableOpen, setIsFirmwareTableOpen] = useState(false);

  const [openDialoge, setOpenDialoge] = useState(false);

  const [isStoreSuccess, setIsStoreSuccess] = useState(false);
  const [isDestinationWrong, setIsDestinationWrong] = useState(false);
  const [isStoreFail, setIsStoreFail] = useState(false);
  const [isFileWriteFail, setIsFileWriteFail] = useState(false);
  const [isFirmwareTableEmpyt, setIsFirmwareTableEmpyt] = useState(false);
  const [itemDeletedTrue, setItemDeletedTrue] = useState(false);
  const [isClickedOnViewTable, setIsClickedOnViewTable] = useState(false);
  const [itemDeletedFalse, setItemDeletedFalse] = useState(false);
  const [noFileItemDeleted, setNoFileItemDeleted] = useState(false);

  const [allFirmwareObjects, setAllFirmwareObjects] = useState({
    slno: [],
    updateType: [],
    destinationPath: [],
    fileName: [],
    status: [],
    terminalID: [],
    generatedDate: [],
    generatedTime: [],
    updatedDate: [],
    updatedTime: [],
  });

  const [deleteFirmwareObject, setDeleteFirmwareObject] = useState({
    slno: "",
    destPath: "",
    fileName: "",
  });

  const Auth = useAuth();

  const [serverPaths, setServePaths] = useState({
    serverUrl: Auth.accessAppType === "TEMPLE-LOCKERS" ? PathUrl.templeServerUrl : Auth.accessAppType === "STATION-LOCKERS" ? PathUrl.stationServerUrl : PathUrl.serverUrl,
    localAdminPath: Auth.accessAppType === "TEMPLE-LOCKERS" ? PathUrl.templeLocalServerPath : Auth.accessAppType === "STATION-LOCKERS" ? PathUrl.stationLocalServerPath : PathUrl.localServerPath
  })

  useEffect(() => {
    setServePaths({
      serverUrl: Auth.accessAppType === "TEMPLE-LOCKERS" ? PathUrl.templeServerUrl : Auth.accessAppType === "STATION-LOCKERS" ? PathUrl.stationServerUrl : PathUrl.serverUrl,
      localAdminPath: Auth.accessAppType === "TEMPLE-LOCKERS" ? PathUrl.templeLocalServerPath : Auth.accessAppType === "STATION-LOCKERS" ? PathUrl.stationLocalServerPath : PathUrl.localServerPath
    })
  }, [Auth.accessAppType])

  useEffect(() => {
    getAllTerminalIds();
  }, []);

  useEffect(() => {
    if (!Auth.user) {
      Auth.logoutHandler();
    }
  }, []);

  const getAllTerminalIds = () => {
    // setLoading(true);
    const getLocksObj = {
      PacketType: "gettermid",
    };

    console.log(getLocksObj);

    fetch(serverPaths.localAdminPath + "FetchTransactionDetails", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: JSON.stringify(getLocksObj),
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data.responseCode === "avltd-200") {
          if (data.terminalID.length > 1) {
            setAllTerminalIds(["all", ...data.terminalID]);
          } else {
            setAllTerminalIds(data.terminalID);
          }
        } else if (data.responseCode === "notd-201") {
          alert("no terminalId in Site registtration");
        }
        // setLoading(false);
      })
      .catch((err) => {
        console.log("err : " + err);
        // setLoading(false);
      });
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    if (value.includes("all") || value.length === allTerminalIds.length - 1) {
      setTerminalID(["all"]);
    } else {
      setTerminalID(
        // On autofill we get a stringified value.
        typeof value === "string" ? value.split(",") : value
      );
    }
  };

  const onSubmitFirmwareUpdate = () => {
    console.log(firmwareItems);
    console.log(terminalID);
    if (
      terminalID.length > 0 &&
      firmwareItems.firmwareType !== "" &&
      firmwareItems.destPath !== "" &&
      selectedFile !== null
    ) {
      const formData = new FormData();

      const firmObj = {
        ...firmwareItems,
        terminalId: JSON.stringify(terminalID),
        fileSize: selectedFileSize,
        PacketType: "savefirmupdate",
      };

      formData.append("file", selectedFile);
      formData.append("fileDetails", JSON.stringify(firmObj));

      uploadFileToServer(formData);

      console.log(formData.getAll("fileDetails"));
    } else {
      alert("please enter all the details");
    }
  };

  const onSubmitUrlUpdate = () => {

    console.log("==========---------============");
    console.log(downloadUrlPath);

    if (firmwareItems.destPath != "" && downloadUrlPath != "") {

      const downloadFirmwareUrl = {
        ...firmwareItems,
        terminalId: JSON.stringify(terminalID),
        downloadUrl: downloadUrlPath,
        PacketType: "SaveFirmwareUrl",
      }
      const formData = new FormData();
      formData.append("fileDetails", JSON.stringify(downloadFirmwareUrl))
      uploadFileToServer(formData);

    } else {
      alert("Please Enter All The Details")
    }

  }

  const uploadFileToServer = (formData) => {
    setIsLoading(true);
    fetch(serverPaths.localAdminPath + "SaveFirmwareUpdate", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    })
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data.responseCode === "strsucc-200") {
          // setFirmwareItems({
          //   ...firmwareItems,
          //   firmwareType: "",
          //   destPath: "",
          // });
          // setTerminalID([]);
          // setSelectedFile(null);
          hideFirmwareTableFun()
          setIsStoreSuccess(true);
        } else if (data.responseCode === "strfail-400") {
          setIsStoreFail(true);
        } else if (data.responseCode === "fwrite-404") {
          setIsFileWriteFail(true);
        } else if (data.responseCode === "path-404") {
          setIsDestinationWrong(true);
        } else if (data.responseCode === "firmwaretb-200") {
          setAllFirmwareObjects({
            slno: data.slno,
            destinationPath: data.destPath,
            fileName: data.fileName,
            generatedDate: data.genDate,
            generatedTime: data.genTime,
            status: data.status,
            updatedDate: data.updatedDate,
            updatedTime: data.updatedTime,
            updateType: data.updateType,
            terminalID: data.terminalID,
          });
        } else if (data.responseCode === "nofirmupdate-500" || data.responseCode === "nofirmupdate-300") {
          setIsFirmwareTableEmpyt(true);
          setFirmwareTableBtn("view Firmware table");
          setIsFirmwareTableOpen(false);
          setAllFirmwareObjects({
            ...allFirmwareObjects,
            slno: [],
            updateType: [],
            destinationPath: [],
            fileName: [],
            status: [],
            terminalID: [],
            generatedDate: [],
            generatedTime: [],
            updatedDate: [],
            updatedTime: [],
          });
        } else if (data.responseCode === "firmdelsuc-200") {
          setItemDeletedTrue(true);
          viewFirmwareUpdateHandler();
        } else if (data.responseCode === "filenotfound-404") {
          setItemDeletedFalse(true);
        } else if (data.responseCode === "filenotfound-200") {
          viewFirmwareUpdateHandler();
          setNoFileItemDeleted(true);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("error : " + error);
        setIsLoading(false);
      });
  };

  const onSelectFirmwareType = (event) => {
    setFirmwareItems({
      ...firmwareItems,
      [event.target.name]: event.target.value,
    });
  };

  const onSelectingFile = (e) => {
    setSelectedFile(e.target.files[0]);
    setSelectedFileSize(e.target.files[0].size);

  };

  const handleHideAlert = () => {
    setIsDestinationWrong(false);
    setIsStoreSuccess(false);
    setIsStoreFail(false);
    setIsFileWriteFail(false);
    setIsFirmwareTableEmpyt(false);
  };

  const viewFirmwareUpdateHandler = () => {
    const reqObj = {
      PacketType: "getfirmupdate",
    };
    setIsClickedOnViewTable(true);
    setIsFirmwareTableOpen(true);
    setFirmwareTableBtn("Hide firmware Table");

    const formData = new FormData();
    formData.append("fileDetails", JSON.stringify(reqObj));
    uploadFileToServer(formData);
  };

  const onDeleteIconSelected = (sno, dPath, fName, e) => {
    setOpenDialoge(true);
    setDeleteFirmwareObject({
      slno: sno,
      destPath: dPath,
      fileName: fName,
    });
  };

  const closeDialog = () => {
    setOpenDialoge(false);
  };

  const deleteFirmwareRecord = () => {
    const deletePacketObj = {
      ...deleteFirmwareObject,
      PacketType: "deletefirmware",
    };
    const formData = new FormData();
    formData.append("fileDetails", JSON.stringify(deletePacketObj));

    console.log(deletePacketObj)

    uploadFileToServer(formData);
    closeDialog();
  };

  const handleFirmwareDeleteAlert = () => {
    setItemDeletedFalse(false);
    setItemDeletedTrue(false);
    setNoFileItemDeleted(false);
  };

  const hideFirmwareTableFun = () => {
    setIsClickedOnViewTable(false);
    setIsFirmwareTableOpen(false);
    setFirmwareTableBtn("view Firmware table");
  };

  return (
    <div>
      <Navbar />
      <div className="components-below-navbar">
        <Snackbar
          open={isStoreSuccess}
          autoHideDuration={6000}
          anchorOrigin={{ vertical, horizontal }}
        >
          <Alert
            onClose={() => handleHideAlert()}
            severity="success"
            sx={{ width: "100%" }}
          >
            Operation is success
          </Alert>
        </Snackbar>

        <Snackbar
          open={isFileWriteFail}
          autoHideDuration={6000}
          anchorOrigin={{ vertical, horizontal }}
        >
          <Alert
            onClose={() => handleHideAlert()}
            severity="error"
            sx={{ width: "100%" }}
          >
            something went wrong while upploading file in server
          </Alert>
        </Snackbar>

        <Snackbar
          open={isStoreFail}
          autoHideDuration={6000}
          anchorOrigin={{ vertical, horizontal }}
        >
          <Alert
            onClose={() => handleHideAlert()}
            severity="error"
            sx={{ width: "100%" }}
          >
            Failed to store in db.
          </Alert>
        </Snackbar>

        <Snackbar
          open={isDestinationWrong}
          autoHideDuration={6000}
          anchorOrigin={{ vertical, horizontal }}
        >
          <Alert
            onClose={() => handleHideAlert()}
            severity="error"
            sx={{ width: "100%" }}
          >
            Please provide valid destination path
          </Alert>
        </Snackbar>

        <Snackbar
          open={isFirmwareTableEmpyt}
          autoHideDuration={6000}
          anchorOrigin={{ vertical, horizontal }}
        >
          <Alert
            onClose={() => handleHideAlert()}
            severity="error"
            sx={{ width: "100%" }}
          >
            No data table found for firmware update !
          </Alert>
        </Snackbar>

        <Snackbar
          open={itemDeletedTrue}
          autoHideDuration={6000}
          anchorOrigin={{ vertical, horizontal }}
        >
          <Alert
            onClose={() => handleFirmwareDeleteAlert()}
            severity="success"
            sx={{ width: "100%" }}
          >
            Firmware deleted successfully.
          </Alert>
        </Snackbar>

        <Snackbar
          open={itemDeletedFalse}
          autoHideDuration={6000}
          anchorOrigin={{ vertical, horizontal }}
        >
          <Alert
            onClose={() => handleFirmwareDeleteAlert()}
            severity="error"
            sx={{ width: "100%" }}
          >
            firmware not deleted, please check again.
          </Alert>
        </Snackbar>

        <Snackbar
          open={noFileItemDeleted}
          autoHideDuration={6000}
          anchorOrigin={{ vertical, horizontal }}
        >
          <Alert
            onClose={() => handleFirmwareDeleteAlert()}
            severity="warning"
            sx={{ width: "100%" }}
          >
            Firmware File not found! But item deleted from database.
          </Alert>
        </Snackbar>

        <div className="title-container">
          <h2>Firmware Update</h2>
          <hr />
          {allTerminalIds.length > 0 ? (
            <div className="firmware-form-control">
              <Box
                component="form"
                sx={{
                  margin: "auto",
                  width: 400,
                }}
                noValidate
                autoComplete="off"
              >
                <RadioGroup
                  row
                  sx={{
                    ml: "80px",
                  }}
                  onChange={(e) => onSelectFirmwareType(e)}
                >
                  <FormControlLabel
                    value="firmware"
                    control={<Radio />}
                    label="firmware"
                    name="firmwareType"
                  />
                  <FormControlLabel
                    value="other"
                    control={<Radio />}
                    label="other"
                    name="firmwareType"
                  />
                  <FormControlLabel
                    value="urlUpdate"
                    control={<Radio />}
                    label="Url Update"
                    name="firmwareType"
                  />
                </RadioGroup>

                <div className="firmware-div">
                  <TextField
                    required
                    name="destPath"
                    label="Destination Path"
                    value={firmwareItems.destPath}
                    variant="outlined"
                    onChange={(e) => onSelectFirmwareType(e)}
                  />
                </div>

                <div className="firmware-div">
                  <TextField
                    required
                    name="status"
                    label="status"
                    variant="outlined"
                    value={firmwareItems.status}
                    focused
                    color="success"
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </div>

                <div className="firmware-div">
                  <FormControl sx={{ width: 210 }} required>
                    <InputLabel id="demo-multiple-chip-label">
                      Terminal ID
                    </InputLabel>
                    <Select
                      labelId="demo-multiple-chip-label"
                      id="demo-multiple-chip"
                      multiple
                      value={terminalID}
                      onChange={handleChange}
                      input={
                        <OutlinedInput
                          id="select-multiple-chip"
                          label="Terminal ID"
                        />
                      }
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )}
                      MenuProps={MenuProps}
                    >
                      {allTerminalIds.map((termid) => (
                        <MenuItem
                          key={termid}
                          value={termid}
                          style={getStyles(termid, terminalID, theme)}
                        >
                          {termid}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </div>

                {
                  firmwareItems.firmwareType === "urlUpdate" ?
                    <div className="firmware-div">
                      <TextField
                        required
                        focused
                        type="text"
                        name="urlName"
                        label="Update Url Path"
                        color="success"
                        variant="outlined"
                        value={downloadUrlPath}
                        onChange={(e) => setDownloadUrlPath(e.target.value)}
                      />
                    </div>
                    :
                    <div className="firmware-div">
                      <TextField
                        required
                        focused
                        type="file"
                        name="filePath"
                        label="File Path"
                        color="success"
                        variant="outlined"
                        value={firmwareItems.filePath}
                        onChange={(e) => onSelectingFile(e)}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </div>

                }

                {/* <div className="firmware-div">
                  <TextField
                    required
                    focused
                    type="file"
                    name="filePath"
                    label="File Path"
                    color="success"
                    variant="outlined"
                    value={firmwareItems.filePath}
                    onChange={(e) => onSelectingFile(e)}
                  />
                </div> */}

                <div className="firmware-form-btn">
                  <Button
                    color="secondary"
                    variant="contained"
                    onClick={() => firmwareItems.firmwareType === "urlUpdate" ? onSubmitUrlUpdate() : onSubmitFirmwareUpdate()}
                    fullWidth
                  >
                    Submit
                  </Button>
                </div>
              </Box>
            </div>
          ) : (
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={true}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          )}
        </div>

        <div className="view-firmware-table-btn">
          <Button
            color="warning"
            variant="contained"
            onClick={
              !isFirmwareTableOpen
                ? () => viewFirmwareUpdateHandler()
                : () => hideFirmwareTableFun()
            }
            fullWidth
          >
            {firmwareTableBtn}
          </Button>
        </div>

        {isClickedOnViewTable &&
          (allFirmwareObjects.slno.length > 0 ? (
            <div className="firmware-table-view">
              <div className="table-header-title">
                <h3>Firmware Update Table</h3>
              </div>
              <div className="firmware-table">
                <LockerCatagoryTable
                  tableData={allFirmwareObjects}
                  tableType={"firmwareobjects"}
                  selectedRowFun={onDeleteIconSelected.bind(this)}
                />
              </div>
            </div>
          ) : (
            <p>No table Found</p>
          ))}
      </div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Dialog
        open={openDialoge}
        TransitionComponent={Transition}
        keepMounted
        onClose={closeDialog}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Are you sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            the deleted item will be lossed forever along with the appropriote
            file if present
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>cancel</Button>
          <Button onClick={() => deleteFirmwareRecord()}>confirm</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Firmware;
