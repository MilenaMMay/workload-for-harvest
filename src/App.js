import React, { Component } from 'react';
import './App.css';
import * as d3 from "d3";
import moment from 'moment';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      token: null,
      accountId: null,
      person: null,
    }
  }

  componentDidMount() {
    this.loadState()
    this.updateChart()
  }

  loadState() {
    const state = localStorage.getItem('workloadAppState')
    if (state) {
      this.setState(JSON.parse(state))
    }
  }

  storeState() {
    localStorage.setItem('workloadAppState', JSON.stringify(this.state))
  }

  tokenInputHandler(value) {
    this.setState({token: value}, () => {
      this.storeState()
    })
  }

  accountIdInputHandler(value) {
    this.setState({accountId: value}, () => {
      this.storeState()
    })
  }

  refreshHandler(e) {
    fetch(`https://api.harvestapp.com/v2/users/me?access_token=${this.state.token}&account_id=${this.state.accountId}`)
      .then(res => res.json())
      .then(({first_name, last_name, email}) => {
        this.setState({ person: `${first_name} ${last_name} (${email})` }, () => {
          this.storeState()
        })
      })

    fetch(`https://api.harvestapp.com/v2/time_entries?access_token=${this.state.token}&account_id=${this.state.accountId}`)
      .then(res => res.json())
      .then(({time_entries}) => {
        console.log(time_entries)
        let data = time_entries.reduce((map, entry) => {
          let spent_date = moment(entry.spent_date)
          let key = `${spent_date.year()}-${spent_date.week()}`
          if(!map[key]) {
            map[key] = 0
          }
          map[key] += entry.hours
          return map;
        }, {})
        console.log(data);
      })
  }

  updateChart() {
    var n = 4, // The number of series.
        m = 58; // The number of values per series.

    // The xz array has m elements, representing the x-values shared by all series.
    // The yz array has n elements, representing the y-values of each of the n series.
    // Each yz[i] is an array of m non-negative numbers representing a y-value for xz[i].
    // The y01z array has the same structure as yz, but with stacked [y₀, y₁] instead of y.
    var xz = d3.range(m),
        yz = d3.range(n).map(() => { return this.bumps(m); }),
        y01z = d3.stack().keys(d3.range(n))(d3.transpose(yz)),
        yMax = d3.max(yz, function(y) { return d3.max(y); }),
        y1Max = d3.max(y01z, function(y) { return d3.max(y, function(d) { return d[1]; }); });

    var svg = d3.select("svg"),
        margin = {top: 40, right: 10, bottom: 20, left: 10},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3.scaleBand()
        .domain(xz)
        .rangeRound([0, width])
        .padding(0.08);

    var y = d3.scaleLinear()
        .domain([0, y1Max])
        .range([height, 0]);

    var color = d3.scaleOrdinal()
        .domain(d3.range(n))
        //.range(d3.schemeCategory20c);

    var series = g.selectAll(".series")
      .data(y01z)
      .enter().append("g")
        .attr("fill", function(d, i) { return color(i); });

    var rect = series.selectAll("rect")
      .data(function(d) { return d; })
      .enter().append("rect")
        .attr("x", function(d, i) { return x(i); })
        .attr("y", height)
        .attr("width", x.bandwidth())
        .attr("height", 0);

    rect.transition()
        .delay(function(d, i) { return i * 10; })
        .attr("y", function(d) { return y(d[1]); })
        .attr("height", function(d) { return y(d[0]) - y(d[1]); });

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x)
            .tickSize(0)
            .tickPadding(6));
  }

  // Returns an array of m psuedorandom, smoothly-varying non-negative numbers.
  // Inspired by Lee Byron’s test data generator.
  // http://leebyron.com/streamgraph/
  bumps(m) {
    var values = [], i, j, w, x, y, z;

    // Initialize with uniform random values in [0.1, 0.2).
    for (i = 0; i < m; ++i) {
      values[i] = 0.1 + 0.1 * Math.random();
    }

    // Add five random bumps.
    for (j = 0; j < 5; ++j) {
      x = 1 / (0.1 + Math.random());
      y = 2 * Math.random() - 0.5;
      z = 10 / (0.1 + Math.random());
      for (i = 0; i < m; i++) {
        w = (i / m - y) * z;
        values[i] += x * Math.exp(-w * w);
      }
    }

    // Ensure all values are positive.
    for (i = 0; i < m; ++i) {
      values[i] = Math.max(0, values[i]);
    }

    return values;
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <label>Token:</label>
          <input onChange={ (e) => { this.tokenInputHandler(e.target.value) }} value={this.state.token} />
          <label>Account ID:</label>
          <input onChange={ (e) => { this.accountIdInputHandler(e.target.value) }} value={this.state.accountId} />
          <button onClick={ (e) => { this.refreshHandler(e) }} >Refresh</button>

          <p>
            {this.state.person}
          </p>

          <svg width="960" height="500"></svg>
        </header>
      </div>
    );
  }
}

export default App;
