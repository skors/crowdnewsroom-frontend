import React from "react";
import "bootstrap/dist/css/bootstrap.css";

import { t } from "./i18n";
import { Redirect } from "react-router-dom";
import * as api from "./api";
import FormWizard from "./FormWizard";
import Summary from "./Summary";

class StateHolder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      schema: {},
      uiSchema: {},
      formData: {},
      error: false,
      loading: true,
      activeComponent: null,
      formInstanceId: null,
      submissionStatus: "D"
    };

    this.send = this.send.bind(this);
    this.finishForm = this.finishForm.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    const { investigation, form } = this.props.match.params;

    return api.getForm(investigation, form).then(formData => {
      this.setState({
        loading: false,
        steps: formData.form_json,
        uiSchema: formData.ui_schema_json,
        formInstanceId: formData.id,
        activeComponent: "wizard"
      });
    });
  }

  send() {
    const { investigation, form } = this.props.match.params;
    const payload = {
      email: this.state.email,
      form_instance: this.state.formInstanceId,
      json: this.state.formData
    };
    api
      .postResponse(payload, investigation, form, this.state.authToken)
      .then(() => {
        this.setState({
          activeComponent: "thank-you"
        });
      })
      .catch(console.error);
  }

  finishForm(formData) {
    this.setState({ formData, activeComponent: "confirmation" });
  }

  setActiveComponent(activeComponent) {
    this.setState({ activeComponent });
  }

  render() {
    const { loading, error, activeComponent } = this.state;

    if (loading) {
      return <div>{t("form.loading")}</div>;
    }

    if (error) {
      return <div className="error"> {t("form.error")} </div>;
    }

    if (activeComponent === "wizard") {
      return (
        <div>
          <FormWizard
            steps={this.state.steps}
            currentStep={this.props.match.params.step}
            formData={this.state.formData}
            uiSchema={this.state.uiSchema}
            history={this.props.history}
            submitCallback={this.finishForm}
          />
        </div>
      );
    }

    if (activeComponent === "confirmation") {
      return (
        <div>
          <Summary
            status={this.state.submissionStatus}
            steps={this.state.steps}
            formData={this.state.formData}
            uiSchema={this.state.uiSchema}
          />
          <button onClick={this.send}>Submit</button>
          <button onClick={() => this.setActiveComponent("wizard")}>
            Edit
          </button>
        </div>
      );
    }

    if (activeComponent === "thank-you") {
      const { investigation, form } = this.props.match.params;
      return (
        <Redirect
          push
          to={{
            pathname: "/thank-you",
            state: { investigation, form }
          }}
        />
      );
    }
  }
}

export default StateHolder;
