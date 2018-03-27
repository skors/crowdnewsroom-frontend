import React from "react";

import { t } from "./i18n";
import { Redirect } from "react-router-dom";
import * as api from "./api";
import FormWizard from "./FormWizard";
import Summary from "./Summary";

import "./StateHolder.css";

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
      submissionStatus: "D",
      investigation: {}
    };

    this.send = this.send.bind(this);
    this.finishForm = this.finishForm.bind(this);
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    const { investigation, form } = this.props.match.params;
    const promises = [
      api.getForm(investigation, form),
      api.getInvestigation(investigation)
    ];

    return Promise.all(promises).then(([formData, investigationData]) => {
      this.setState({
        loading: false,
        steps: formData.form_json,
        uiSchema: formData.ui_schema_json,
        formInstanceId: formData.id,
        activeComponent: "wizard",
        investigation: investigationData
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
      return (
        <div className="state-holder__message state-holder__message--loading">
          {t("form.loading")}
        </div>
      );
    }

    if (error) {
      return (
        <div className="state-holder__message--error"> {t("form.error")} </div>
      );
    }

    if (activeComponent === "wizard") {
      return (
        <div>
          <FormWizard
            investigation={this.state.investigation}
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
            investigaiton={this.state.investigation}
            status={this.state.submissionStatus}
            steps={this.state.steps}
            formData={this.state.formData}
            uiSchema={this.state.uiSchema}
          >
            <button
              className="btn btn-outline-primary mr-2"
              onClick={() => this.setActiveComponent("wizard")}
            >
              Bearbeiten
            </button>
            <button className="btn btn-primary" onClick={this.send}>
              Senden
            </button>
          </Summary>
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
