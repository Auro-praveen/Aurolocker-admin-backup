import React, { useEffect, useState } from "react";
import dynamicLockerLayout from "./DynamicTempleLayout.json";
import "../layoutsAccorsingTerminalId/layoutdesign.css";
import MonitorIcon from "@mui/icons-material/Monitor";
import { blue, pink, purple } from "@mui/material/colors";

const TempleLayoutConfig = (props) => {
  const [lockerLaypos, setLockerLaypos] = useState([]);
  const [clickedButton, setClickedButton] = useState(null);

  const dynamicLocker = dynamicLockerLayout[props.terminalID].layout;

  const commonTempleLockerWidth = 20;
  const commonTempleLockerHeight = 8;

  const commonWidth = 40;
  const commonHeight = 40;

  let count = 0;

  function renderAsLayout() {
    let completelockers = [];
    let lockerRows = [];
    let isQRWidthlarge = false;
    let lockerContainsNA = false;

    let totalLockers = 0;

    let totLargeLockers = 0;
    let totMediumLockers = 0;

    console.log("calling here");

    for (let i = 0; i < dynamicLocker.length; i++) {
      // console.log(i);

      let lockerBtns = [];
      let isLockerNextToNA = false;
      let lockerNAHeight = 0;

      let firstColumnLockers = 0;
      let DifferentiatorType = "";

      for (let j = 0; j < dynamicLocker[i].length; j++) {
        // console.log(lockerObject.lockValue[i][j]);

        // console.log("inside second for loop");

        const lockerArr = dynamicLocker[i][j].split("#");

        if (totalLockers === 0) {
          firstColumnLockers++;

          if (lockerArr[0].includes("M") && lockerArr[0].length > 4) {
            totMediumLockers++;
          } else if (lockerArr[0].includes("L") && lockerArr[0].length > 4) {
            totLargeLockers++;
          }
        }

        let lockerLayoutType = "";

        // const [lockWidth, lockHeight] = lockerArr[1].split(",");

        // praveen changed here for temple-layout 2025 april 24th

        let lockWidth, lockHeight;

        try {
          if (lockerArr[1].includes(",")) {
            [lockWidth, lockHeight] = lockerArr[1].split(",");
            console.log("split success");
          } else {
            console.log("inside something went wrong");

            throw new Error("Someting went wrong");
          }
        } catch (error) {
          console.log("error occured");

          console.log(error);

          //   alert("error");

          // USE THIS FOR ONLY SIMILAR LAYOUTS LIKE ALL SMALL OR MEDUIM OR LARGE
          // lockWidth =
          //   dynamicLockerLayout.LOCKERWIDTH[
          //     dynamicLockerLayout[props.terminalID].lockType
          //   ];
          // lockHeight =
          //   dynamicLockerLayout.LOCKERHEIGHT[
          //     dynamicLockerLayout[props.terminalID].lockType
          //   ];

          // USE THIS LOGIC TO DIFFERENTIATE BETWEEN SMALL MEDIUM AND LARGE LOCKERS, TRY TO REMOVE DIFF WHICH WONT LOOK GOOD OR ELSE ALTER LOGIC TO IT TO MAKE IT LOOK GOOD
          // PRAVEEN 26 APRIL 2025

          lockWidth = dynamicLockerLayout.LOCKERWIDTH[lockerArr[1]];
          lockHeight = dynamicLockerLayout.LOCKERHEIGHT[lockerArr[1]];

          lockerLayoutType = lockerArr[1];

          console.log(lockerLayoutType);
        }
        console.log(lockHeight);

        if (j === 0) {
          DifferentiatorType = lockerLayoutType;
        }

        //  let [lockWidth, lockHeight] = lockerArr[1].split(",");

        // console.log(lockWidth, lockHeight);

        if (lockerArr[0] !== "NA") {
          lockerBtns.push(
            insertButtons(
              lockWidth,
              lockHeight,
              lockerArr[0],
              count,
              isLockerNextToNA,
              lockerNAHeight,
              lockerLayoutType,
              totalLockers,
              DifferentiatorType,
              totMediumLockers,
              totLargeLockers
            )
          );

          isLockerNextToNA = false;
          lockerNAHeight = 0;
        }

        if (lockerArr[0] === "QR" && Number(lockWidth) === 2) {
          isQRWidthlarge = true;
        } else if (lockerArr[0] === "NA") {
          lockerContainsNA = true;
          isLockerNextToNA = true;
          lockerNAHeight = lockHeight;
        }

        DifferentiatorType = "";
        count++;
      }

      if (isQRWidthlarge && lockerContainsNA) {
        isQRWidthlarge = false;
        lockerContainsNA = false;
        lockerRows.push(
          <div
            className="locker-dynamic-row"
            style={{ marginLeft: "-47px" }}
            key={i + 1000}
          >
            {lockerBtns}
          </div>
        );
      } else {
        lockerRows.push(
          <div className="locker-dynamic-row" key={i + 1000}>
            {lockerBtns}
          </div>
        );
      }

      //   else if (lockerArr[0] === "DIFFBAR") {
      //     lockerRows.push(
      //       <div className="locker-dynamic-row" key={i + 1000}>
      //         {lockerBtns}
      //       </div>
      //     );
      //   }

      if (totalLockers === 0) {
        totalLockers = firstColumnLockers;
      }
    }

    completelockers.push(
      <div className="dynamic-display-locker" key={count + 10}>
        {lockerRows}
      </div>
    );

    return completelockers;
  }

  const insertButtons = (
    lockWidth,
    lockHeight,
    lockName,
    keyVal,
    isLockerNextToNA,
    lockerNAHeight,
    lockerLayoutType,
    totalLockers,
    DifferentiatorType,
    totMediumLockers,
    totLargeLockers
  ) => {
    return isLockerNextToNA ? (
      <button
        style={{
          width:
            lockName.includes("QR") && Number(lockWidth) === 2
              ? (commonWidth + 4) * lockWidth
              : commonWidth * lockWidth,
          height:
            lockName.includes("M") ||
            lockName.includes("XL") ||
            (lockName.includes("QR") && Number(lockHeight) === 2)
              ? (commonHeight + 4) * lockHeight
              : commonHeight * lockHeight,
          // border: "1px solid red",
          border: "none",
          //   boxShadow: lockName.includes("XL")
          //     ? "0px 0px 4px 1px #ff0000"
          //     : "0px 0px 4px 1px #0a943f",
          borderRadius: "5px",
          padding: "5px",
          margin: "4px",
          marginTop: lockerNAHeight * (commonHeight + 10),
          marginBottom: "4px",
        }}
        className={
          lockName === "QR"
            ? "dynamic-qr-container"
            : props.userSelectedLock.indexOf(lockName) > -1
            ? "dynamiclayout-selected"
            : props.inProgressLocks.indexOf(lockName) > -1 &&
              props.isMalfunction
            ? "dynamiclayout-malfunction"
            : props.inProgressLocks.indexOf(lockName) > -1
            ? "dynamiclayout-reserved"
            : "dynamiclayout-available"
        }
        key={keyVal}
        onClick={() => props.userSelectedLockFun(lockName)}
      >
        {lockName}
      </button>
    ) : (
      <button
        style={{
          width:
            lockName.includes("QR") && Number(lockWidth) === 2
              ? (commonWidth + 4) * lockWidth
              : lockName.includes("DIFFBAR") && lockerLayoutType === "FULL"
              ? lockWidth * 6
              : lockName.includes("DIFFBAR") && lockerLayoutType === "HALF"
              ? lockWidth * 12
              : lockerLayoutType === "SMALL" ||
                lockerLayoutType === "MEDIUM" ||
                lockerLayoutType === "LARGE"
              ? commonTempleLockerWidth * lockWidth
              : lockName === "MONITOR" || lockerLayoutType === "HALFMON"
              ? commonTempleLockerWidth * lockWidth + lockWidth
              : commonWidth * lockWidth,

          // DIFFERNTATION LOGIC FOR LARGE MEDIUM AND SMALL IS DIFFERENT BUT KEPT AS IT IS, IN CASE LAYOUT CHANGES IN FUTURE PRAVEEN 2025 APRIL 25
          height:
            lockerLayoutType === "MONITOR"
              ? commonTempleLockerHeight *
                (totalLockers > 2
                  ? lockHeight + totalLockers - 1.5
                  : lockHeight + totalLockers)
              : lockName.includes("DIFFBAR") && lockerLayoutType === "FULL"
              ? DifferentiatorType === "MEDIUM"
                ? commonTempleLockerHeight * totalLockers * lockHeight +
                  (totalLockers > 1
                    ? (totalLockers - 1) * commonTempleLockerHeight
                    : commonTempleLockerHeight)
                : DifferentiatorType === "LARGE"
                ? commonTempleLockerHeight * totalLockers * lockHeight +
                  (totalLockers > 1
                    ? (totalLockers - 1) * commonTempleLockerHeight
                    : commonTempleLockerHeight)
                : commonTempleLockerHeight * totalLockers * lockHeight +
                  (totalLockers > 1
                    ? totMediumLockers > 0 && totLargeLockers > 0
                      ? (totalLockers - totLargeLockers - totMediumLockers) *
                          (dynamicLockerLayout.LOCKERHEIGHT.SMALL +
                            commonTempleLockerHeight) +
                        totMediumLockers *
                          (dynamicLockerLayout.LOCKERHEIGHT.MEDIUM +
                            commonTempleLockerHeight) +
                        totLargeLockers *
                          (dynamicLockerLayout.LOCKERHEIGHT.LARGE +
                            commonTempleLockerHeight) +
                        totalLockers * 5.5
                      : //     dynamicLockerLayout.LOCKERHEIGHT.LARGE) +
                      // lockHeight * commonTempleLockerHeight
                      totLargeLockers > 0
                      ? (totalLockers -
                          1 +
                          (dynamicLockerLayout.LOCKERHEIGHT.SMALL /
                            dynamicLockerLayout.LOCKERHEIGHT.MEDIUM) *
                            totMediumLockers) *
                        commonTempleLockerHeight
                      : totLargeLockers > 0
                      ? (totalLockers -
                          1 +
                          (dynamicLockerLayout.LOCKERHEIGHT.SMALL /
                            dynamicLockerLayout.LOCKERHEIGHT.LARGE) *
                            totLargeLockers) *
                        commonTempleLockerHeight
                      : (totalLockers - 1) * commonTempleLockerHeight
                    : commonTempleLockerHeight)
              : lockName.includes("DIFFBAR") && lockerLayoutType === "HALF"
              ? DifferentiatorType === "MEDIUM"
                ? ((commonTempleLockerHeight * Number(totalLockers)) / 2) *
                  lockHeight
                : DifferentiatorType === "LARGE"
                ? ((commonTempleLockerHeight * Number(totalLockers)) / 2) *
                  lockHeight
                : ((commonTempleLockerHeight * Number(totalLockers)) / 2) *
                    lockHeight +
                  (totalLockers > 2
                    ? totMediumLockers > 0 && totLargeLockers > 0
                      ? (Number(
                          totalLockers - totLargeLockers - totMediumLockers
                        ) /
                          2) *
                        commonTempleLockerHeight
                      : totMediumLockers > 0
                      ? (Number(totalLockers - 2) / 2) *
                        commonTempleLockerHeight
                      : (Number(totalLockers - 2) / 2) *
                        commonTempleLockerHeight
                    : totalLockers * commonTempleLockerHeight)
              : // ? (Number(totalLockers - 2) / 2) * commonTempleLockerHeight
              // : totalLockers * commonTempleLockerHeight)
              lockName.includes("DIFFBAR") && lockerLayoutType === "HALFMON"
              ? DifferentiatorType === "MEDIUM"
                ? ((commonTempleLockerHeight * Number(totalLockers)) / 3) *
                  lockHeight
                : DifferentiatorType === "LARGE"
                ? ((commonTempleLockerHeight * Number(totalLockers)) / 3) *
                  lockHeight
                : ((commonTempleLockerHeight * Number(totalLockers)) / 3) *
                    lockHeight +
                  (totalLockers > 2
                    ? totMediumLockers > 0 && totLargeLockers > 0
                      ? (Number(
                          totalLockers - totLargeLockers - totMediumLockers
                        ) /
                          2) *
                          (lockHeight + commonTempleLockerHeight) +
                        (Number(totMediumLockers) / 2) *
                          (lockHeight + commonTempleLockerHeight) +
                        (Number(totLargeLockers) / 2) *
                          (lockHeight + commonTempleLockerHeight) +
                        lockHeight * 2.5
                      : totMediumLockers > 0
                      ? (Number(totalLockers - 2) / 2) *
                        commonTempleLockerHeight
                      : (Number(totalLockers - 2) / 2) *
                          commonTempleLockerHeight -
                        8 * 2.5
                    : totalLockers * commonTempleLockerHeight)
              : lockerLayoutType === "MEDIUM"
              ? commonTempleLockerHeight * lockHeight
              : lockerLayoutType === "LARGE"
              ? commonTempleLockerHeight * lockHeight
              : lockerLayoutType === "SMALL"
              ? commonTempleLockerHeight * lockHeight
              : lockName.includes("M") ||
                lockName.includes("XL") ||
                (lockName.includes("QR") && Number(lockHeight) === 2)
              ? (commonHeight + 4) * lockHeight
              : commonHeight * lockHeight,

          // THIS HEIGHT LOGIC IS FOR DIFFERENTIATING HALF BAR AND FULL BAR VISUALIZATION
          // height:
          //   lockName.includes("M") ||
          //   lockName.includes("XL") ||
          //   (lockName.includes("QR") && Number(lockHeight) === 2)
          //     ? (commonHeight + 4) * lockHeight
          //     : lockName.includes("DIFFBAR") && lockerLayoutType === "FULL"
          //     ? DifferentiatorType === "MEDIUM"
          //       ? commonHeight * totalLockers * lockHeight +
          //         (totalLockers > 1
          //           ? (totalLockers - 1) * commonHeight
          //           :  commonHeight)
          //       : DifferentiatorType === "LARGE"
          //       ? commonHeight * totalLockers * lockHeight +
          //         (totalLockers > 1
          //           ? (totalLockers - 1) * commonHeight
          //           :  commonHeight)
          //       : commonHeight * totalLockers * lockHeight +
          //         (totalLockers > 1
          //           ? (totalLockers - 1) * commonHeight
          //           :  commonHeight)
          //     : lockName.includes("DIFFBAR") && lockerLayoutType === "HALF"
          //     ? DifferentiatorType === "MEDIUM"
          //       ? ((commonHeight * Number(totalLockers)) / 2) * lockHeight
          //       : DifferentiatorType === "LARGE"
          //       ? ((commonHeight * Number(totalLockers)) / 2) * lockHeight
          //       : ((commonHeight * Number(totalLockers)) / 2) * lockHeight +
          //         (totalLockers > 2
          //           ? (Number(totalLockers - 2) / 2) * commonHeight
          //           : totalLockers * commonHeight)
          //     : lockerLayoutType === "MEDIUM"
          //     ? commonHeight * lockHeight
          //     : lockerLayoutType === "LARGE"
          //     ? commonHeight * lockHeight
          //     : commonHeight * lockHeight,

          border: "none",
          borderRadius: "5px",
          padding: "5px",
          margin: "4px",
          // marginTop :
        }}
        className={
          lockName === "QR"
            ? "dynamic-qr-container"
            : lockName.includes("DIFFBAR")
            ? "diff-bar-design"
            : lockName === "MONITOR"
            ? "monitor-design"
            : props.userSelectedLock.indexOf(lockName) > -1
            ? "dynamiclayout-selected"
            : props.inProgressLocks.indexOf(lockName) > -1 &&
              props.isMalfunction
            ? "dynamiclayout-malfunction"
            : props.inProgressLocks.indexOf(lockName) > -1
            ? "dynamiclayout-reserved"
            : "dynamiclayout-available"
        }
        key={keyVal}
        onClick={() => props.userSelectedLockFun(lockName)}
      >
        {lockerLayoutType === "MONITOR" ? (
          <MonitorIcon fontSize="large" sx={{ color: "gold", fontSize: 70 }} />
        ) : lockName.includes("DIFFBAR") ? (
          ""
        ) : (
          lockName
        )}
      </button>
    );
  };

  const handleClick = (BN) => {
    setClickedButton(BN);
  };

  return <div className="dynamic-layout-border">{renderAsLayout()}</div>;
};
export default TempleLayoutConfig;

