import React, { Component } from "react";
import { Link } from "react-router-dom";
import Form from "react-jsonschema-form";
import { CSSTransitionGroup } from "react-transition-group";
import * as _ from "lodash";
import Engine from "json-rules-engine-simplified";
import PropTypes from "prop-types";

import "./FormWizard.css";

const getSlugForSchema = ({ title }) => _.kebabCase(title);

class FormWizard extends Component {
  static propTypes = {
    currentStep: PropTypes.string
  };

  constructor(props) {
    super(props);
    const { steps } = props;
    this.state = {
      formData: {},
      schema: {},
      stepsTaken: new Set()
    };
    const rules = steps.map(step => {
      return { conditions: step.conditions, event: { schema: step.schema } };
    });
    this.engine = new Engine(rules);
    this.setNextStep = this.setNextStep.bind(this);
  }

  updateRoute(schema) {
    this.props.history.push(`./${getSlugForSchema(schema)}`);
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
    this.setState({
      formData: {
        ...this.state.formData,
        ...formData
      }
    });
  }

  resetToFirstStep() {
    const nextStep = this.props.steps[0].schema;
    this.setNextStep(nextStep);
    this.updateRoute(nextStep);
  }

  setStepFromUrl() {
    const currentSchema = _.find(this.props.steps, step => {
      return getSlugForSchema(step.schema) === this.props.currentStep;
    });

    this.setNextStep(currentSchema.schema);
  }

  componentWillMount() {
    this.getValidSteps(this.state.formData).then(validSteps => {
      const isValidStep = _.some(
        validSteps,
        step => getSlugForSchema(step.title) === this.props.currentStep
      );

      if (isValidStep) {
        this.setStepFromUrl();
      } else {
        this.resetToFirstStep();
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentStep === this.props.currentStep) return;

    const currentSchema = _.find(nextProps.steps, step => {
      return getSlugForSchema(step.schema) === nextProps.currentStep;
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
      this.props.submitCallback(
        "You submitted " + JSON.stringify(formData, null, 2)
      );
    } else {
      this.advance(formData);
    }
  };

  get backLink() {
    const stepsTaken = [...this.state.stepsTaken];
    const previousStep = stepsTaken[stepsTaken.length - 2];
    return getSlugForSchema(previousStep);
  }

  render() {
    return (
      <div className="form-transition-container">
        <CSSTransitionGroup
          transitionName="form-transition"
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}
        >
          <Form
            key={this.state.schema.title}
            schema={this.state.schema}
            uiSchema={this.props.uiSchema}
            onSubmit={this.onSubmit}
            formData={this.state.formData}
          >
            {this.state.stepsTaken.size > 1 && (
              <Link to={`./${this.backLink}`}>Prev</Link>
            )}
            <input type="submit" />
          </Form>
        </CSSTransitionGroup>
      </div>
    );
  }
}
export default FormWizard;
