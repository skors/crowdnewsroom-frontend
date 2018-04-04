import React, { Component } from "react";
import { Link } from "react-router-dom";
import Form from "react-jsonschema-form";
import * as _ from "lodash";
import Engine from "json-rules-engine-simplified";
import { CSSTransitionGroup } from "react-transition-group";
import PropTypes from "prop-types";
import { trackPageView } from "./tracking";

import { t } from "./i18n";
import Card from "./Card";
import SignatureWidget from "./SignatureWidget";
import ButtonWidget from "./ButtonWidget";
import "./FormWizard.css";

class FormWizard extends Component {
  static propTypes = {
    currentStep: PropTypes.string,
    steps: PropTypes.arrayOf(PropTypes.object),
    submitCallback: PropTypes.func,
    formData: PropTypes.object
  };

  constructor(props) {
    super(props);
    const { steps, formData } = props;
    this.state = {
      formData,
      schema: steps[0].schema,
      stepsTaken: new Set()
    };
    const rules = steps.map(step => {
      return { conditions: step.conditions, event: { schema: step.schema } };
    });
    this.engine = new Engine(rules);
    this.setNextStep = this.setNextStep.bind(this);
    this.transformErrors = this.transformErrors.bind(this);
  }

  updateRoute(schema) {
    const url = `./${schema.slug}`;
    trackPageView(url);
    this.props.history.push(url);
  }

  getValidSteps(formData) {
    return this.engine.run(formData).then(events => {
      return events.map(event => event.schema);
    });
  }

  getNextStep(formData) {
    return this.getValidSteps(formData).then(validSteps =>
      _.find(validSteps, step => !this.state.stepsTaken.has(step))
    );
  }

  advance(formData) {
    this.getNextStep(formData).then(nextSchema => {
      this.setNextStep(nextSchema);
      this.updateRoute(nextSchema);
    });
    this.updateFormData(formData);
  }

  setNextStep(nextSchema) {
    this.setState({
      schema: nextSchema,
      stepsTaken: this.state.stepsTaken.add(nextSchema)
    });
  }

  updateFormData(formData) {
    return this.getValidSteps(formData).then(events => {
      // remove steps that are not valid anymore if a new path is taken
      const validProperties = _.flatMap(events, event => {
        return _.keys(event.properties);
      });

      const newState = { ...this.state.formData, ...formData };
      _.each(_.keys(newState), key => {
        if (!_.includes(validProperties, key)) {
          delete newState[key];
        }
      });

      this.setState({
        formData: newState
      });
    });
  }

  resetToFirstStep() {
    const nextStep = this.props.steps[0].schema;
    this.setState({ stepsTaken: new Set() });
    this.setNextStep(nextStep);
    this.updateRoute(nextStep);
  }

  async componentDidMount() {
    const currentSchema = _.find(this.props.steps, step => {
      return step.schema.slug === this.props.match.params.step;
    });

    const stepsTaken = new Set();
    // We need to somehow remember if we can get to the selected
    // state at all with the current formData. For that we
    // use this boolean. If we find not way we rest to the start
    let found = false;

    this.getValidSteps(this.state.formData).then(events => {
      for (let schema of events) {
        stepsTaken.add(schema);
        if (schema.slug === this.props.match.params.step) {
          found = true;
          break;
        }
      }

      if (stepsTaken.size && found) {
        this.setState({
          stepsTaken,
          schema: currentSchema.schema
        });
      } else {
        this.resetToFirstStep();
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.match.params.currentStep === this.props.match.params.step)
      return;

    const currentSchema = _.find(nextProps.steps, step => {
      return step.schema.slug === nextProps.match.params.step;
    });

    const stepsTaken = Array.from(this.state.stepsTaken);
    const currentIndex = stepsTaken.indexOf(currentSchema.schema);

    this.setState({
      stepsTaken: new Set(stepsTaken.slice(0, currentIndex + 1)),
      schema: currentSchema.schema
    });
  }

  onSubmit = ({ formData }) => {
    if (this.state.schema.final) {
      this.props.submitCallback(formData, this.state.stepsTaken);
    } else {
      this.advance(formData);
    }
  };

  get backLink() {
    const stepsTaken = [...this.state.stepsTaken];
    const previousStep = stepsTaken[stepsTaken.length - 2];
    return previousStep.slug;
  }

  maybeAutoAdvance(event) {
    const properties = event.schema.properties;
    const autoFields = new Set(["boolean", "enum"]);
    const propertyNames = _.keys(properties);
    const types = _.uniq(_.map(properties, p => (p.enum ? "enum" : p.type)));
    const fields = new Set(_.keys(event.formData));
    const allFilled = _.every(propertyNames, p => fields.has(p));
    const allAuto = _.every(types, p => autoFields.has(p));
    if (allAuto && allFilled) {
      this.onSubmit(event);
    }
  }

  transformErrors(errors) {
    const uiSchema = _.get(this.props.uiSchema, this.state.schema.slug, {});
    return errors.map(error => {
      // the errors always start with a dot we remove it to get
      // `property` from `.property`
      const propertyName = error.property.slice(1, error.property.length);

      const widget = _.get(uiSchema, [propertyName, "ui:widget"]);
      const isSignature = widget === "signatureWidget";

      if (error.name === "required") {
        error.message = t("errors.required");
      }
      if (error.name === "type" && error.params.type === "boolean") {
        error.message = t("errors.boolean");
      }
      if (isSignature) {
        error.message = t("errors.signature");
      }
      return error;
    });
  }

  render() {
    const uiSchema = _.get(this.props.uiSchema, this.state.schema.slug, {});
    return (
      <Card
        logo={this.props.investigation.logo}
        title={this.props.investigation.name}
        dataPrivacyUrl={this.props.investigation.data_privacy_url}
      >
        <CSSTransitionGroup
          className="form-wizard__transition-container"
          transitionName="form-wizard__transition"
          transitionEnterTimeout={800}
          transitionLeaveTimeout={400}
        >
          <Form
            key={this.state.schema.slug}
            className="form-wizard__form"
            schema={this.state.schema}
            uiSchema={uiSchema}
            onChange={this.maybeAutoAdvance}
            onSubmit={this.onSubmit}
            formData={this.state.formData}
            widgets={{
              signatureWidget: SignatureWidget,
              buttonWidget: ButtonWidget
            }}
            transformErrors={this.transformErrors}
            showErrorList={false}
          >
            {this.state.stepsTaken.size > 1 && (
              <Link
                className="btn btn-outline-primary mr-2"
                to={`./${this.backLink}`}
              >
                {t("form.back")}
              </Link>
            )}
            <input className="btn btn-primary" type="submit" value="Weiter" />
          </Form>
        </CSSTransitionGroup>
      </Card>
    );
  }
}
export default FormWizard;
