import LoginMainPage from "./loginPage/LoginMainPage";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import React, { useEffect } from "react";
import "./App.css";
import AvailableLockers from "./dashboardAvailableLockers/AvailableLockers";
import LockerDashBoardComp from "./dashboard/dashboardComp";
import TransactionDashboardCom from "./transactionDashboard/TransactionDashboardCom";

import SiteRegistrationCom from "./loginPage/siteRegistration/SiteRegCom";
import LockerLockCatagory from "./settingsComponent/LockerCatagory/LockerLockCatagory";
import DashboardContentComp from "./mainDashBoard/dashboardCards/dashboardContent";
import { AuthProvider } from "./utils/Auth";
import RequireAuth from "./utils/RequireAuth";
import { NoAccess } from "./noAccessWindow/NoAccess";
import { UserLogDetails } from "./utils/UserLogDetails";
import TerminalStatus from "./loginPage/terminalStatus/TerminalStatus";
import LockerStatus from "./lockerStatus/LockerStatus";
import LockerOperations from "./lockerOperations/LockerOperations";
import AmountRefund from "./transactionDashboard/amountRefund/AmountRefund";
import TDHistory from "./transactionDashboard/TDHistory";
import FailedTransactions from "./transactionDashboard/failedTransaction/FailedTransactions";
import UserHandler from "./loginPage/userCreation/UserHandler";
import Firmware from "./firmwareUpdate/Firmware";
import ChartsRepr from "./charts/ChartsRepr";
import HistoryDatatoXlsheet from "./toxlsheet/HistoryDatatoXlsheet";
import MallAuthHist from "./mallAuthority/MallAuthHist";
import MallAuth from "./mallAuthority/MallAuth";
import TestingFetch from "./TestingFetch";
import Test from "./charts/Test";
import Country from "./charts/Country";
import HandleLockerCategory from "./settingsComponent/LockerCatagory/HandleLockerCategory";
import LayoutTest from "./charts/LayoutTest";
import Malfun from "./lockerOperations/malfunctionLockers/Malfun";
import TestingHere from "./charts/TestingHere";
import HandleDataHere from "./toxlsheet/HandleDataHere";
import CommonLayoutForAll from "./lockerOperations/layoutsAccorsingTerminalId/CommonLayoutForAll";
import { encryptAES } from "./GlobalVariable/GlobalModule";
import CommonTempleLayouts from "./lockerOperations/temple_layouts/CommonTempleLayouts";