// import React, { useEffect, useState } from "react";
// import dynamicLockerLayout from "./DynamicTempleLayout.json";
// import "../layoutsAccorsingTerminalId/layoutdesign.css";
// import MonitorIcon from "@mui/icons-material/Monitor";
// import { blue, pink, purple } from "@mui/material/colors";

// const TempleLayoutConfig = (props) => {
//   const [lockerLaypos, setLockerLaypos] = useState([]);
//   const [clickedButton, setClickedButton] = useState(null);

//   const dynamicLocker = dynamicLockerLayout[props.terminalID].layout;

//   const commonTempleLockerWidth = 20;
//   const commonTempleLockerHeight = 8;

//   const commonWidth = 40;
//   const commonHeight = 40;

//   let count = 0;

//   function renderAsLayout() {
//     let completelockers = [];
//     let lockerRows = [];
//     let isQRWidthlarge = false;
//     let lockerContainsNA = false;

//     let totalLockers = 0;

//     let totLargeLockers = 0;
//     let totMediumLockers = 0;

//     console.log("calling here");

//     for (let i = 0; i < dynamicLocker.length; i++) {
//       // console.log(i);

//       let lockerBtns = [];
//       let isLockerNextToNA = false;
//       let lockerNAHeight = 0;

//       let firstColumnLockers = 0;
//       let DifferentiatorType = "";

