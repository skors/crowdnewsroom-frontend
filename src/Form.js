import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import Form from "react-jsonschema-form";

import SignatureWidget from "./SignatureField";
import { t } from "./i18n";
import { Redirect } from "react-router-dom";
import * as api from "./api";

const log = type => console.log.bind(console, type);

class CNRForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      schema: {},
      uiSchema: {},
      formData: {},
      error: false,
      loading: true,
      submitted: false,
      token: null
    };

    this.send = this.send.bind(this);
  }

  loadData() {
    const { token, investigation, form } = this.props.match.params;
    if (token) {
      return api
        .getResponse(token)
        .then(formResponse => formResponse.json)
        .then(json => {
          this.setState({
            loading: false,
            schema: json.schema,
            uiSchema: json.uiSchema,
            formData: json.formData
          });
        });
    }

    return api.getForm(investigation, form).then(formData => {
      this.setState({
        loading: false,
        schema: formData.form_json,
        uiSchema: formData.ui_schema_json
      });
    });
  }

  componentDidMount() {
    this.loadData().catch(() => {
      this.setState({ error: true, loading: false });
    });
  }

  send(data) {
    api
      .postResponse(data)
      .then(response => {
        console.log(response);
        this.setState({
            submitted: true,
            token: response.token,
        });
      })
      .catch(console.error);
  }

  render() {
    const { schema, uiSchema, loading, error } = this.state;

    if (loading) {
      return <div>{t("form.loading")}</div>;
    }

    if (error) {
      return <div className="error"> {t("form.error")} </div>;
    }

    if (this.state.submitted) {
      console.log("token", this.state.token);
      return <Redirect push to={{
          pathname: '/thank-you',
          state: { token: this.state.token }
      }} />;
    }

    return (
      <Form
        schema={schema}
        uiSchema={uiSchema}
        formData={this.state.formData}
        widgets={{ signatureWidget: SignatureWidget }}
        onChange={log("changed")}
        onSubmit={this.send}
        onError={log("errors")}
      />
    );
  }
}

export default CNRForm;
