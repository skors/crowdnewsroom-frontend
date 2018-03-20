import React from "react";
import "bootstrap/dist/css/bootstrap.css";

import { t } from "./i18n";
import { Redirect } from "react-router-dom";
import * as api from "./api";
import FormWizard from "./FormWizard";
import Login from "./Login";
import SetPassword from "./SetPassword";
import Summary from "./Summary";

class StateHolder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      schema: {},
      status: "D",
      uiSchema: {},
      formData: {},
      error: false,
      loading: false,
      activeComponent: "email",
      email: null,
      authToken: null,
      data: {},
      isUpdate: false,
      formInstanceId: null
    };

    this.send = this.send.bind(this);
    this.updateEmail = this.updateEmail.bind(this);
    this.finishForm = this.finishForm.bind(this);
    this.submitData = this.submitData.bind(this);
    this.loginCallback = this.loginCallback.bind(this);
    this.logout = this.logout.bind(this);
    this.setPassword = this.setPassword.bind(this);
  }

  updateEmail(event) {
    this.setState({ email: event.target.value });
  }

  loadData() {
    const { investigation, form } = this.props.match.params;
    const promises = [api.getForm(investigation, form)];

    if (this.state.authToken) {
      promises.push(
        api.getFormResponse(investigation, form, this.state.authToken)
      );
    }

    return Promise.all(promises).then(([formData, responseData = []]) => {
      const response = responseData.length ? responseData[0] : {};

      this.setState({
        loading: false,
        steps: formData.form_json,
        uiSchema: formData.ui_schema_json,
        formInstanceId: formData.id,
        formData: response.json,
        responseId: response.id
      });
    });
  }

  send() {
    const { investigation, form } = this.props.match.params;
    const payload = {
      email: this.state.email,
      id: this.state.responseId,
      form_instance: this.state.formInstanceId,
      json: this.state.data,
      password: this.state.password
    };
    api
      .postResponse(payload, investigation, form, this.state.authToken)
      .then(() => {
        this.setState(
          {
            activeComponent: "thank-you"
          },
          () => {
            if (this.state.password) {
              this.logout();
            }
          }
        );
      })
      .catch(console.error);
  }

  submitData(event) {
    event.preventDefault();
    this.send();
  }

  finishForm(data) {
    this.setState({ data }, () => {
      if (this.state.authToken) {
        // this.send();

        this.setState({ showSummary: true });
      } else {
        this.setState({ activeComponent: "password" });
      }
    });
  }

  loginCallback({ email, token }) {
    this.setState({ authToken: token, email }, () => {
      this.loadData()
        .then(() => {
          this.setState({ activeComponent: token ? "summary" : "wizard" });
        })
        .catch(() => {
          this.setState({ error: true, loading: false });
        });
    });
  }

  logout() {
    localStorage.clear();
    this.setState({
      email: null,
      authToken: null,
      formData: {},
      isEdit: false
    });
  }

  setPassword(password) {
    this.setState({ password }, () => {
      this.send();
    });
  }

  render() {
    const { loading, error, activeComponent } = this.state;

    if (loading) {
      return <div>{t("form.loading")}</div>;
    }

    if (error) {
      return <div className="error"> {t("form.error")} </div>;
    }

    if (activeComponent === "thank-you") {
      return (
        <Redirect
          push
          to={{
            pathname: "/thank-you",
            state: { token: this.state.token }
          }}
        />
      );
    }

    if (activeComponent === "password") {
      return <SetPassword callback={this.setPassword} />;
    }

    if (activeComponent === "summary") {
      return (
        <Summary
          steps={this.state.steps}
          formData={this.state.formData}
          uiSchema={this.state.uiSchema}
        />
      );
    }

    if (activeComponent === "wizard") {
      return (
        <div>
          {this.state.email}
          <button onClick={this.logout}>Logout</button>
          <FormWizard
            steps={this.state.steps}
            currentStep={this.props.match.params.step}
            formData={this.state.formData}
            uiSchema={this.state.uiSchema}
            submitCallback={this.finishForm}
          />
        </div>
      );
    }

    return <Login callback={this.loginCallback} />;
  }
}

export default StateHolder;
