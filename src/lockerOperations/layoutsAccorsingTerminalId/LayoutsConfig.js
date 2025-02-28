import React, { useEffect, useState } from "react";
import dynamicLockerLayout from "../../GlobalVariable/dynamicLockerLayout.json";
import "./layoutdesign.css";

const LayoutsConfig = (props) => {
  const [lockerLaypos, setLockerLaypos] = useState([]);
  const [clickedButton, setClickedButton] = useState(null);

  const dynamicLocker = dynamicLockerLayout[props.terminalID].layout;

  const commonWidth = 40;
  const commonHeight = 40;

  let count = 0;

  function renderAsLayout() {
    let completelockers = [];
    let lockerRows = [];
    let isQRWidthlarge = false;
    let lockerContainsNA = false;

    console.log("calling here");

    for (let i = 0; i < dynamicLocker.length; i++) {
      // console.log(i);

      let lockerBtns = [];
      let isLockerNextToNA = false;
      let lockerNAHeight = 0;

      for (let j = 0; j < dynamicLocker[i].length; j++) {
        // console.log(lockerObject.lockValue[i][j]);

        // console.log("inside second for loop");

        const lockerArr = dynamicLocker[i][j].split("#");
        const [lockWidth, lockHeight] = lockerArr[1].split(",");

        // console.log(lockWidth, lockHeight);

        if (lockerArr[0] !== "NA") {
          lockerBtns.push(
            insertButtons(
              lockWidth,
              lockHeight,
              lockerArr[0],
              count,
              isLockerNextToNA,
              lockerNAHeight
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
    lockerNAHeight
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
          //     : lockName.includes("QR")
          //     ? " 0px 0px 4px 1px #818181"
          //     : "0px 0px 4px 1px #0a943f",
          borderRadius: "5px",
          padding: "5px",
          margin: "4px",
          // marginTop :
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
    );
  };

  const handleClick = (BN) => {
    setClickedButton(BN);
  };

  return <div className="dynamic-layout-border">{renderAsLayout()}</div>;
};

export default LayoutsConfig;
