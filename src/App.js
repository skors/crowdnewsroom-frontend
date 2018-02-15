import React, { Component } from "react";
import "./App.css";
import Form from "./Form.js";
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
          <Route exact path="/" component={Form} />
          <Route
            path="/investigations/:investigation/forms/:form"
            component={Form}
          />
          <Route path="/thank-you" component={ThankYou} />
          <Route path="/edit/:token" component={Form} />
        </main>
      </div>
    );
  }
}

export default App;
