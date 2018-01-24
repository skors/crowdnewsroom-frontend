import React, { Component } from 'react';
import './App.css';
import Form from "./Form.js";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Crowdnewsroom</h1>
        </header>
        <main className="App-content">
          <Form />
        </main>
      </div>
    );
  }
}

export default App;
