import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import "./charts.css";

const StackedColumnChart = (props) => {
  const [stackedApexChart, setStackedApexChart] = useState([]);

  const [terminalIds, setTerminalIds] = useState([]);

  useEffect(() => {
    const obj = props.termWiseLockerCount;

    // console.log(obj);

    let smallLockerSeries = [];
    let mediumLockerSeries = [];
    let largeLockerSeries = [];
    let eLargeLockerSeries = [];

    let terminal = [];

    Object.entries(obj).map(([terminalId, lockTypeObj]) => {
      console.log(lockTypeObj);
      // const  objVal = JSON.parse(lockTypeObj);

      terminal.push(terminalId);

      // console.log(terminalId);
      // console.log(lockTypeObj);

      let smallLock = 0;
      let mediumLock = 0;
      let largeLock = 0;
      let eLargeLock = 0;

      Object.entries(lockTypeObj).map(([lockType, lockOccurance]) => {
        if (lockType === "small") {
          smallLock = lockOccurance;
        } else if (lockType === "medium") {
          mediumLock = lockOccurance;
        } else if (lockType === "large") {
          largeLock = lockOccurance;
        } else if (lockType === "xLarge") {
          eLargeLock = lockOccurance;
        }
      });

      smallLockerSeries.push(smallLock);
      mediumLockerSeries.push(mediumLock);
      largeLockerSeries.push(largeLock);
      eLargeLockerSeries.push(eLargeLock);
    });

    let LockerOccupCount = [
      {
        name: "small_lockers",
        data: [...smallLockerSeries],
      },
      {
        name: "medium_lockers",
        data: [...mediumLockerSeries],
      },
      {
        name: "large_lockers",
        data: [...largeLockerSeries],
      },
      {
        name: "eLarge_lockers",
        data: [...eLargeLockerSeries],
      },
    ];

    // console.log(LockerOccupCount);

    // console.log(terminal);

    setStackedApexChart([...LockerOccupCount]);

    setTerminalIds([...terminal]);

    // props.totalLoockerCount;
  }, [props]);

  const chart_details = {
    series: [
      {
        name: "PRODUCT A",
        data: [44, 55, 41, 67, 22, 43],
      },
      {
        name: "PRODUCT B",
        data: [13, 23, 20, 8, 13, 27],
      },
      {
        name: "PRODUCT C",
        data: [11, 17, 15, 15, 21, 14],
      },
      {
        name: "PRODUCT D",
        data: [21, 7, 25, 13, 22, 8],
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 10,
          dataLabels: {
            total: {
              enabled: true,
              style: {
                fontSize: "13px",
                fontWeight: 900,
              },
            },
          },
        },
      },
      xaxis: {
        type: "text",
        categories: terminalIds,
      },
      legend: {
        position: "right",
        offsetY: 40,
      },
      fill: {
        opacity: 1,
      },
    },
  };

  return (
    <div className="stacked-chart-container">
      <Chart
        options={chart_details.options}
        // series={chart_details.series}
        series={stackedApexChart}
        type="bar"
        // width={props.terminalID === "All" ? 450 : 400}
        // width={500}
        //   height={props.terminalID === "All" ? 400 : 400}
        height={500}
        width={800}
      />

      {/* <button onClick={() => console.log(stackedApexChart)}>submit</button> */}

      <h6 className="stacked-chart-descr-head">
        Locker Occupacy Chart For All Type Of Lockers Has Been Shown Above For
        Selected TerminalId's
      </h6>
    </div>
  );
};

export default StackedColumnChart;