//       for (let j = 0; j < dynamicLocker[i].length; j++) {
//         // console.log(lockerObject.lockValue[i][j]);

//         // console.log("inside second for loop");

//         const lockerArr = dynamicLocker[i][j].split("#");

//         if (totalLockers === 0) {
//           firstColumnLockers++;

//           if (lockerArr[0].includes("MA")) {
//             totMediumLockers++;
//           } else if (lockerArr[0].includes("LA")) {
//             totLargeLockers++;
//           }
//         }

//         let lockerLayoutType = "";

//         // const [lockWidth, lockHeight] = lockerArr[1].split(",");

//         // praveen changed here for temple-layout 2025 april 24th

//         let lockWidth, lockHeight;

//         try {
//           if (lockerArr[1].includes(",")) {
//             [lockWidth, lockHeight] = lockerArr[1].split(",");
//             console.log("split success");
//           } else {
//             console.log("inside something went wrong");

//             throw new Error("Someting went wrong");
//           }
//         } catch (error) {
//           console.log("error occured");

//           console.log(error);

//           //   alert("error");

//           // USE THIS FOR ONLY SIMILAR LAYOUTS LIKE ALL SMALL OR MEDUIM OR LARGE
//           // lockWidth =
//           //   dynamicLockerLayout.LOCKERWIDTH[
//           //     dynamicLockerLayout[props.terminalID].lockType
//           //   ];
//           // lockHeight =
//           //   dynamicLockerLayout.LOCKERHEIGHT[
//           //     dynamicLockerLayout[props.terminalID].lockType
//           //   ];

