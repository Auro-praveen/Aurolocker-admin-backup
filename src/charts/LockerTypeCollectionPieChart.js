import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

const LockerTypeCollectionPieChart = (props) => {
  const [isChartDrawable, setIsChartDrawable] = useState(false);

  const [pieChartDetail, setPieChartDetail] = useState({
    series: props.pieChartSeries,
    options: {
      chart: {
        width: 400,
        type: "pie",
      },
      title: {
        text: "PieChart representation for locker collection by type",
        align: "center",
        style: {
          color: "#243a87",
          fontFamily: "san-serif",
        },
      },
      labels: props.pieChartLabel,
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

  useEffect(() => {
    // if (props.terminalID === "lcount") {

    // } else {
    //   for (let i = 0; i < props.pieChartSeries.length - 1; i++) {
    //     if (props.pieChartSeries[i] > 0) {
    //       setPieChartDetail({
    //         ...pieChartDetail,
    //         series: props.pieChartSeries,
    //       });

    //       setIsChartDrawable(true);
    //       break;
    //     }
    //   }
    // }

    // if (props.terminalID === "lcount") {
    //   setPieChartDetail({
    //     ...pieChartDetail,
    //     options: {
    //       ...pieChartDetail.options,
    //       title: {
    //         // ...pieChartDetail.options.title,
    //         text: "Locker Occupacy Pie Chart",
    //       },
    //     },
    //   });
    // }


    for (let i = 0; i < props.pieChartSeries.length - 1; i++) {
      if (props.pieChartSeries[i] > 0) {
        setPieChartDetail({
          ...pieChartDetail,
          series: props.pieChartSeries,
        });

        setIsChartDrawable(true);
        break;
      }
    }
  }, [props]);

  const calculateTotNumbers = () => {
    let value = 0;
    props.pieChartSeries.map.values((val) => {
      return value + val;
    }) 
  }

  return (
    <div className="chart-view">
      {isChartDrawable ? (
        <Chart
          options={pieChartDetail.options}
          series={pieChartDetail.series}
          type="pie"
          width={props.terminalID === "All" ? 450 : 400}
          //   height={props.terminalID === "All" ? 400 : 400}
        />
      ) : (
        <p className="small-para">
          Graph Is Not Plotted For The TerminalId Where All The Locker Type
          Collection is : 0
        </p>
      )}

      <div className="piechart-descr-total-collection">
        {props.terminalID === "All" ? (
          <h6>
            Locker Collection Representation By Locker Type for
            <b style={{ color: "crimson" }}>{props.terminalID}</b> Lockers From
            All TemrinalID's
          </h6>
        ) : props.terminalID === "lcount" ? (
          <>
            {" "}
            <h6>
              Locker Representation By Locker Type usage for{" "}
              <b style={{ color: "crimson" }}>{"ALL TERMINALID'S"}</b> Lockers,
              Total Lockers Booked : <b style={{ color: "crimson" }}>{ () => calculateTotNumbers() }</b>
            </h6>
          </>
        ) : (
          <h6>
            Locker Collection Representation By Locker Type for{" "}
            <b style={{ color: "crimson" }}>{props.terminalID}</b> Lockers
          </h6>
        )}
      </div>
    </div>
  );
};

export default LockerTypeCollectionPieChart;
