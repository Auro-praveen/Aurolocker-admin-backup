import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

import { DownloadTableExcel } from "react-export-table-to-excel";
import { Button } from "@mui/material";
import { getCurrentDateSQL } from "../GlobalVariable/GlobalModule";

// const columns = [
//   { id: 'name', label: 'Name', minWidth: 170 },
//   { id: 'code', label: 'ISO\u00a0Code', minWidth: 100 },
//   {
//     id: 'population',
//     label: 'Population',
//     minWidth: 170,
//     align: 'right',
//     format: (value) => value.toLocaleString('en-US'),
//   },
//   {
//     id: 'size',
//     label: 'Size\u00a0(km\u00b2)',
//     minWidth: 170,
//     align: 'right',
//     format: (value) => value.toLocaleString('en-US'),
//   },
//   {
//     id: 'density',
//     label: 'Density',
//     minWidth: 170,
//     align: 'right',
//     format: (value) => value.toFixed(2),
//   },
// ];

// const columns = ["name", "code", "population", "size", "density"];

function createData(name, code, population, size) {
  const density = population / size;
  return { name, code, population, size, density };
}

// const rows = [
//   createData("India", "IN", 1324171354, 3287263),
//   createData("China", "CN", 1403500365, 9596961),
//   createData("Italy", "IT", 60483973, 301340),
//   createData("United States", "US", 327167434, 9833520),
//   createData("Canada", "CA", 37602103, 9984670),
//   createData("Australia", "AU", 25475400, 7692024),
//   createData("Germany", "DE", 83019200, 357578),
//   createData("Ireland", "IE", 4857000, 70273),
//   createData("Mexico", "MX", 126577691, 1972550),
//   createData("Japan", "JP", 126317000, 377973),
//   createData("France", "FR", 67022000, 640679),
//   createData("United Kingdom", "GB", 67545757, 242495),
//   createData("Russia", "RU", 146793744, 17098246),
//   createData("Nigeria", "NG", 200962417, 923768),
//   createData("Brazil", "BR", 210147125, 8515767),
// ];

export default function TableDataWithPagination(props) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const tableRef = React.useRef();
  const [open, setOpen] = React.useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const columns = props.tablecolumns;
  const rows = props.tablerows;

  // console.log("inside te adsjhflaiksjdhf askjdflksjdf");

  // console.log(columns);
  // console.log(rows);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleEventChange = (singleRow) => {
    console.log(singleRow);
    props.handleClickEvent(singleRow);
  };

  const handleClose = () => {
    // tableXlData.current = null;
    setOpen(false);
  };

  const handleClickOpen = () => {
    // tableXlData.current = null;
    setOpen(true);
  };

  return (
    <>
      <Paper
        sx={{
          width: "95%",
          overflow: "hidden",
          textAlign: "center",
          m: "auto",
        }}
      >
        {props.tableType === "NON-OPERATIONAL-TABLE" && (
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleClickOpen}
            sx={{ mb: "15px", textAlign: "center" }}
          >
            Download as Xl Sheet
          </Button>
        )}

        <TableContainer sx={{ maxHeight: 550 }}>
          <Table stickyHeader aria-label="sticky table" ref={tableRef}>
            <TableHead
              style={{
                color: "crimson",
                fontWeight: "500",
              }}
            >
              <TableRow
                style={{
                  color: "crimson",
                  fontWeight: "500",
                }}
              >
                {columns.map((column, index) => (
                  <TableCell
                    key={index}
                    align={"center"}
                    //   style={{ minWidth: column.minWidth }}
                  >
                    {/* {column.label} */}
                    {column}
                  </TableCell>
                ))}

                {props.tableType === "OPERATIONAL-TABLE" && (
                  <TableCell
                    key={columns.length + "icon-h"}
                    align={"center"}
                    //   style={{ minWidth: column.minWidth }}
                  >
                    {/* {column.label} */}
                    {""}
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    >
                      {columns.map((column, index) => {
                        const value = row[column];
                        return (
                          <TableCell key={index} align={"center"}>
                            {index === 16
                              ? value > 0
                                ? "TRUE"
                                : "FALSE"
                              : value !== undefined || value !== null
                              ? value
                              : ""}
                          </TableCell>
                        );
                      })}

                      {props.tableType === "OPERATIONAL-TABLE" && (
                        <TableCell key={"icon"} align={"center"}>
                          {/* {column && typeof value === 'number'
                              ? column.format(value)
                              : value} */}
                          <ManageAccountsIcon
                            onClick={() => handleEventChange(row)}
                            color="secondary"
                            sx={{
                              cursor: "pointer",
                            }}
                          />
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
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
            currentTableRef={tableRef.current}
            sheet="transaction history"
            filename={"Followup-details-" + getCurrentDateSQL()}
          >
            <Button variant="outlined" color="success" onClick={handleClose}>
              Confirm
            </Button>
          </DownloadTableExcel>
        </DialogActions>
      </Dialog>
    </>
  );
}
