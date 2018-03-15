import React from "react";
import PropTypes from "prop-types";

class SetPassword extends React.Component {
  static propTypes = {
    callback: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      password: "",
      repeatPassword: "",
      message: ""
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  submit(event) {
    event.preventDefault();

    if (this.checkEquality()) {
      this.props.callback(this.state.password);
    }
  }

  checkEquality() {
    const { password, repeatPassword } = this.state;
    if (password.length && repeatPassword.length) {
      if (password !== repeatPassword) {
        this.setState({ message: "Passwörter stimmen nicht überein" });
        return false;
      }
      this.setState({ message: null });
      return true;
    }
    return false;
  }

  handleInputChange(event) {
    this.setState(
      {
        [event.target.name]: event.target.value
      },
      this.checkEquality
    );
  }

  render() {
    const message = this.state.message;
    return (
      <form onSubmit={this.submit}>
        {message && <div className="error">{message} </div>}
        <label>
          Passwort:
          <input
            type="password"
            value={this.state.password}
            name="password"
            onChange={this.handleInputChange}
          />
        </label>
        <label>
          Passwort wiederholen
          <input
            type="password"
            value={this.state.repeatPassword}
            name="repeatPassword"
            onChange={this.handleInputChange}
          />
        </label>
        <input type="submit" />
      </form>
    );
  }
}

export default SetPassword;
