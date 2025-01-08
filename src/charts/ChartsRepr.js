/*
  
  @Auther : PRAVEEN 
 all the locker operations for displaying charts are done in this single page
  operations included 
  1) current occupacy representation
  2) Transaction history from date to the to Date ternimal id wise graphical representation
  3) total amount collected from from-Date to to-Date from provided terminalid's
  4) locker-description for all terminalid's (occupied-locks, available-locks, mall-function-locks) for all terminal id's
  5) locker type collection from provided terminalid's , from-date and to-date (most used lockers) (small,medium, large,elarge)


*/

import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import "./charts.css";
import PathUrl from "../GlobalVariable/urlPath.json";
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  NativeSelect,
  OutlinedInput,
  Select,
  TextField,
  useTheme,
} from "@mui/material";
import Navbar from "../mainDashBoard/Navbar";
import { useAuth } from "../utils/Auth";
import LockerTypeCollectionPieChart from "./LockerTypeCollectionPieChart";
import StackedColumnChart from "./StackedColumnChart";

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

const ChartsRepr = () => {
  const [selectedBtnVal, setSelectedBtnVal] = useState("");
  const [allTerminalId, setAllTerminalId] = useState([]);

  const [selectedItems, setSelectedItems] = useState({
    fromDate: "",
    toDate: "",
  });

  const [totalLockersInEachTerminalId, setTotalLockersInEachTerminalId] =
    useState({});

  const [isDataPresent, setIsDataPresent] = useState(false);
  const [selectedTerminalId, setSelectedTerminalId] = useState([]);
  const [isDateWrong, setIsDateWrong] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // for the total transaction history collection betweeen selected date

  const [isTotalAmountPieChartPresent, setIsTotalAmountPieChartPresent] =
    useState(false);

  const [isTotAmountPieChartLoaded, setIsTotAmountPieChartLoaded] =
    useState(false);

  const [totAmountCollection, setTotAmountcollection] = useState({
    terminalIds: [],
    totAmntTermIdVice: [],
    totAmountFromAllTermId: "",
  });

  // for lockers detail from all ther terminal id
  // will be stored as available, occupied, malfuncion locks in an array
  const [allTerminalIdLockerDetails, setAllTerminalIdLockerDetails] = useState({
    allLockerSeries: [],
    totalLockersFromAllTerminalId: "",
  });

  const [terminalWiseLockerType, setTerminalWiseLockerMapping] = useState({
    lockerTypeName: {},
    lockerTypeAmount: {},
  });

  const [isTerminalWiseLockerTypePresent, setIsTerminalWiseLockerPresent] =
    useState(false);

  const [allLockerDetailsTerminalIdWise, setAllLockerDetailsTerminalIdWise] =
    useState({});

  const [allLockerTypeNames, setAllLockerTypeNames] = useState([]);
  const [allLockerTypeCltn, setAllLockertypeCltn] = useState([]);

  const Auth = useAuth();
  useEffect(() => {
    if (!Auth.user) {
      Auth.logoutHandler();
    }
  }, []);

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

  const [totalLockerOccupacyCount, setTotalLockerOccupacyCount] = useState({
    termiseLockerCount: {},
    totLockSeriesType: [],
    totLockSeriesCount: [],
    isTermWiseLockerOccupacyCountActive: false,
  });

  // for the active transaction charts bar chart
  const [chartOptions, setChartOptions] = useState({
    chartType: {
      chart: {
        id: "basic-bar",
      },
      title: {
        text: "All Active Transaction",
        style: {
          color: "#243a87",
          fontFamily: "san-serif",
        },
      },
      xaxis: {
        categories: [],
        title: {
          text: "terminal ID",
          style: {
            color: "#db1d1d",
          },
        },
      },
      yaxis: {
        title: {
          text: "active transaction",

          style: {
            color: "#db1d1d",
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 25,
        },
      },
    },
    series: [
      {
        data: [],
        name: "current-active-transaction",
        color: "#ff0000",
      },
    ],
  });

  // fot the transaction history chart line chart
  const [historyChartOptions, setHistoryChartOptions] = useState({
    series: [
      {
        name: "",
        data: [],
      },
      {
        name: "",
        data: [],
      },
    ],
    options: {
      chart: {
        zoom: {
          enabled: true,
        },
      },
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "straight",
      },
      title: {
        text: "Graphical representation for selecte date",
        align: "left",
        style: {
          color: "#243a87",
          fontFamily: "san-serif",
        },
      },
      grid: {
        row: {
          // colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.2,
        },
      },
      xaxis: {
        categories: [],
      },
    },
  });

  // for the total amount collection terminal id vice chart pie chart

  const [termIdviceAmntPieChart, setTermIdviceAmntpieChart] = useState({
    series: [],
    options: {
      chart: {
        width: 400,
        type: "pie",
      },
      title: {
        text: "pie chart for total terminalId vice collection",
        align: "center",
        style: {
          color: "#243a87",
          fontFamily: "san-serif",
        },
      },
      labels: [],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  });

  const theme = useTheme();

  const handleBtnSelect = (val) => {
    setSelectedBtnVal(val);

    if (val === "current-occupacy") {
      const reqObj = {
        PacketType: "activetransaction",
      };

      getTransactionDetailsFromDb(reqObj);
    } else if (
      val === "transaction-history" ||
      val === "total-collection" ||
      val === "locker-type-occupacy"
    ) {
      if (allTerminalId.length < 1) {
        const reqObj = {
          PacketType: "gettermid",
        };
        getTransactionDetailsFromDb(reqObj);
      }
    } else if (val === "locker-details") {
      const reqObj = {
        PacketType: "lockersdet",
      };

      getTransactionDetailsFromDb(reqObj);
    }

    if (selectedBtnVal !== val) {
      setIsDataPresent(false);
      setIsDateWrong(true);
      setSelectedTerminalId([]);
      setSelectedItems({
        fromDate: "",
        toDate: "",
      });
    }

    setTotalLockerOccupacyCount({
      isTermWiseLockerOccupacyCountActive: false,
      termiseLockerCount: {},
      totLockSeriesCount: [],
      totLockSeriesType: [],
    });
  };

  const getTransactionDetailsFromDb = (reqObj) => {
    console.log(reqObj);

    fetch(
      reqObj.PacketType === "gettermid"
        ? serverPaths.localAdminPath + "FetchTransactionDetails"
        : serverPaths.localAdminPath + "FetchLockersForChart",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: JSON.stringify(reqObj),
      }
    )
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        if (data.responseCode === "activetd") {
          setChartOptions({
            ...chartOptions,
            chartType: {
              ...chartOptions.chartType,
              xaxis: {
                ...chartOptions.chartType.xaxis,
                categories: data.terminalId,
              },
            },
            series: [
              {
                data: data.activeTd,
                name: "current-active-transaction",
                color: "#ff0000",
              },
            ],
          });
        } else if (data.responseCode === "avltd-200") {
          setAllTerminalId(["all", ...data.terminalID]);
        } else if (
          data.responseCode === "tdhist-200" ||
          data.responseCode === "thcltn-200"
        ) {
          let seriesJsonArray = [];
          let bookingDateArr = [];
          let count = 0;

          // mapping here using key and value converting them to json object, for processing the data in chart

          Object.entries(data).map(([termId, subJsonObj]) => {
            if (
              termId !== "responseCode" &&
              termId !== "termtotcltn" &&
              termId !== "totcltn"
            ) {
              let totalBookingArr = [];

              Object.entries(subJsonObj).map(([key, valueMap]) => {
                const sortedJsonObject = JSON.parse(valueMap);
                console.log(sortedJsonObject);

                // console.log(typeof valusortedJsonObjecteMap);

                Object.entries(sortedJsonObject).map(
                  ([bookingDate, totalBooking]) => {
                    if (count === 0) {
                      bookingDateArr.push(bookingDate);
                    }
                    totalBookingArr.push(totalBooking);
                  }
                );
              });

              const seriesObj = {
                name: termId,
                data: [...totalBookingArr],
              };

              seriesJsonArray.push(seriesObj);
              count = count + 1;
            }
          });

          console.log(bookingDateArr);
          console.log(seriesJsonArray);

          setHistoryChartOptions({
            ...historyChartOptions,
            series: [...seriesJsonArray],
            options: {
              ...historyChartOptions.options,
              xaxis: {
                categories: [...bookingDateArr],
              },
            },
          });

          if (data.responseCode === "thcltn-200") {
            let totCollectionTermIdArr = [];
            let totCltnAmntArr = [];
            const termViceAmntCollection = JSON.parse(data.termtotcltn);
            Object.entries(termViceAmntCollection).map(([tId, tAmount]) => {
              totCollectionTermIdArr.push(tId);
              totCltnAmntArr.push(tAmount);
            });

            setTotAmountcollection({
              ...totAmountCollection,
              terminalIds: [...totCollectionTermIdArr],
              totAmntTermIdVice: [...totCltnAmntArr],
              totAmountFromAllTermId: data.totcltn,
            });
          }

          setIsDataPresent(true);
          setIsLoading(false);
        } else if (data.responseCode === "tdhist-404") {
          alert("no records found for provided data");
          setHistoryChartOptions({
            ...historyChartOptions,
            series: [],
            options: {
              ...historyChartOptions.options,
              xaxis: {
                categories: [],
              },
            },
          });
          setIsDataPresent(false);
          setIsLoading(false);
        } else if (data.responseCode === "lock-details") {
          setTermIdviceAmntpieChart({
            ...termIdviceAmntPieChart,
            options: {
              ...termIdviceAmntPieChart.options,
              labels: [...data.lockersMappedAs],
              title: {
                ...termIdviceAmntPieChart.options.title,
                text: "locker status terminal wise",
              },
            },
          });

          setAllTerminalIdLockerDetails({
            ...allTerminalIdLockerDetails,
            allLockerSeries: data.alllocksDetails,
            totalLockersFromAllTerminalId: data.totallLocks,
          });
          if (data.terminalwiseLocks) {
            console.log(data.terminalwiseLocks);

            setAllLockerDetailsTerminalIdWise({
              ...data.terminalwiseLocks,
            });
            // Object.entries(data.terminalwiseLocks).map(([key, valArr]) => {
            //   // redusing an array to extract array and total locker object from it

            //   console.log(key + " --- " + valArr);
            //   setAllLockerDetailsTerminalIdWise({
            //     ...allLockerDetailsTerminalIdWise,
            //     [key]: [...valRedArr],
            //   });

            //   Object.entries(valRedObject).map(([keyTerm, totalVal]) => {
            //     setTotalLockersInEachTerminalId({
            //       ...totalLockersInEachTerminalId,
            //       [keyTerm]: totalVal,
            //     });
            //   });
            // });
          }
        } else if (data.responseCode === "loc-type-200") {
          // praveen 26-06-2023
          // all the operations for total collection locker wise (small-medium-large-elarge) all the operation is done here

          const lockerTypeWiseCollectionObject = JSON.parse(
            data.lockTypeDetails
          );

          let tWiseLockTypeCollectionObject = {};
          let tWiseLockTypeObject = {};

          Object.entries(lockerTypeWiseCollectionObject).map(
            ([termId, lockTypeObject]) => {
              let lockerTypeArr = [];
              // console.log(termId)
              // console.log(typeof(lockTypeObject))
              Object.entries(lockTypeObject).map(([type, amount]) => {
                console.log("type : " + type);
                lockerTypeArr.push(type);
              });

              if (lockerTypeArr.length === 2) {
                if (
                  lockerTypeArr.includes("Small") &&
                  lockerTypeArr.includes("Medium")
                ) {
                  tWiseLockTypeCollectionObject = {
                    ...tWiseLockTypeCollectionObject,
                    [termId]: [lockTypeObject.Small, lockTypeObject.Medium],
                  };

                  tWiseLockTypeObject = {
                    ...tWiseLockTypeObject,
                    [termId]: ["Small", "Medium"],
                  };
                } else if (
                  lockerTypeArr.includes("Small") &&
                  lockerTypeArr.includes("Large")
                ) {
                  tWiseLockTypeCollectionObject = {
                    ...tWiseLockTypeCollectionObject,
                    [termId]: [lockTypeObject.Small, lockTypeObject.Large],
                  };

                  tWiseLockTypeObject = {
                    ...tWiseLockTypeObject,
                    [termId]: ["Small", "Large"],
                  };
                } else if (
                  lockerTypeArr.includes("Small") &&
                  lockerTypeArr.includes("eLarge")
                ) {
                  tWiseLockTypeCollectionObject = {
                    ...tWiseLockTypeCollectionObject,
                    [termId]: [lockTypeObject.Small, lockTypeObject.eLarge],
                  };

                  tWiseLockTypeObject = {
                    ...tWiseLockTypeObject,
                    [termId]: ["Small", "eLarge"],
                  };
                } else if (
                  lockerTypeArr.includes("Medium") &&
                  lockerTypeArr.includes("Large")
                ) {
                  tWiseLockTypeCollectionObject = {
                    ...tWiseLockTypeCollectionObject,
                    [termId]: [lockTypeObject.Medium, lockTypeObject.Large],
                  };

                  tWiseLockTypeObject = {
                    ...tWiseLockTypeObject,
                    [termId]: ["Medium", "Large"],
                  };
                } else if (
                  lockerTypeArr.includes("Medium") &&
                  lockerTypeArr.includes("eLarge")
                ) {
                  tWiseLockTypeCollectionObject = {
                    ...tWiseLockTypeCollectionObject,
                    [termId]: [lockTypeObject.Medium, lockTypeObject.eLarge],
                  };

                  tWiseLockTypeObject = {
                    ...tWiseLockTypeObject,
                    [termId]: ["Medium", "eLarge"],
                  };
                } else if (
                  lockerTypeArr.includes("Large") &&
                  lockerTypeArr.includes("eLarge")
                ) {
                  tWiseLockTypeCollectionObject = {
                    ...tWiseLockTypeCollectionObject,
                    [termId]: [lockTypeObject.Large, lockTypeObject.eLarge],
                  };

                  tWiseLockTypeObject = {
                    ...tWiseLockTypeObject,
                    [termId]: ["Large", "eLarge"],
                  };
                }
              } else if (lockerTypeArr.length === 3) {
                if (
                  lockerTypeArr.includes("Small") &&
                  lockerTypeArr.includes("Medium") &&
                  lockerTypeArr.includes("Large")
                ) {
                  tWiseLockTypeCollectionObject = {
                    ...tWiseLockTypeCollectionObject,
                    [termId]: [
                      lockTypeObject.Small,
                      lockTypeObject.Medium,
                      lockTypeObject.Large,
                    ],
                  };

                  tWiseLockTypeObject = {
                    ...tWiseLockTypeObject,
                    [termId]: ["Small", "Medium", "Large"],
                  };
                } else if (
                  lockerTypeArr.includes("Small") &&
                  lockerTypeArr.includes("Medium") &&
                  lockerTypeArr.includes("eLarge")
                ) {
                  tWiseLockTypeCollectionObject = {
                    ...tWiseLockTypeCollectionObject,
                    [termId]: [
                      lockTypeObject.Small,
                      lockTypeObject.Medium,
                      lockTypeObject.eLarge,
                    ],
                  };

                  tWiseLockTypeObject = {
                    ...tWiseLockTypeObject,
                    [termId]: ["Small", "Medium", "eLarge"],
                  };
                } else if (
                  lockerTypeArr.includes("Large") &&
                  lockerTypeArr.includes("Medium") &&
                  lockerTypeArr.includes("eLarge")
                ) {
                  tWiseLockTypeCollectionObject = {
                    ...tWiseLockTypeCollectionObject,
                    [termId]: [
                      lockTypeObject.Medium,
                      lockTypeObject.Large,
                      lockTypeObject.eLarge,
                    ],
                  };

                  tWiseLockTypeObject = {
                    ...tWiseLockTypeObject,
                    [termId]: ["Medium", "Large", "eLarge"],
                  };
                }
              } else {
                tWiseLockTypeCollectionObject = {
                  ...tWiseLockTypeCollectionObject,
                  [termId]: [
                    lockTypeObject.Small,
                    lockTypeObject.Medium,
                    lockTypeObject.Large,
                    lockTypeObject.eLarge,
                  ],
                };

                tWiseLockTypeObject = {
                  ...tWiseLockTypeObject,
                  [termId]: ["Small", "Medium", "Large", "eLarge"],
                };
              }

              setAllLockerTypeNames(data.totLockTypeNames);
              setAllLockertypeCltn(data.totLockTypecltn);
            }
          );

          setTerminalWiseLockerMapping({
            lockerTypeAmount: { ...tWiseLockTypeCollectionObject },
            lockerTypeName: { ...tWiseLockTypeObject },
          });

          setIsTerminalWiseLockerPresent(true);

          console.log(tWiseLockTypeCollectionObject);
          console.log(tWiseLockTypeObject);

          console.log(lockerTypeWiseCollectionObject);
          setIsLoading(false);
        } else if (data.responseCode === "loc-type-404") {
          setIsTerminalWiseLockerPresent(false);
          setIsLoading(false);
        } else if (data.responseCode === "locker-occurancy-200") {
          // let lockType = JSON.parse(data.total_lCount);

          let lockTypeSeries = [];
          let lockCountSeries = [];
          Object.entries(data.total_lCount).map(([lType, lCount]) => {
            lockTypeSeries.push(lType);
            lockCountSeries.push(lCount);
          });

          console.log("===========----------============");
          console.log(lockCountSeries);
          console.log(lockTypeSeries);

          setTotalLockerOccupacyCount({
            ...totalLockerOccupacyCount,
            isTermWiseLockerOccupacyCountActive: true,
            termiseLockerCount: { ...JSON.parse(data.termwise_lCount) },
            totLockSeriesType: [...lockTypeSeries],
            totLockSeriesCount: [...lockCountSeries],
          });
          // setIsTerminalWiseLockerPresent(false)
          setIsLoading(false);
        } else if (data.responseCode === "locker-occurancy-202") {
          setIsLoading(false);
          setTotalLockerOccupacyCount({
            ...totalLockerOccupacyCount,
            isTermWiseLockerOccupacyCountActive: false,
            termiseLockerCount: {},
            // totLockerOccupacy: {},
            totLockSeriesCount: [],
            totLockSeriesType: [],
          });
        } else {
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.log("error : " + err);
        setIsLoading(false);
      });
  };

  const chartForTHistorySelectHandler = (e) => {
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

  const selectTerminalIDHandler = (e) => {
    const {
      target: { value },
    } = e;

    if (value.includes("all") || value.length === allTerminalId.length - 1) {
      setSelectedTerminalId(["all"]);
    } else {
      setSelectedTerminalId(
        // On autofill we get a stringified value.
        typeof value === "string" ? value.split(",") : value
      );
    }
  };

  const submitTransactionHistoryChart = () => {
    if (selectedTerminalId.length > 0) {
      setIsLoading(true);
      const reqObj = {
        ...selectedItems,
        PacketType: "getthchart",
        terminalID: [...selectedTerminalId],
      };
      getTransactionDetailsFromDb(reqObj);
    } else {
      alert("please provide all the details");
    }
  };

  const getAllCollectionsBtn = () => {
    if (selectedTerminalId.length > 0) {
      setIsLoading(true);
      const reqObj = {
        ...selectedItems,
        PacketType: "getthcltn",
        terminalID: [...selectedTerminalId],
      };
      getTransactionDetailsFromDb(reqObj);
    } else {
      alert("please provide all the details");
    }
  };

  const getAvarageLockerOccupacy = (packet) => {
    if (selectedTerminalId.length > 0) {
      setIsLoading(true);
      const reqObj = {
        ...selectedItems,
        // PacketType: "getlocksavg-occupacy",
        PacketType: packet,
        terminalID: [...selectedTerminalId],
      };
      getTransactionDetailsFromDb(reqObj);
    } else {
      alert("please provide all the details");
    }
  };

  const loadPieChartForTotalTermViceCollect = () => {
    if (isTotAmountPieChartLoaded) {
      setIsTotAmountPieChartLoaded(false);
    } else {
      setIsTotAmountPieChartLoaded(true);
      if (totAmountCollection.terminalIds.length > 0) {
        setIsTotalAmountPieChartPresent(true);
        setTermIdviceAmntpieChart({
          ...termIdviceAmntPieChart,
          series: [...totAmountCollection.totAmntTermIdVice],
          options: {
            ...termIdviceAmntPieChart.options,
            labels: [...totAmountCollection.terminalIds],
          },
        });
      } else {
        setIsTotalAmountPieChartPresent(false);
      }
    }
  };

  return (
    <div className="charts-container">
      <Navbar />
      <div className="components-below-navbar">
        <h2 className="page-header">Choose your charts here</h2>
        <ButtonGroup
          variant="contained"
          aria-label="outlined primary button group"
          className="btn-group-charts"
        >
          <Button
            className={
              selectedBtnVal === "current-occupacy"
                ? "mui-btn-group-selected"
                : "mui-btn-group-non-selected"
            }
            onClick={() => handleBtnSelect("current-occupacy")}
          >
            Current Occupacy
          </Button>
          <Button
            className={
              selectedBtnVal === "transaction-history"
                ? "mui-btn-group-selected"
                : "mui-btn-group-non-selected"
            }
            onClick={() => handleBtnSelect("transaction-history")}
          >
            Transaction History
          </Button>
          <Button
            className={
              selectedBtnVal === "total-collection"
                ? "mui-btn-group-selected"
                : "mui-btn-group-non-selected"
            }
            onClick={() => handleBtnSelect("total-collection")}
          >
            total-collection
          </Button>
          <Button
            className={
              selectedBtnVal === "locker-details"
                ? "mui-btn-group-selected"
                : "mui-btn-group-non-selected"
            }
            onClick={() => handleBtnSelect("locker-details")}
          >
            All-Locker-Details
          </Button>
          <Button
            className={
              selectedBtnVal === "locker-type-occupacy"
                ? "mui-btn-group-selected"
                : "mui-btn-group-non-selected"
            }
            onClick={() => handleBtnSelect("locker-type-occupacy")}
          >
            locker-type-occupacy
          </Button>
        </ButtonGroup>

        {selectedBtnVal === "current-occupacy" ? (
          <div className="chart-view">
            <Chart
              options={chartOptions.chartType}
              series={chartOptions.series}
              type="bar"
              width="500"
            />
          </div>
        ) : selectedBtnVal === "transaction-history" ? (
          <div className="history-chart-represent">
            <Box>
              <FormControl sx={{ width: 250, mt: 2 }} required>
                <InputLabel id="demo-multiple-chip-label">
                  Choose Terminal ID
                </InputLabel>
                <Select
                  labelId="demo-multiple-chip-label"
                  id="demo-multiple-chip"
                  multiple
                  name="terminalId"
                  value={selectedTerminalId}
                  onChange={(e) => selectTerminalIDHandler(e)}
                  input={
                    <OutlinedInput
                      id="select-multiple-chip"
                      label="Choose Terminal ID"
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
                  {allTerminalId.map((termid) => (
                    <MenuItem
                      key={termid}
                      value={termid}
                      style={getStyles(termid, allTerminalId, theme)}
                    >
                      {termid}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <div className="textfield-container">
                <TextField
                  variant="outlined"
                  label="From date"
                  type="date"
                  focused
                  name="fromDate"
                  value={selectedItems.fromDate}
                  required
                  onChange={(e) => chartForTHistorySelectHandler(e)}
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
                  onChange={(e) => chartForTHistorySelectHandler(e)}
                  sx={{
                    width: 250,
                    m: 1,
                  }}
                  helperText={isDateWrong ? "please select valid date" : ""}
                />
              </div>
              <div className="textfield-container">
                <Button
                  variant="contained"
                  color="success"
                  sx={{
                    width: 250,
                  }}
                  disabled={isDateWrong ? true : isLoading ? true : false}
                  onClick={() => submitTransactionHistoryChart()}
                >
                  submit
                </Button>
              </div>
            </Box>
            {isDataPresent && (
              <div className="chart-view">
                <Chart
                  options={historyChartOptions.options}
                  series={historyChartOptions.series}
                  type="line"
                  width="650"
                />
              </div>
            )}
          </div>
        ) : selectedBtnVal === "total-collection" ? (
          <div className="history-chart-represent">
            <Box>
              <FormControl sx={{ width: 250, mt: 2 }} required>
                <InputLabel id="demo-multiple-chip-label">
                  Choose Terminal ID
                </InputLabel>
                <Select
                  labelId="demo-multiple-chip-label"
                  id="demo-multiple-chip"
                  multiple
                  name="terminalId"
                  value={selectedTerminalId}
                  onChange={(e) => selectTerminalIDHandler(e)}
                  input={
                    <OutlinedInput
                      id="select-multiple-chip"
                      label="Choose Terminal ID"
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
                  {allTerminalId.map((termid) => (
                    <MenuItem
                      key={termid}
                      value={termid}
                      style={getStyles(termid, allTerminalId, theme)}
                    >
                      {termid}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <div className="textfield-container">
                <TextField
                  variant="outlined"
                  label="From date"
                  type="date"
                  focused
                  name="fromDate"
                  value={selectedItems.fromDate}
                  required
                  onChange={(e) => chartForTHistorySelectHandler(e)}
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
                  onChange={(e) => chartForTHistorySelectHandler(e)}
                  sx={{
                    width: 250,
                    m: 1,
                  }}
                  helperText={isDateWrong ? "please select valid date" : ""}
                />
              </div>
              <div className="textfield-container">
                <Button
                  variant="contained"
                  color="success"
                  sx={{
                    width: 250,
                  }}
                  disabled={isDateWrong ? true : isLoading ? true : false}
                  onClick={() => getAllCollectionsBtn()}
                >
                  submit
                </Button>
              </div>
            </Box>
            {isDataPresent && (
              <div className="totamount-charts">
                <div className="chart-view">
                  <Chart
                    options={historyChartOptions.options}
                    series={historyChartOptions.series}
                    type="line"
                    width="650"
                  />
                </div>
                <div className="textfield-container">
                  <Button
                    variant="contained"
                    color={isTotAmountPieChartLoaded ? "secondary" : "warning"}
                    sx={{
                      width: 250,
                    }}
                    onClick={() => loadPieChartForTotalTermViceCollect()}
                  >
                    {isTotAmountPieChartLoaded
                      ? "Hide TermId-wise Collection"
                      : "Tot TermId-wise Collection"}
                  </Button>
                </div>
                {isTotAmountPieChartLoaded &&
                  (isTotalAmountPieChartPresent ? (
                    <>
                      <div className="chart-view">
                        <Chart
                          options={termIdviceAmntPieChart.options}
                          series={termIdviceAmntPieChart.series}
                          type="pie"
                          width="350"
                        />
                      </div>
                      <div className="piechart-descr-total-collection">
                        <h6>
                          Total Collection From All TerminalId ={" "}
                          <b style={{ color: "crimson" }}>
                            {totAmountCollection.totAmountFromAllTermId}
                          </b>
                        </h6>
                        <h6>
                          Note : Provided Data is between{" "}
                          <b style={{ color: "crimson" }}>
                            {selectedItems.fromDate}
                          </b>{" "}
                          And{" "}
                          <b style={{ color: "crimson" }}>
                            {selectedItems.toDate}
                          </b>
                        </h6>
                      </div>
                    </>
                  ) : (
                    <h6>
                      No Data Is Presnet betweeen{" "}
                      <b style={{ color: "crimson" }}>
                        {selectedItems.fromDate}
                      </b>{" "}
                      And{" "}
                      <b style={{ color: "crimson" }}>{selectedItems.toDate}</b>
                      , Please Try different Date{" "}
                    </h6>
                  ))}
              </div>
            )}
          </div>
        ) : selectedBtnVal === "locker-details" ? (
          <div>
            <div className="piechart-groups">
              {Object.entries(allLockerDetailsTerminalIdWise).map(
                ([termID, valArr]) => (
                  <div className="chart-view">
                    <Chart
                      options={termIdviceAmntPieChart.options}
                      series={valArr}
                      type="pie"
                      width="350"
                      key={termID}
                    />
                    <div className="piechart-descr-total-collection">
                      <h6>
                        locker description for{" "}
                        <b style={{ color: "crimson" }}>{termID}</b>
                      </h6>
                    </div>
                  </div>
                )
              )}

              <div className="chart-view">
                <Chart
                  options={termIdviceAmntPieChart.options}
                  series={allTerminalIdLockerDetails.allLockerSeries}
                  type="pie"
                  width="450"
                />

                <div className="piechart-descr-total-collection">
                  <h6>
                    Locker details for all the lockers from all ther terminals.{" "}
                    <br />
                    Total lockers from all terminals :
                    <b style={{ color: "crimson" }}>
                      {allTerminalIdLockerDetails.totalLockersFromAllTerminalId}
                    </b>
                  </h6>
                </div>
              </div>
            </div>
          </div>
        ) : selectedBtnVal === "locker-type-occupacy" ? (
          <div className="history-chart-represent">
            <Box>
              <FormControl sx={{ width: 250, mt: 2 }} required>
                <InputLabel id="demo-multiple-chip-label">
                  Choose Terminal ID
                </InputLabel>
                <Select
                  labelId="demo-multiple-chip-label"
                  id="demo-multiple-chip"
                  multiple
                  name="terminalId"
                  value={selectedTerminalId}
                  onChange={(e) => selectTerminalIDHandler(e)}
                  input={
                    <OutlinedInput
                      id="select-multiple-chip"
                      label="Choose Terminal ID"
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
                  {allTerminalId.map((termid) => (
                    <MenuItem
                      key={termid}
                      value={termid}
                      style={getStyles(termid, allTerminalId, theme)}
                    >
                      {termid}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <div className="textfield-container">
                <TextField
                  variant="outlined"
                  label="From date"
                  type="date"
                  focused
                  name="fromDate"
                  value={selectedItems.fromDate}
                  required
                  onChange={(e) => chartForTHistorySelectHandler(e)}
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
                  onChange={(e) => chartForTHistorySelectHandler(e)}
                  sx={{
                    width: 250,
                    m: 1,
                  }}
                  helperText={isDateWrong ? "please select valid date" : ""}
                />
              </div>
              <div className="textfield-container">
                <Button
                  variant="contained"
                  color="success"
                  sx={{
                    width: 250,
                  }}
                  disabled={isDateWrong ? true : isLoading ? true : false}
                  onClick={() =>
                    getAvarageLockerOccupacy("lock-occupacy-count")
                  }
                //"lock-occupacy-count" for getting locker count by collection use "getlocksavg-occupacy" as parameter
                >
                  submit
                </Button>
              </div>
            </Box>
            {isTerminalWiseLockerTypePresent && (
              <div className="piechart-groups">
                {Object.entries(terminalWiseLockerType.lockerTypeName).map(
                  ([termID, lockerName]) => (
                    <LockerTypeCollectionPieChart
                      pieChartSeries={
                        terminalWiseLockerType.lockerTypeAmount[termID]
                      }
                      pieChartLabel={lockerName}
                      terminalID={termID}
                      key={termID}
                    />
                  )
                )}

                <div>
                  <LockerTypeCollectionPieChart
                    pieChartSeries={allLockerTypeCltn}
                    pieChartLabel={allLockerTypeNames}
                    terminalID={"All"}
                  />

                  {/* <div className="piechart-descr-total-collection">
                    <h6>
                      Locker type collection details for all the lockers from all the
                      terminals. <br />
                      {/* Total lockers from all terminals :
                      <b style={{ color: "crimson" }}>
                        {
                          allTerminalIdLockerDetails.totalLockersFromAllTerminalId
                        }
                      </b> 
                    </h6>
                  </div> */}
                </div>
              </div>
            )}
            <>
              {totalLockerOccupacyCount.isTermWiseLockerOccupacyCountActive && (
                <div>
                  <StackedColumnChart
                    termWiseLockerCount={
                      totalLockerOccupacyCount.termiseLockerCount
                    }
                  // totalLoockerCount={
                  //   totalLockerOccupacyCount.totLockerOccupacy
                  // }
                  />

                  <div className="piechart-groups">
                    <LockerTypeCollectionPieChart
                      pieChartSeries={
                        totalLockerOccupacyCount.totLockSeriesCount
                      }
                      pieChartLabel={totalLockerOccupacyCount.totLockSeriesType}
                      terminalID={"lcount"}
                    />
                  </div>
                </div>
              )}
            </>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default ChartsRepr;