//           // USE THIS LOGIC TO DIFFERENTIATE BETWEEN SMALL MEDIUM AND LARGE LOCKERS, TRY TO REMOVE DIFF WHICH WONT LOOK GOOD OR ELSE ALTER LOGIC TO IT TO MAKE IT LOOK GOOD
//           // PRAVEEN 26 APRIL 2025

//           lockWidth = dynamicLockerLayout.LOCKERWIDTH[lockerArr[1]];
//           lockHeight = dynamicLockerLayout.LOCKERHEIGHT[lockerArr[1]];

//           lockerLayoutType = lockerArr[1];

//           console.log(lockerLayoutType);
//         }
//         console.log(lockHeight);

//         if (j === 0) {
//           DifferentiatorType = lockerLayoutType;
//         }

//         //  let [lockWidth, lockHeight] = lockerArr[1].split(",");

//         // console.log(lockWidth, lockHeight);

//         if (lockerArr[0] !== "NA") {
//           lockerBtns.push(
//             insertButtons(
//               lockWidth,
//               lockHeight,
//               lockerArr[0],
//               count,
//               isLockerNextToNA,
//               lockerNAHeight,
//               lockerLayoutType,
//               totalLockers,
//               DifferentiatorType,
//               totMediumLockers,
//               totLargeLockers
//             )
//           );

