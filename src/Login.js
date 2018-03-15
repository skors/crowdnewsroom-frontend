import React, { Component } from "react";
import * as api from "./api";
import PropTypes from "prop-types";

import "./FormWizard.css";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      accountExists: false,
      message: ""
    };
    this.setEmail = this.setEmail.bind(this);
    this.setPassword = this.setPassword.bind(this);
    this.login = this.login.bind(this);
    this.getToken = this.getToken.bind(this);
  }

  login(event) {
    event.preventDefault();

    if (this.state.accountExists) {
      this.getToken();
    } else {
      api.checkIfEmailExists(this.state.email).then(response => {
        if (response.exists) {
          this.setState({ accountExists: response.exists });
        } else {
          this.props.callback({ email: this.state.email });
        }
      });
    }
  }

  setEmail(event) {
    this.setState({ email: event.target.value });
  }

  setPassword(event) {
    this.setState({ password: event.target.value });
  }

  getToken() {
    const { email, password } = this.state;
    api
      .getToken(email, password)
      .then(response => {
        if (response.status !== 200) {
          this.setState({ message: "Please check your password" });
          throw "Wrong password";
        }
        return response.json();
      })
      .then(json => {
        this.props.callback({ email: this.state.email, token: json.token });
      })
      .catch(console.log);
  }

  render() {
    const password = (
      <div>
        <label htmlFor="password">Passwort</label>
        <input
          type="password"
          name="password"
          value={this.state.password}
          onChange={this.setPassword}
        />
      </div>
    );
    return (
      <div className="form-transition-container">
        {this.state.message}
        <form onSubmit={this.login}>
          <label htmlFor="email">E-Mail Adresse</label>
          <input
            type="email"
            name="email"
            value={this.state.email}
            onChange={this.setEmail}
          />
          {this.state.accountExists && password}
          <input type="submit" />
        </form>
      </div>
    );
  }
}

Login.propTypes = {
  callback: PropTypes.func
};

export default Login;
