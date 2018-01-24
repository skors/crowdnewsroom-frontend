import React from "react";

import Form from "react-jsonschema-form";
import "bootstrap/dist/css/bootstrap.css";
import SignatureWidget from "./SignatureField";

const log = type => console.log.bind(console, type);
const BASE_URL = process.env.REACT_APP_BACKEND_URL;

class CNRForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      schema: {},
      uiSchema: {}
    };
  }

  loadData() {
    fetch(`${BASE_URL}/forms/investigations/1/forms/2`)
      .then(response => response.json())
      .then(formData => {
        this.setState({
          schema: formData.form_json,
          uiSchema: formData.ui_schema_json
        });
      });
  }

  componentDidMount() {
    this.loadData().catch(console.error)
  }

  send(data) {
    fetch(`${BASE_URL}/forms/investigations/1/forms/2/responses`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    })
      .then(console.log)
      .catch(console.error);
  }

  render() {
    const { schema, uiSchema } = this.state;

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
