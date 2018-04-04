import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";

import "./StateHolder.css";
import FormWizard from "./FormWizard";
import Summary from "./Summary";
import { t } from "./i18n";
import * as api from "./api";
import { trackSubmission } from "./tracking";

function unloadListener(e) {
  const dialogText = t("form.confirm_close");
  e.returnValue = dialogText;
  return dialogText;
}

class StateHolder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uiSchema: {},
      formData: {},
      error: false,
      loading: true,
      formInstanceId: null,
      investigation: {},
      steps: [],
      sending: false,
      stepsTaken: new Set()
    };

    this.send = this.send.bind(this);
    this.finishForm = this.finishForm.bind(this);
  }

  componentDidMount() {
    window.addEventListener("beforeunload", unloadListener);
    this.loadData();
  }

  loadData() {
    const { investigation, form } = this.props.match.params;
    const promises = [
      api.getForm(investigation, form),
      api.getInvestigation(investigation)
    ];

    return Promise.all(promises)
      .then(([formData, investigationData]) => {
        this.setState({
          loading: false,
          steps: formData.form_json,
          uiSchema: formData.ui_schema_json,
          formInstanceId: formData.id,
          investigation: investigationData
        });
      })
      .catch(() => {
        this.setState({ error: true, loading: false });
      });
  }

  send() {
    const { investigation, form } = this.props.match.params;
    this.setState({ sending: true });
    trackSubmission();
    const payload = {
      email: this.state.email,
      form_instance: this.state.formInstanceId,
      json: this.state.formData
    };
    api
      .postResponse(payload, investigation, form, this.state.authToken)
      .then(response => {
        window.removeEventListener("beforeunload", unloadListener);
        window.location = response.redirect_url;
      })
      .catch(console.error);
  }

  finishForm(formData, stepsTaken) {
    this.setState({ formData, stepsTaken }, () => {
      this.props.history.push(`${this.props.match.url}/summary`);
    });
  }

  render() {
    const { loading, error } = this.state;

    if (loading) {
      return (
        <div className="state-holder__message state-holder__message--loading">
          {t("form.loading")}
        </div>
      );
    }

    if (error) {
      return (
        <div className="state-holder__message state-holder__message--error">
          {t("form.error")}
        </div>
      );
    }

    return (
      <Switch>
        <Route exact strict path={`${this.props.match.path}`}>
          <Redirect to={`${this.props.match.url}/start`} />
        </Route>

        <Route exact strict path={`${this.props.match.path}/`}>
          <Redirect to={`${this.props.match.url}start`} />
        </Route>

        <Route path={`${this.props.match.path}/summary`}>
          <Summary
            investigation={this.state.investigation}
            steps={this.state.steps}
            formData={this.state.formData}
            uiSchema={this.state.uiSchema}
            stepsTaken={this.state.stepsTaken}
          >
            {this.state.sending ? (
              <button className="btn btn-primary btn-lg btn-block" disabled>
                <FontAwesomeIcon icon="spinner" spin />
                {t("form.submitting")}
              </button>
            ) : (
              <button
                className="btn btn-primary btn-lg btn-block"
                onClick={this.send}
              >
                {t("form.submit")}
              </button>
            )}
          </Summary>
        </Route>

        <Route
          path={`${this.props.match.path}/:step`}
          render={({ match }) => {
            return (
              <FormWizard
                investigation={this.state.investigation}
                steps={this.state.steps}
                formData={this.state.formData}
                uiSchema={this.state.uiSchema}
                history={this.props.history}
                submitCallback={this.finishForm}
                match={match}
              />
            );
          }}
        />
      </Switch>
    );
  }
}

export default StateHolder;
