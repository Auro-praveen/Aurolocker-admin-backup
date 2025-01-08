import React, { useState } from 'react'
import Chart from "react-apexcharts";

const TestingHere = () => {

    const [pieChartDetail, setPieChartDetail] = useState({
        options: {
            chart: {
              id: "basic-bar"
            },
            xaxis: {
              categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
            }
          },
          series: [
            {
              name: "series-1",
              data: [110, 40, 45, 50, 49, 60, 70, 91]
            }
          ]
    });

    return (
        <div>
            <h3>charts here </h3>
            <Chart
                options={pieChartDetail.options}
                series={pieChartDetail.series}
                type="bar"
                width={500}
            //   height={props.terminalID === "All" ? 400 : 400}
            />
        </div>
    )
}

export default TestingHere