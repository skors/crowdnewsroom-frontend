import React, { Component } from "react";
import StateHolder from "./StateHolder.js";
import { Route } from "react-router-dom";
import ThankYou from "./ThankYou";

import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="app">
        <header className="app-header">
          <h1 className="app-title">Crowdnewsroom</h1>
        </header>
        <main className="app-content">
          <Route
            path="/investigations/:investigation/forms/:form/:step?"
            component={StateHolder}
          />
          <Route path="/thank-you" component={ThankYou} />
        </main>
      </div>
    );
  }
}

export default App;
