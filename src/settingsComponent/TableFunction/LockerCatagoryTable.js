import { React, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import { MdDelete } from "react-icons/md";
import ClipLoader from "react-spinners/ClipLoader";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import "./LockerCatagoryTable.css";
import PathUrl from "../../GlobalVariable/urlPath.json";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useRef } from "react";
import { DownloadTableExcel } from "react-export-table-to-excel";
import { Button, setRef } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteIcon from "@mui/icons-material/Delete";
import { tab } from "@testing-library/user-event/dist/tab";
import { useEffect } from "react";

import BlockIcon from "@mui/icons-material/Block";
import { useAuth } from "../../utils/Auth";

const LockerCatagoryTable = (props) => {
  const [loading, setloading] = useState(false);

  // for the dailogue of doanloadable xlsheet

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    // tableXlData.current = null;
    setOpen(true);
  };

  const handleClose = () => {
    // tableXlData.current = null;
    setOpen(false);
  };

  const Auth = useAuth();

  const amount = useRef(0);
  const excessAmount = useRef(0);
  const TotAmountIncldingGST = useRef(0);
  const CGST = useRef(0);
  const SGST = useRef(0);
  const TotAmountExcludingGST = useRef(0);
  const c_balance = useRef(0);
  const totPartRetrieveAmount = useRef(0);

  const tableXlData = useRef(null);

  useEffect(() => {
    excessAmount.current = 0;
    amount.current = 0;
    TotAmountExcludingGST.current = 0;
    CGST.current = 0;
    SGST.current = 0;
    c_balance.current = 0;
    TotAmountIncldingGST.current = 0;
    totPartRetrieveAmount.current = 0;
  }, [props, tableXlData.current, open]);

  // useEffect(() => {
  //   tableXlData.current = null;
  // }, [tableXlData.current]);

  const updateCalculatingTotalValues = (
    eAmount,
    amnt,
    totAmntWithGST,
    cGST,
    sGST,
    totAmntWithoutGST,
    bal
  ) => {
    console.log("called here : " + bal);
    excessAmount.current = excessAmount.current + eAmount;
    amount.current = amount.current + amnt;
    c_balance.current = c_balance.current + bal;
    TotAmountExcludingGST.current =
      TotAmountExcludingGST.current + totAmntWithoutGST;
    CGST.current = CGST.current + cGST;
    SGST.current = SGST.current + sGST;
    TotAmountIncldingGST.current =
      TotAmountIncldingGST.current + totAmntWithGST;
  };

  const jsonData = props.tableData; //table data is sent from parent object LockerLockCatagory to this child class
  const arrayValue = Object.values(jsonData);
  const tableType = props.tableType;
  // console.log(jsonData);
  let jsonArrayTableValues;

  const deleteTableRow = (tddata) => {
    setloading(true);
    const slno = tddata[0];
    // const deleteTableRow =
    //   "http://192.168.0.198:8080/AuroAutoLocker/DeleteAndUpdateLockerLockDetails";
    fetch(
      Auth.serverPaths.localAdminPath +
        "?DeleteAndUpdateLockerLockDetailsslno=" +
        slno,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          props.fetchtableFun();
        } else {
          alert("error occured");
        }
      })
      .catch((err) => console.log("err : " + err));
    setloading(false);
  };

  // self executing function
  (function () {
    jsonArrayTableValues = [];
    //converting table from row to colums ex [[2,4,6],[1,3,5]] can be converted to [[2,1],[4,4],[6,5]]

    //keys for the table head and values for the table column
    for (let n1 = 0; n1 < arrayValue[0].length; n1++) {
      let content = [];

      for (let n2 = 0; n2 < arrayValue.length; n2++) {
        content.push(arrayValue[n2][n1]);
      }
      jsonArrayTableValues.push(content);
    }
  })();

  let renderTableBody = () => {
    if (tableType === "lockerLocksDetails") {
      return (
        <>
          {jsonArrayTableValues.map((tableValues, index) => {
            return (
              <tr key={index}>
                {tableValues.map((tableValue, index) => {
                  return (
                    <td className="td-data" key={index}>
                      {tableValue}
                    </td>
                  );
                })}
                {/* <td>
                  {loading ? (
                    <button className="del-icon-table isloading-true">
                      <ClipLoader color="#002970" />{" "}
                    </button>
                  ) : (
                    <button
                      onClick={() => deleteTableRow(tableValues)}
                      className="del-icon-table"
                    >
                      <MdDelete 
                      size="30" 
                      color="#ff858f" />
                    </button>
                  )}
                </td> */}
              </tr>
            );
          })}
        </>
      );
    } else if (tableType === "transactionDetails") {
      return (
        <>
          {jsonArrayTableValues.map((tableValues, index) => {
            return (
              <>
                <tr key={index}>
                  {tableValues.map((tableValue, index) => {
                    return (
                      <td
                        className={
                          tableValues[7] === "transit" ? "td-open" : "td-data"
                        }
                        key={index}
                      >
                        {tableValue}
                      </td>
                    );
                  })}
                  <td>
                    {loading ? (
                      <button className="del-icon-table isloading-true">
                        <ClipLoader color="#002970" />{" "}
                      </button>
                    ) : (
                      <button className="del-icon-table">
                        <AiOutlineExclamationCircle
                          onClick={(e) =>
                            props.manualOverrideFun(
                              tableValues[2], // customer Name
                              tableValues[3], // mobile number
                              tableValues[1], //terminal id
                              tableValues[10], // locker number
                              tableValues[5], // dateOfOpen,
                              tableValues[20], // for amount
                              tableValues[12], //excess-amount
                              tableValues[7], // status
                              e
                            )
                          }
                          size="30"
                          color="#ff858f"
                        />
                      </button>
                    )}
                  </td>
                </tr>

                {updateCalculatingTotalValues(
                  tableValues[12], // excess amount
                  tableValues[4], // amount
                  tableValues[20], // tot amount with gst
                  tableValues[18], // cgst
                  tableValues[19], // sgst
                  tableValues[17], // tot amount without gst
                  tableValues[15] // balance
                )}
              </>
            );
          })}

          <tr className="Total_Calculations">
            <td>-</td>
            <td>
              <b>TOTAL :</b>
            </td>
            <td>-</td>
            <td>-</td>
            <td>
              <b>{amount.current} Rs</b>
            </td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>
              <b>{excessAmount.current} Rs</b>
            </td>
            <td>-</td>
            <td>-</td>
            <td>
              <b>{c_balance.current} Rs</b>
            </td>
            <td>-</td>
            <td>
              <b>
                {Math.round(Number(TotAmountExcludingGST.current) * 100) / 100}{" "}
                Rs
              </b>
            </td>
            <td>
              <b>{Math.round(Number(CGST.current) * 100) / 100} Rs</b>
            </td>
            <td>
              <b>{Math.round(Number(SGST.current) * 100) / 100} Rs</b>
            </td>
            <td>
              <b>
                {Math.round(Number(TotAmountIncldingGST.current) * 100) / 100}{" "}
                Rs
              </b>
            </td>
            <td>-</td>
          </tr>
        </>
      );
    } else if (tableType === "transactionDetailsHistory") {
      return (
        <>
          {jsonArrayTableValues.map((tableValues, index) => {
            return (
              <>
                <tr key={index}>
                  {tableValues.map((tableValue, index) => {
                    return (
                      <td className="td-data" key={index}>
                        {tableValue}
                      </td>
                    );
                  })}
                  <td
                    style={{
                      padding: "15px",
                    }}
                    className="td-data"
                  >
                    <InfoOutlinedIcon
                      sx={{
                        cursor: "pointer",
                      }}
                      fontSize="large"
                      color="primary"
                      onClick={(e) =>
                        props.manualOverrideTDhostoryFun(
                          tableValues[1], // mobile number
                          tableValues[7], // locker number
                          tableValues[5], // terminal id
                          tableValues[3], // date of open
                          tableValues[4], // time of open
                          e
                        )
                      }
                    />
                  </td>
                </tr>
                {updateCalculatingTotalValues(
                  tableValues[15], // excess amount
                  tableValues[17], // amount
                  tableValues[21], // tot amount with gst
                  tableValues[19], // cgst
                  tableValues[20], // sgst
                  tableValues[18], // tot amount without gst
                  tableValues[16] // bal
                )}
              </>
            );
          })}

          <tr className="Total_Calculations">
            <td>-</td>
            <td>
              <b>TOTAL :</b>
            </td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>

            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>

            <td>
              <b>{excessAmount.current} Rs</b>
            </td>

            <td>-</td>

            <td>
              <b>{amount.current} Rs</b>
            </td>

            <td>
              <b>
                {Math.round(Number(TotAmountExcludingGST.current) * 100) / 100}{" "}
                Rs
              </b>
            </td>
            <td>
              <b>{Math.round(Number(CGST.current) * 100) / 100} Rs</b>
            </td>
            <td>
              <b>{Math.round(Number(SGST.current) * 100) / 100} Rs</b>
            </td>
            <td>
              <b>
                {Math.round(Number(TotAmountIncldingGST.current) * 100) / 100}{" "}
                Rs
              </b>
            </td>
            <td>-</td>
          </tr>
        </>
      );
    } else if (tableType === "deviceHealthStatus") {
      return (
        <>
          {jsonArrayTableValues.map((tableValues, index) => {
            return (
              <tr key={index}>
                {tableValues.map((tableValue, index) => {
                  return (
                    <td
                      className={
                        tableValues[7] === "inactive" ? "td-open" : "td-data"
                      }
                      key={index}
                    >
                      {tableValue}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </>
      );
    } else if (tableType === "lockerStatus") {
      return (
        <>
          {jsonArrayTableValues.map((tableValues, index) => {
            return (
              <tr key={index}>
                {tableValues.map((tableValue, index) => {
                  return (
                    <td
                      className={
                        tableValues[10] === "Open" ? "td-open" : "td-data"
                      }
                      key={index}
                    >
                      {tableValue}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </>
      );
    } else if (tableType === "refundTransactionDetails") {
      return (
        <>
          {jsonArrayTableValues.map((tableValues, index) => {
            return (
              <tr key={index}>
                {tableValues.map((tableValue, index) => {
                  return (
                    <td className="td-data" key={index}>
                      {tableValue}
                    </td>
                  );
                })}
                <td className="td-data">
                  <button className="del-icon-table">
                    <AiOutlineExclamationCircle
                      size="30"
                      color="#ff858f"
                      onClick={(e) =>
                        props.selectRowFun(
                          tableValues[2],
                          tableValues[3],
                          tableValues[4],
                          tableValues[5],
                          tableValues[6],
                          tableValues[8],
                          tableValues[7],
                          tableValues[11],
                          tableValues[1],
                          e
                        )
                      }
                    />
                  </button>
                </td>
              </tr>
            );
          })}
        </>
      );
    } else if (tableType === "failedTransaction") {
      return (
        <>
          {jsonArrayTableValues.map((tableValues, index) => {
            return (
              <tr key={index}>
                {tableValues.map((tableValue, index) => {
                  return (
                    <td className={"td-data"} key={index}>
                      {tableValue}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </>
      );
    } else if (
      tableType === "lossedCustomers" ||
      tableType === "partiallocks" ||
      tableType === "refundhistory" ||
      tableType === "SITE_TABLE"
      // || tableType === "users"
    ) {
      return (
        <>
          {jsonArrayTableValues.map((tableValues, index) => {
            return (
              <tr key={index}>
                {tableValues.map((tableValue, index) => {
                  return (
                    <td className={"td-data"} key={index}>
                      {tableValue}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </>
      );
    } else if (tableType === "blockedCustomers") {
      return (
        <>
          {jsonArrayTableValues.map((tableValues, index) => {
            return (
              <tr key={index}>
                {tableValues.map((tableValue, index) => {
                  return (
                    <td className={"td-data"} key={index}>
                      {tableValue}
                    </td>
                  );
                })}
                <td className="td-data">
                  <button className="del-icon-table">
                    <BlockIcon
                      size="30"
                      sx={{
                        color: "crimson",
                      }}
                      onClick={(e) =>
                        props.blockUSerHandler(
                          tableValues[0],
                          tableValues[1],
                          tableValues[2],
                          tableValues[7],
                          e
                        )
                      }
                    />
                  </button>
                </td>
              </tr>
            );
          })}
        </>
      );
    } else if (tableType === "firmwareobjects") {
      return (
        <>
          {jsonArrayTableValues.map((tableValues, index) => {
            return (
              <tr key={index}>
                {tableValues.map((tableValue, index) => {
                  return (
                    <td className={"td-data"} key={index}>
                      {tableValue}
                    </td>
                  );
                })}
                <td className="td-data">
                  <button className="del-icon-table">
                    <DeleteIcon
                      size="30"
                      sx={{
                        color: "crimson",
                      }}
                      onClick={(e) =>
                        props.selectedRowFun(
                          tableValues[0],
                          tableValues[1],
                          tableValues[2],
                          e
                        )
                      }
                    />
                  </button>
                </td>
              </tr>
            );
          })}
        </>
      );
    } else if (tableType === "users") {
      return (
        <>
          {jsonArrayTableValues.map((tableValues, index) => {
            return (
              <tr key={index}>
                {tableValues.map((tableValue, index) => {
                  return (
                    <td className={"td-data"} key={index}>
                      {tableValue}
                    </td>
                  );
                })}
                <td className="td-data">
                  <button className="del-icon-table">
                    <DeleteIcon
                      size="30"
                      sx={{
                        color: "crimson",
                      }}
                      onClick={(e) =>
                        props.selectedRowFun(tableValues[0], tableValues[1], e)
                      }
                    />
                  </button>
                </td>
              </tr>
            );
          })}
        </>
      );
    } else if (tableType === "mallAuthHist") {
      return (
        <>
          {jsonArrayTableValues.map((tableValues, index) => {
            return (
              <>
                <tr key={index}>
                  {tableValues.map((tableValue, index) => {
                    return (
                      <>
                        <td className={"td-data"} key={index}>
                          {tableValue}
                        </td>
                      </>
                    );
                  })}
                </tr>

                {updateCalculatingTotalValues(
                  tableValues[9],
                  tableValues[8],
                  tableValues[12],
                  tableValues[13],
                  tableValues[14],
                  tableValues[15],
                  tableValues[10]
                )}
              </>
            );
          })}
          <tr className="Total_Calculations">
            <td>-</td>
            <td>
              <b>TOTAL :</b>
            </td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>
              <b>{excessAmount.current} Rs</b>
            </td>
            <td>
              <b>{amount.current} Rs</b>
            </td>
            <td>
              <b>{c_balance.current} Rs</b>
            </td>
            <td>-</td>
            <td>
              <b>
                {Math.round(Number(TotAmountIncldingGST.current) * 100) / 100}{" "}
                Rs
              </b>
            </td>
            <td>
              <b>{Math.round(Number(CGST.current) * 100) / 100} Rs</b>
            </td>
            <td>
              <b>{Math.round(Number(SGST.current) * 100) / 100} Rs</b>
            </td>
            <td>
              <b>
                {Math.round(Number(TotAmountExcludingGST.current) * 100) / 100}{" "}
                Rs
              </b>
            </td>
          </tr>
        </>
      );
    }
  };

  return (
    <>
      {tableType === "mallAuthHist" && (
        <Button
          variant="outlined"
          color="inherit"
          onClick={handleClickOpen}
          sx={{ mb: "15px", textAlign: "center" }}
        >
          Download as Xl Sheet
        </Button>
      )}

      <div className="locker-table-container">
        <table className="table-conteiner table" ref={tableXlData}>
          <thead className="table-head">
            <tr>
              {tableType === "transactionDetailsHistory" ||
              tableType === "transactionDetails" ? (
                <>
                  {Object.keys(jsonData).map((tableHeader) => {
                    return (
                      <th scope="col" key={tableHeader}>
                        {tableHeader}
                      </th>
                    );
                  })}
                  <th></th>
                </>
              ) : tableType === "lockerStatus" ? (
                Object.keys(jsonData).map((tableHeader) => {
                  return (
                    <th scope="col" key={tableHeader}>
                      {tableHeader}
                    </th>
                  );
                })
              ) : tableType === "deviceHealthStatus" ||
                tableType === "failedTransaction" ||
                tableType === "lossedCustomers" ||
                tableType === "partiallocks" ||
                // tableType === "users" ||
                tableType === "mallAuthHist" ||
                tableType === "SITE_TABLE"  ||
                tableType === "refundhistory" ? (
                Object.keys(jsonData).map((tableHeader) => {
                  return (
                    <th scope="col" key={tableHeader}>
                      {tableHeader}
                    </th>
                  );
                })
              ) : (
                <>
                  {Object.keys(jsonData).map((tableHeader) => {
                    return (
                      <th scope="col" key={tableHeader}>
                        {tableHeader}
                      </th>
                    );
                  })}
                  <th></th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="table-body">{renderTableBody()}</tbody>
        </table>
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Confirm here to download the XLSheet of Transaction History that is
            Displaying on table
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" color="inherit" onClick={handleClose}>
            Cancel
          </Button>
          <DownloadTableExcel
            currentTableRef={tableXlData.current}
            sheet="transaction history"
            filename="User-Transaction-History"
          >
            <Button variant="outlined" color="success" onClick={handleClose}>
              Confirm
            </Button>
          </DownloadTableExcel>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default LockerCatagoryTable;
