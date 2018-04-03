import React, { Component } from "react";
import StateHolder from "./StateHolder.js";
import { Route, Switch } from "react-router-dom";
import ThankYou from "./ThankYou";
import fontawesome from "@fortawesome/fontawesome";
import faSpinner from "@fortawesome/fontawesome-free-solid/faSpinner";

import "./App.css";

fontawesome.library.add(faSpinner);

class App extends Component {
  render() {
    return (
      <main className="app-content">
        <Switch>
          <Route path="/thank-you" component={ThankYou} />
          <Route path="/:investigation/:form" component={StateHolder} />
        </Switch>
      </main>
    );
  }
}

export default App;
