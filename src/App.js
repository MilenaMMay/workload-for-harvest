import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      token: null,
      accountId: null,
      person: null,
    }

  }


  tokenInputHandler(value) {
    this.setState({token: value})
  }

  accountIdInputHandler(value) {
    this.setState({accountId: value})
  }

  refreshHandler(e) {
    fetch(`https://api.harvestapp.com/v2/users/me?access_token=${this.state.token}&account_id=${this.state.accountId}`)
      .then(res => res.json())
      .then(({first_name, last_name, email}) => {
        this.setState({ person: `${first_name} ${last_name} (${email})` })
      })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <label>Token:</label>
          <input onChange={ (e) => { this.tokenInputHandler(e.target.value) }}></input>
          <label>Account ID:</label>
          <input onChange={ (e) => { this.accountIdInputHandler(e.target.value) }}></input>
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
