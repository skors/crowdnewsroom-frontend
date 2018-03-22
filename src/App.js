import React, { Component } from "react";
import StateHolder from "./StateHolder.js";
import { Route } from "react-router-dom";
import ThankYou from "./ThankYou";

import "./App.css";

class App extends Component {
  render() {
    return (
      <main className="app-content">
        <Route
          path="/investigations/:investigation/forms/:form/:step?"
          component={StateHolder}
        />
        <Route path="/thank-you" component={ThankYou} />
      </main>
    );
  }
}

export default App;
