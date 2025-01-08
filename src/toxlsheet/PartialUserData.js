import React, { useEffect, useState } from 'react'
import Navbar from '../mainDashBoard/Navbar'
import { Box, Button, FormControl, InputLabel, MenuItem, OutlinedInput, Select, TextField, useTheme, Chip } from '@mui/material'

import urlPath from "../GlobalVariable/urlPath.json";
import "./historydatatoxl.css";
import { commonApiForPostConenction } from '../GlobalVariable/GlobalModule';
import LockerCatagoryTable from '../settingsComponent/TableFunction/LockerCatagoryTable';
import { useAuth } from '../utils/Auth';

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

function getStyles(termid, terminalid, theme) {
    return {
        fontWeight:
            terminalid.indexOf(termid) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
}

const PartialUserData = () => {

    const [terminalID, setTerminalID] = useState([]);
    const [allTerminalIds, setAllTerminalIds] = useState([]);

    const [selectedItems, setSelectedItems] = useState({
        fromDate: "",
        toDate: "",
    });

    const [isDateWrong, setIsDateWrong] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const [partRetrieveObject, setPartRetrieveObject] = useState({
        slno: [],
        customerName: [],
        mobileNo: [],
        amount: [],
        partRetAmount: [],
        terminalID: [],
        dateOfOpen: [],
        dateOfClose: [],
        timeOfOpen: [],
        timeOfClose: [],
        lockerNo: []
    })


    const theme = useTheme();
    const Auth = useAuth()

    useEffect(() => {
        // testFun();
        getAllTerminalIds();
    }, []);


    const getAllTerminalIds = () => {
        // setLoading(true);
        const getLocksObj = {
            PacketType: "gettermid",
        };

        console.log(getLocksObj);

        fetch(Auth.serverPaths.localAdminPath + "FetchTransactionDetails", {
            method: "POST",
            headers: {
                Accept: "application/json",
                // 'Accept': 'application/json',
                // 'Content-Type': 'application/json',
                // "X-Content-Type-Options": "nosniff",
                // "X-Frame-Options": "DENY",
                // "Referrer-Policy": "no-referrer"
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



    const verifySelectedDate = (e) => {
        if (e.target.name === "toDate") {
            const fDate = new Date(selectedItems.fromDate).getTime();
            const tDate = new Date(e.target.value).getTime();
            if (tDate >= fDate) {
                setIsDateWrong(false);
            } else {
                setIsDateWrong(true);
            }
        }
        setSelectedItems({
            ...selectedItems,
            [e.target.name]: e.target.value,
        });
    };

    const submitFormHAndler = () => {

        setIsLoading(true)

        if (terminalID.includes("all")) {
            const obj = {
                PacketType: "GET-PARTDETAILS",
                ...selectedItems,
            };


            getPartRetrieveDetails(obj);

        } else {
            const obj = {
                // PacketType: "getforxlsxtermwise",
                PacketType: "GETTERMWISE-PARTDETAILS",
                terminalID: terminalID,
                ...selectedItems,
            };

            getPartRetrieveDetails(obj);
        }


    }

    const getPartRetrieveDetails = async (object) => {


        const result = await commonApiForPostConenction("FetchPartialRetrieveDetails", object, Auth.accessAppType)

        if (result) {

            console.log(result);


            setIsLoading(false)

            if (result.responseCode === "partData-200") {

                setPartRetrieveObject({
                    ...partRetrieveObject,
                    slno: result.slno,
                    amount: result.amount,
                    customerName: result.customerName,
                    dateOfClose: result.dateOfClose,
                    dateOfOpen: result.dateOfOpen,
                    mobileNo: result.mobileNo,
                    partRetAmount: result.partRetAmount,
                    terminalID: result.terminalID,
                    timeOfOpen: result.timeOfOpen,
                    timeOfClose: result.timeOfClose,
                    lockerNo: result.lockerNo
                })

            } else if (result.responseCode === "partData-204") {

                alert("no data present")

                setPartRetrieveObject({
                    slno: [],
                    customerName: [],
                    mobileNo: [],
                    amount: [],
                    partRetAmount: [],
                    terminalID: [],
                    dateOfOpen: [],
                    dateOfClose: [],
                    timeOfOpen: [],
                    timeOfClose: [],
                    lockerNo: []
                })
            } else if (result.responseCode === "partData-500") {

                alert("no data present")

                setPartRetrieveObject({
                    slno: [],
                    customerName: [],
                    mobileNo: [],
                    amount: [],
                    partRetAmount: [],
                    terminalID: [],
                    dateOfOpen: [],
                    dateOfClose: [],
                    timeOfOpen: [],
                    timeOfClose: [],
                    lockerNo: []
                })
            } else {
                alert("no data present")
                setPartRetrieveObject({
                    slno: [],
                    customerName: [],
                    mobileNo: [],
                    amount: [],
                    partRetAmount: [],
                    terminalID: [],
                    dateOfOpen: [],
                    dateOfClose: [],
                    timeOfOpen: [],
                    timeOfClose: [],
                    lockerNo: []
                })
            }


        } else {

            setIsLoading(false)

            setPartRetrieveObject({
                slno: [],
                customerName: [],
                mobileNo: [],
                amount: [],
                partRetAmount: [],
                terminalID: [],
                dateOfOpen: [],
                dateOfClose: [],
                timeOfOpen: [],
                timeOfClose: [],
                lockerNo: []
            })
        }
    }


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


    return (
        <div>
            <Navbar />
            <div className="components-below-navbar">
                <div className="toxlsheet-container">
                    <h4 className="h4-style">
                        Check Partial Retrieved Customers Here
                    </h4>
                </div>

                <div className="firmware-div part-retr-fields">
                    <FormControl sx={{ width: 210, margin: 'auto' }} required>
                        <InputLabel id="demo-multiple-chip-label">Terminal ID</InputLabel>
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
                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
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

                <div className="textfield-container part-retr-fields">
                    <TextField
                        variant="outlined"
                        label="From date"
                        type="date"
                        focused
                        name="fromDate"
                        value={selectedItems.fromDate}
                        required
                        onChange={(e) => verifySelectedDate(e)}
                        sx={{
                            width: 250,
                            m: 1,
                        }}
                    />
                    <TextField
                        variant="outlined"
                        label="To date"
                        type="date"
                        name="toDate"
                        color={isDateWrong ? "error" : "primary"}
                        value={selectedItems.toDate}
                        focused
                        required
                        onChange={(e) => verifySelectedDate(e)}
                        sx={{
                            width: 250,
                            m: 1,
                        }}
                        helperText={isDateWrong ? "please select valid date" : ""}
                    />
                </div>
                <div className="textfield-container part-retr-fields">
                    <Button
                        variant="contained"
                        color="warning"
                        sx={{
                            width: 250,
                        }}
                        disabled={isDateWrong ? true : isLoading ? true : false}
                        onClick={() => submitFormHAndler()}
                    >
                        submit
                    </Button>
                </div>

                <div className="table-display">
                    {
                        partRetrieveObject.slno.length > 0 ? (
                            <>
                                <div style={{ margin: 'auto', textAlign: 'center', alignItems: 'center', color: 'blueviolet' }}>
                                    <h6> Total Partially retrieved customers from <b style={{ color: "tomato" }}>{selectedItems.fromDate + " "}</b> to <b style={{ color: "tomato" }}>{selectedItems.toDate + " "}</b>
                                        for selected terminalIds are : <b style={{ color: "tomato" }} >{partRetrieveObject.slno.length}</b> </h6>
                                </div>

                                <LockerCatagoryTable
                                    tableData={partRetrieveObject}
                                    tableType={"deviceHealthStatus"}
                                />
                            </>
                        ) : (
                            <div style={{ margin: 'auto', textAlign: 'center', alignItems: 'center', color: 'red' }}>
                                <h2> No partial retrieve data for the selected data </h2>
                            </div>
                        )
                    }
                </div>

            </div>
        </div>
    )
}

export default PartialUserData;
