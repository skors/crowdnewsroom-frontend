import React, { Component } from "react";
import { Link } from "react-router-dom";
import Form from "react-jsonschema-form";
import * as _ from "lodash";
import Engine from "json-rules-engine-simplified";
import { CSSTransitionGroup } from "react-transition-group";
import PropTypes from "prop-types";

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
  }

  updateRoute(schema) {
    this.props.history.push(`./${schema.slug}`);
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
    this.resetToFirstStep();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentStep === this.props.currentStep) return;

    const currentSchema = _.find(nextProps.steps, step => {
      return step.schema.slug === nextProps.currentStep;
    });

    const stepsTaken = [...this.state.stepsTaken];
    const currentIndex = stepsTaken.indexOf(currentSchema.schema);

    this.setState({
      stepsTaken: new Set(stepsTaken.slice(0, currentIndex + 1)),
      schema: currentSchema.schema
    });
  }

  onSubmit = ({ formData }) => {
    if (this.state.schema.final) {
      this.props.submitCallback(formData);
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
    return errors.map(error => {
      if (error.name === "required") {
        error.message = "Dieses Feld muss ausgefüllt sein.";
      }
      return error;
    });
  }

  render() {
    const uiSchema = _.get(this.props.uiSchema, this.state.schema.slug, {});
    return (
      <div className="form-wizard card">
        <img
          src={this.props.investigation.logo}
          alt={this.props.investigation.name}
          className="form-wizard__logo"
        />
        <CSSTransitionGroup
          className="form-wizard__transition-container"
          transitionName="form-wizard__transition"
          transitionEnterTimeout={800}
          transitionLeaveTimeout={400}
        >
          <div className="form-wizard__body" key={this.state.schema.slug}>
            <Form
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
                  Zurück
                </Link>
              )}
              <input className="btn btn-primary" type="submit" value="Weiter" />
            </Form>
          </div>
        </CSSTransitionGroup>
      </div>
    );
  }
}
export default FormWizard;