//           isLockerNextToNA = false;
//           lockerNAHeight = 0;
//         }

//         if (lockerArr[0] === "QR" && Number(lockWidth) === 2) {
//           isQRWidthlarge = true;
//         } else if (lockerArr[0] === "NA") {
//           lockerContainsNA = true;
//           isLockerNextToNA = true;
//           lockerNAHeight = lockHeight;
//         }

//         DifferentiatorType = "";
//         count++;
//       }

//       if (isQRWidthlarge && lockerContainsNA) {
//         isQRWidthlarge = false;
//         lockerContainsNA = false;
//         lockerRows.push(
//           <div
//             className="locker-dynamic-row"
//             style={{ marginLeft: "-47px" }}
//             key={i + 1000}
//           >
//             {lockerBtns}
//           </div>
//         );
//       } else {
//         lockerRows.push(
//           <div className="locker-dynamic-row" key={i + 1000}>
//             {lockerBtns}
//           </div>
//         );
//       }

//       //   else if (lockerArr[0] === "DIFFBAR") {
//       //     lockerRows.push(
//       //       <div className="locker-dynamic-row" key={i + 1000}>
//       //         {lockerBtns}
//       //       </div>
//       //     );
//       //   }

//       if (totalLockers === 0) {
//         totalLockers = firstColumnLockers;
//       }
//     }

