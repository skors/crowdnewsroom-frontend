import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import Form from "react-jsonschema-form";

import SignatureWidget from "./SignatureField";
import { t } from "./i18n";
import { Redirect } from "react-router-dom";
import * as api from "./api";
import Checker from "./Checker";

const log = type => console.log.bind(console, type);

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
      data: {},
      isUpdate: false,
      formInstanceId: null
    };

    this.send = this.send.bind(this);
    this.updateEmail = this.updateEmail.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.submitData = this.submitData.bind(this);
  }

  get isDisabled() {
    return ["I", "V"].includes(this.state.status);
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
        schema: formData.form_json,
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

  render() {
    const { schema, uiSchema, loading, error } = this.state;
    let message;

    if (loading) {
      return <div>{t("form.loading")}</div>;
    }

    if (error) {
      return <div className="error"> {t("form.error")} </div>;
    }

    if (this.isDisabled) {
      message = t("form.verified_message");
    }

    if (
      this.state.formSubmitted &&
      !this.state.submitted &&
      !this.state.isUpdate
    ) {
      return (
        <div>
          <Checker text="Almost done!" />

          <p>
            This looks really good. Thank you so much! <br />
            Now there is just one more thing that we need from you: Please put
            in your e-mail address so that we can contact you if we have
            questions. This will also allow you to come back and edit your
            response later.
          </p>
          <form onSubmit={this.submitData}>
            <label htmlFor="email">E-Mail</label>
            <input
              name="email"
              type="email"
              onChange={this.updateEmail}
              value={this.email}
            />
            <input type="submit" value="Submit!" />
          </form>
        </div>
      );
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

    return (
      <div>
        <p className="message">{message}</p>

        <Form
          schema={schema}
          uiSchema={uiSchema}
          formData={this.state.formData}
          widgets={{ signatureWidget: SignatureWidget }}
          onSubmit={this.submitForm}
          onError={log("errors")}
        />
      </div>
    );
  }
}

export default CNRForm;
