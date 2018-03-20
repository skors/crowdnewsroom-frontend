import React, { Component } from "react";
import "./App.css";
import StateHolder from "./StateHolder.js";
import { Route } from "react-router-dom";
import ThankYou from "./ThankYou";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Crowdnewsroom</h1>
        </header>
        <main className="App-content">
          <Route
            path="/investigations/:investigation/forms/:form/:step?"
            component={StateHolder}
          />
          <Route path="/thank-you" component={ThankYou} />
          <Route path="/edit/:token" component={StateHolder} />
        </main>
      </div>
    );
  }
}

export default App;