//     completelockers.push(
//       <div className="dynamic-display-locker" key={count + 10}>
//         {lockerRows}
//       </div>
//     );

//     return completelockers;
//   }

//   const insertButtons = (
//     lockWidth,
//     lockHeight,
//     lockName,
//     keyVal,
//     isLockerNextToNA,
//     lockerNAHeight,
//     lockerLayoutType,
//     totalLockers,
//     DifferentiatorType,
//     totMediumLockers,
//     totLargeLockers
//   ) => {
//     return isLockerNextToNA ? (
//       <button
//         style={{
//           width:
//             lockName.includes("QR") && Number(lockWidth) === 2
//               ? (commonWidth + 4) * lockWidth
//               : commonWidth * lockWidth,
//           height:
//             lockName.includes("M") ||
//             lockName.includes("XL") ||
//             (lockName.includes("QR") && Number(lockHeight) === 2)
//               ? (commonHeight + 4) * lockHeight
//               : commonHeight * lockHeight,
//           // border: "1px solid red",
//           border: "none",
//           //   boxShadow: lockName.includes("XL")
//           //     ? "0px 0px 4px 1px #ff0000"
//           //     : "0px 0px 4px 1px #0a943f",
//           borderRadius: "5px",
//           padding: "5px",
//           margin: "4px",
//           marginTop: lockerNAHeight * (commonHeight + 10),
//           marginBottom: "4px",
//         }}
//         className={
//           lockName === "QR"
//             ? "dynamic-qr-container"
//             : props.userSelectedLock.indexOf(lockName) > -1
//             ? "dynamiclayout-selected"
//             : props.inProgressLocks.indexOf(lockName) > -1 &&
//               props.isMalfunction
//             ? "dynamiclayout-malfunction"
//             : props.inProgressLocks.indexOf(lockName) > -1
//             ? "dynamiclayout-reserved"
//             : "dynamiclayout-available"
//         }
//         key={keyVal}
//         onClick={() => props.userSelectedLockFun(lockName)}
//       >
//         {lockName}
//       </button>
//     ) : (
//       <button
//         style={{
//           width:
//             lockName.includes("QR") && Number(lockWidth) === 2
//               ? (commonWidth + 4) * lockWidth
//               : lockName.includes("DIFFBAR") && lockerLayoutType === "FULL"
//               ? lockWidth * 6
//               : lockName.includes("DIFFBAR") && lockerLayoutType === "HALF"
//               ? lockWidth * 12
//               : lockerLayoutType === "SMALL" ||
//                 lockerLayoutType === "MEDIUM" ||
//                 lockerLayoutType === "LARGE"
//               ? commonTempleLockerWidth * lockWidth
//               : lockName === "MONITOR" || lockerLayoutType === "HALFMON"
//               ? commonTempleLockerWidth * lockWidth + lockWidth
//               : commonWidth * lockWidth,

