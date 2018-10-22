import React, { Component } from 'react';

import BillboardChart from 'react-billboardjs';
import 'react-billboardjs/lib/billboard.css';
import moment from 'moment';

class StackedBarChart extends Component {
  constructor(props) {
    super(props)

    const input = {
      'Project 1': { '2018-1-1': 4.5, '2018-2-3': 9, '2018-3-4': 10, '2018-2-1': 5 },
      'Project 2': { '2018-1-1': 3.5, '2018-4-3': 9, '2018-3-4': 10 },
      'Project 3': { '2018-1-1': 5.5, '2018-2-3': 9, '2018-3-3': 10, '2018-2-1': 5 },
    }

    const columns = [
      ['x', '2018-1-1', '2018-2-5', '2018-3-7', '2018-3-1', '2018-3-3', '2018-3-5'],
      ['Project 1', 30, 20, 50, 40, 60, 50],
      ['Project 2', 200, 130, 90, 240, 130, 220],
      ['Project 3', 300, 200, 160, 400, 250, 250]
    ]
    const groups = [ [ 'Project 1', 'Project 2', 'Project 3' ] ]

    this.state = {
      data: {
        columns,
        groups,
        type: 'bar',
        x: 'x',
        xFormat: '%Y-%m-%d',
      },
      axis: {
        x: {
          type: 'timeseries',
          tick: {
            format: (x) => { const date = moment(x); return `Week ${date.week()} in ${date.year()}` }
          }
        }
      }
    }
  }

  render() {
    return <BillboardChart data={this.state.data} axis={this.state.axis} />;
  }
}

export default StackedBarChart;
