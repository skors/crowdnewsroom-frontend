import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import Form from "react-jsonschema-form";

import SignatureWidget from "./SignatureField";
import { t } from "./i18n";

const log = type => console.log.bind(console, type);
const BASE_URL = process.env.REACT_APP_BACKEND_URL;

class CNRForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      schema: {},
      uiSchema: {},
      error: false,
      loading: true
    };
  }

  loadData() {
    return fetch(`${BASE_URL}/forms/investigations/1/forms/1`)
      .then(response => response.json())
      .then(formData => {
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
    fetch(`${BASE_URL}/forms/investigations/1/forms/1/responses`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: new Headers({
        "Content-Type": "application/json"
      })
    })
      .then(console.log)
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

    return (
      <Form
        schema={schema}
        uiSchema={uiSchema}
        widgets={{ signatureWidget: SignatureWidget }}
        onChange={log("changed")}
        onSubmit={this.send}
        onError={log("errors")}
      />
    );
  }
}

export default CNRForm;