//           // DIFFERNTATION LOGIC FOR LARGE MEDIUM AND SMALL IS DIFFERENT BUT KEPT AS IT IS, IN CASE LAYOUT CHANGES IN FUTURE PRAVEEN 2025 APRIL 25
//           height:
//             lockerLayoutType === "MONITOR"
//               ? commonTempleLockerHeight *
//                 (totalLockers > 2
//                   ? lockHeight + totalLockers - 1.5
//                   : lockHeight + totalLockers)
//               : lockName.includes("DIFFBAR") && lockerLayoutType === "FULL"
//               ? DifferentiatorType === "MEDIUM"
//                 ? commonTempleLockerHeight * totalLockers * lockHeight +
//                   (totalLockers > 1
//                     ? (totalLockers - 1) * commonTempleLockerHeight
//                     : commonTempleLockerHeight)
//                 : DifferentiatorType === "LARGE"
//                 ? commonTempleLockerHeight * totalLockers * lockHeight +
//                   (totalLockers > 1
//                     ? (totalLockers - 1) * commonTempleLockerHeight
//                     : commonTempleLockerHeight)
//                 : commonTempleLockerHeight * totalLockers * lockHeight +
//                   (totalLockers > 1
//                     ? totMediumLockers > 0 && totLargeLockers > 0
//                       ? (totalLockers - totMediumLockers) *
//                         commonTempleLockerHeight *
//                         ((dynamicLockerLayout.LOCKERHEIGHT.SMALL /
//                           dynamicLockerLayout.LOCKERHEIGHT.MEDIUM) *
//                           totMediumLockers +
//                           (dynamicLockerLayout.LOCKERHEIGHT.SMALL /
//                             dynamicLockerLayout.LOCKERHEIGHT.LARGE) *
//                             totLargeLockers)
//                       : totLargeLockers > 0
//                       ? (totalLockers -
//                           1 +
//                           (dynamicLockerLayout.LOCKERHEIGHT.SMALL /
//                             dynamicLockerLayout.LOCKERHEIGHT.MEDIUM) *
//                             totMediumLockers) *
//                         commonTempleLockerHeight
//                       : totLargeLockers > 0
//                       ? (totalLockers -
//                           1 +
//                           (dynamicLockerLayout.LOCKERHEIGHT.SMALL /
//                             dynamicLockerLayout.LOCKERHEIGHT.LARGE) *
//                             totLargeLockers) *
//                         commonTempleLockerHeight
//                       : (totalLockers - 1) * commonTempleLockerHeight
//                     : commonTempleLockerHeight)
//               : lockName.includes("DIFFBAR") && lockerLayoutType === "HALF"
//               ? DifferentiatorType === "MEDIUM"
//                 ? ((commonTempleLockerHeight * Number(totalLockers)) / 2) *
//                   lockHeight
//                 : DifferentiatorType === "LARGE"
//                 ? ((commonTempleLockerHeight * Number(totalLockers)) / 2) *
//                   lockHeight
//                 : ((commonTempleLockerHeight * Number(totalLockers)) / 2) *
//                     lockHeight +
//                   (totalLockers > 2
//                     ? (Number(totalLockers - 2) / 2) * commonTempleLockerHeight
//                     : totalLockers * commonTempleLockerHeight)
//               : lockName.includes("DIFFBAR") && lockerLayoutType === "HALFMON"
//               ? DifferentiatorType === "MEDIUM"
//                 ? ((commonTempleLockerHeight * Number(totalLockers)) / 3) *
//                   lockHeight
//                 : DifferentiatorType === "LARGE"
//                 ? ((commonTempleLockerHeight * Number(totalLockers)) / 3) *
//                   lockHeight
//                 : ((commonTempleLockerHeight * Number(totalLockers)) / 3) *
//                     lockHeight +
//                   (totalLockers > 2
//                     ? (Number(totalLockers - 2) / 2) * commonTempleLockerHeight
//                     : totalLockers * commonTempleLockerHeight)
//               : lockerLayoutType === "MEDIUM"
//               ? commonTempleLockerHeight * lockHeight
//               : lockerLayoutType === "LARGE"
//               ? commonTempleLockerHeight * lockHeight
//               : lockerLayoutType === "SMALL"
//               ? commonTempleLockerHeight * lockHeight
//               : lockName.includes("M") ||
//                 lockName.includes("XL") ||
//                 (lockName.includes("QR") && Number(lockHeight) === 2)
//               ? (commonHeight + 4) * lockHeight
//               : commonHeight * lockHeight,

