import React, { useEffect } from "react";

const LayoutTest = () => {
  const locks = [
    "S1",
    "S2",
    "M3",
    "M4",
    "S5",
    "QR",
    "M6",
    "M7",
    "S8",
    "S9",
    "M10",
    "M11",
    "S12",
    "S13",
    "M14",
    "M15",
  ];

  //   const rows = 4;
  const listOfLocks = [4, 4, 3, 4];

  let  prevIndex =  Number(0);

  useEffect(() => {
    layoutFunction();
  }, []);

  const layoutFunction = () => {
    for (let i = 0; i < listOfLocks.length; i++) {
      const rowsToFill = listOfLocks[i];
      console.log("first loop , ", rowsToFill);

      for (let index = 0; index < rowsToFill; index++) {
        console.log(locks[prevIndex]);

        prevIndex = prevIndex + Number(1);
      }
    }
  };

  return (<div>

    {
        listOfLocks.map(colCount => {
            
        })
    }

  </div>);
};

export default LayoutTest;