function App() {
  function someFunctionToBind(some) {}

  useEffect(() => {
    // const prices = [100, 200, 300, 500, 600]
    // const totAmountToSpend = 700
    // testFunction(prices, totAmountToSpend);
    // testFunction([
    //   ["London", "New York"],
    //   ["New York", "Washington"],
    //   ["Washington", "Dubai"],
    //   ["Dubai", "Bengaluru"],
    // ]);
  }, []);

  function testFunction(destination) {
    const [startPoint, endPoint] = destination.reduce(
      ([a, b], [x, y]) => [
        [...a, x],
        [...b, y],
      ],
      [[], []]
    );

    for (const destPoint of endPoint) {
      let isDestFount = true;

      for (const startPt of startPoint) {
        if (destPoint === startPt) {
          isDestFount = false;
          break;
        }
      }

      console.log(isDestFount && destPoint);
    }
  }

  return (
    //in app component wrap the entire component tree with AuthProvider
    <div className="app">
      <AuthProvider>
        <UserLogDetails>
          {/* <LoginMainPage /> */}
          <BrowserRouter>
            <Routes>
              <Route path="login" element={<LoginMainPage />}></Route>
              <Route
                path="/"
                element={
                  <RequireAuth>
                    <DashboardContentComp />
                  </RequireAuth>
                }
              />{" "}
              {/* no entry without authentication or the user name */}
              <Route path="availLocks" element={<AvailableLockers />} />
              <Route path="occupiedLocks" element={<LockerDashBoardComp />} />
              <Route
                path="transactionDashboard"
                element={
                  <RequireAuth>
                    <TransactionDashboardCom />
                  </RequireAuth>
                }
              />
              <Route
                path="siteRegistraion"
                element={
                  <RequireAuth>
                    <SiteRegistrationCom />
                  </RequireAuth>
                }
              />
              <Route
                path="users"
                element={
                  <RequireAuth>
                    <UserHandler />
                  </RequireAuth>
                }
              ></Route>
              <Route
                path="lockerCatagory"
                element={
                  <RequireAuth>
                    <HandleLockerCategory />
                  </RequireAuth>
                }
              ></Route>
              <Route
                path="firmware_update"
                element={
                  <RequireAuth>
                    <Firmware />
                  </RequireAuth>
                }
              ></Route>
              <Route
                path="charts"
                element={
                  <RequireAuth>
                    <ChartsRepr />
                  </RequireAuth>
                }
              />
              {/* <Route path="noaccess" element={<NoAccess />}></Route> */}
              {/* old paths without Authorization */}
              {/* <Route path="deviceStatus" element={<TerminalStatus />}></Route>
              <Route path="lockStatus" element={<LockerStatus />}></Route>
              <Route path="lockerOperations" element={<LockerOperations />} />
              <Route path="amountRefund" element={<AmountRefund />} />
              <Route path="transaction-history" element={<TDHistory />} />



              <Route
                path="failed-transactions"
                element={<FailedTransactions />}
              /> */}
              {/* <Route path="to-xlsheet" element={<HistoryDatatoXlsheet />} /> */}
              {/* <Route path="to-xlsheet" element={<HandleDataHere />} />
              <Route path="mall-auth" element={<MallAuth />} />

              <Route path="test" element={<Test />} />
              <Route path="layouts" element={<LayoutTest />} /> */}
              {/* <Route path="malfun" element={<Malfun />} /> */}
              {/* <Route path= "country" element={<Country />} /> */}
              {/* new paths with  Authorization */}
              <Route
                path="deviceStatus"
                element={
                  <RequireAuth>
                    <TerminalStatus />
                  </RequireAuth>
                }
              ></Route>
              <Route
                path="lockStatus"
                element={
                  <RequireAuth>
                    <LockerStatus />
                  </RequireAuth>
                }
              ></Route>
              <Route
                path="lockerOperations"
                element={
                  <RequireAuth>
                    <LockerOperations />
                  </RequireAuth>
                }
              />
              <Route
                path="amountRefund"
                element={
                  <RequireAuth>
                    <AmountRefund />
                  </RequireAuth>
                }
              />
              <Route
                path="transaction-history"
                element={
                  <RequireAuth>
                    <TDHistory />
                  </RequireAuth>
                }
              />
              <Route
                path="failed-transactions"
                element={
                  <RequireAuth>
                    <FailedTransactions />
                  </RequireAuth>
                }
              />
              <Route
                path="to-xlsheet"
                element={
                  <RequireAuth>
                    <HandleDataHere />
                  </RequireAuth>
                }
              />
              <Route path="mall-auth" element={<MallAuth />} />
              <Route path="test" element={<Test />} />
              <Route path="layouts" element={<LayoutTest />} />
              <Route
                path="layout-test"
                element={
                  <CommonLayoutForAll
                    terminalID={"LULBLRNM"}
                    isMalfunction={false}
                    lockersInUse={[]}
                    userSelectedLock={[]}
                    userSelectedLockHandler={someFunctionToBind.bind(this)}
                  />
                }
              />
              <Route
                path="layout-temple"
                element={
                  <CommonTempleLayouts
                    terminalID={"G21_B"}
                    isMalfunction={false}
                    lockersInUse={[]}
                    userSelectedLock={[]}
                    userSelectedLockHandler={someFunctionToBind.bind(this)}
                  />
                }
              />
              <Route path="/*" element={<DashboardContentComp />}></Route>
            </Routes>
          </BrowserRouter>
        </UserLogDetails>
      </AuthProvider>
    </div>
  );
}

export default App;