//           // THIS HEIGHT LOGIC IS FOR DIFFERENTIATING HALF BAR AND FULL BAR VISUALIZATION
//           // height:
//           //   lockName.includes("M") ||
//           //   lockName.includes("XL") ||
//           //   (lockName.includes("QR") && Number(lockHeight) === 2)
//           //     ? (commonHeight + 4) * lockHeight
//           //     : lockName.includes("DIFFBAR") && lockerLayoutType === "FULL"
//           //     ? DifferentiatorType === "MEDIUM"
//           //       ? commonHeight * totalLockers * lockHeight +
//           //         (totalLockers > 1
//           //           ? (totalLockers - 1) * commonHeight
//           //           :  commonHeight)
//           //       : DifferentiatorType === "LARGE"
//           //       ? commonHeight * totalLockers * lockHeight +
//           //         (totalLockers > 1
//           //           ? (totalLockers - 1) * commonHeight
//           //           :  commonHeight)
//           //       : commonHeight * totalLockers * lockHeight +
//           //         (totalLockers > 1
//           //           ? (totalLockers - 1) * commonHeight
//           //           :  commonHeight)
//           //     : lockName.includes("DIFFBAR") && lockerLayoutType === "HALF"
//           //     ? DifferentiatorType === "MEDIUM"
//           //       ? ((commonHeight * Number(totalLockers)) / 2) * lockHeight
//           //       : DifferentiatorType === "LARGE"
//           //       ? ((commonHeight * Number(totalLockers)) / 2) * lockHeight
//           //       : ((commonHeight * Number(totalLockers)) / 2) * lockHeight +
//           //         (totalLockers > 2
//           //           ? (Number(totalLockers - 2) / 2) * commonHeight
//           //           : totalLockers * commonHeight)
//           //     : lockerLayoutType === "MEDIUM"
//           //     ? commonHeight * lockHeight
//           //     : lockerLayoutType === "LARGE"
//           //     ? commonHeight * lockHeight
//           //     : commonHeight * lockHeight,

//           border: "none",
//           borderRadius: "5px",
//           padding: "5px",
//           margin: "4px",
//           // marginTop :
//         }}
//         className={
//           lockName === "QR"
//             ? "dynamic-qr-container"
//             : lockName.includes("DIFFBAR")
//             ? "diff-bar-design"
//             : lockName === "MONITOR"
//             ? "monitor-design"
//             : props.userSelectedLock.indexOf(lockName) > -1
//             ? "dynamiclayout-selected"
//             : props.inProgressLocks.indexOf(lockName) > -1 &&
//               props.isMalfunction
//             ? "dynamiclayout-malfunction"
//             : props.inProgressLocks.indexOf(lockName) > -1
//             ? "dynamiclayout-reserved"
//             : "dynamiclayout-available"
//         }
//         key={keyVal}
//         onClick={() => props.userSelectedLockFun(lockName)}
//       >
//         {lockerLayoutType === "MONITOR" ? (
//           <MonitorIcon fontSize="large" sx={{ color: "gold", fontSize: 60 }} />
//         ) : lockName.includes("DIFFBAR") ? (
//           ""
//         ) : (
//           lockName
//         )}
//       </button>
//     );
//   };

//   const handleClick = (BN) => {
//     setClickedButton(BN);
//   };

//   return <div className="dynamic-layout-border">{renderAsLayout()}</div>;
// };
// export default TempleLayoutConfig;
