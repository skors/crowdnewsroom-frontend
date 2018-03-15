import React from "react";
import "bootstrap/dist/css/bootstrap.css";

import { t } from "./i18n";
import { Redirect } from "react-router-dom";
import * as api from "./api";
import Checker from "./Checker";
import FormWizard from "./FormWizard";
import Login from "./Login";

class CNRForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      schema: {},
      status: "D",
      uiSchema: {},
      formData: {},
      error: false,
      loading: true,
      submitted: false,
      token: null,
      email: null,
      authToken: null,
      data: {},
      isUpdate: false,
      formInstanceId: null
    };

    this.send = this.send.bind(this);
    this.updateEmail = this.updateEmail.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.submitData = this.submitData.bind(this);
    this.loginCallback = this.loginCallback.bind(this);
    this.logout = this.logout.bind(this);
  }

  updateEmail(event) {
    this.setState({ email: event.target.value });
  }

  loadData() {
    const { token, investigation, form } = this.props.match.params;
    if (token) {
      return api
        .getResponse(token)
        .then(formResponse => {
          this.setState({
            status: formResponse.status,
            email: formResponse.email,
            token: formResponse.token,
            isUpdate: true,
            formInstanceId: formResponse.id
          });
          return formResponse;
        })
        .then(formResponse => formResponse.json)
        .then(json =>
          this.setState({
            loading: false,
            schema: json.schema,
            uiSchema: json.uiSchema,
            formData: json.formData
          })
        );
    }

    return api.getForm(investigation, form).then(formData => {
      this.setState({
        loading: false,
        steps: formData.form_json,
        uiSchema: formData.ui_schema_json,
        formInstanceId: formData.id
      });
    });
  }

  componentDidMount() {
    this.loadData().catch(() => {
      this.setState({ error: true, loading: false });
    });
  }

  send() {
    const { investigation, form } = this.props.match.params;
    const payload = {
      email: this.state.email,
      json: this.state.data,
      token: this.state.token,
      form_instance: this.state.formInstanceId
    };
    api
      .postResponse(payload, investigation, form)
      .then(response => {
        this.setState({
          submitted: true,
          token: response.token
        });
      })
      .catch(console.error);
  }

  submitData(event) {
    event.preventDefault();
    this.send();
  }

  submitForm(data) {
    this.setState({ formSubmitted: true, data }, () => {
      if (this.state.email) {
        this.send();
      }
    });
  }

  loginCallback({ email, token }) {
    this.setState({ authToken: token, email });
  }

  logout() {
    localStorage.clear();
    this.setState({ email: null, authToken: null });
  }

  render() {
    const { loading, error } = this.state;

    if (loading) {
      return <div>{t("form.loading")}</div>;
    }

    if (error) {
      return <div className="error"> {t("form.error")} </div>;
    }

    if (this.state.submitted) {
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

    if (this.state.email) {
      return (
        <div>
          {this.state.email}
          <button onClick={this.logout}>Logout</button>
          <FormWizard
            steps={this.state.steps}
            currentStep={this.props.match.params.step}
            formData={this.state.formData}
            uiSchema={this.state.uiSchema}
            submitCallback={data => alert(data)}
          />
        </div>
      );
    }

    return <Login callback={this.loginCallback} />;
  }
}

export default CNRForm;
