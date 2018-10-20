import React, { Component } from "react";

import BillboardChart from "react-billboardjs";
import "react-billboardjs/lib/billboard.css";

const AXIS = {
  x: {
    type: "timeseries",
    tick: {
      format: 'Week %V in %Y'
    }
  }
}

const CHART_DATA = {
  columns: [
    ["x", '2018-1-1', '2018-2-5', '2018-3-7', '2018-3-1', '2018-3-3', '2018-3-5'],
    ["data1", 30, 20, 50, 40, 60, 50],
    ["data2", 200, 130, 90, 240, 130, 220],
    ["data3", 300, 200, 160, 400, 250, 250]
  ],
  type: "bar",
  groups: [ [ "data1", "data2", "data3" ] ],
  x: 'x',
  xFormat: '%Y-%m-%d',
};

class StackedBarChart extends Component {
  render() {
    return <BillboardChart data={CHART_DATA} axis={AXIS} />;
  }
}

export default StackedBarChart;
