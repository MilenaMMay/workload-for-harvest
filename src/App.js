import React, { Component } from 'react';
import './App.css';
import moment from 'moment';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      token: null,
      accountId: null,
      person: null,
      data: {},
    }
  }

  componentDidMount() {
    this.loadState()
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
        let data = time_entries.reduce((map, entry) => {
          let spent_date = moment(entry.spent_date)
          let key = `${spent_date.year()}-${spent_date.week()}`
          if(!map[key]) {
            map[key] = 0
          }
          map[key] += entry.hours
          return map;
        }, {})
        this.setState({data}, () => {
          this.storeState()
        })
      })
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

        </header>
      </div>
    );
  }
}

export default App;
