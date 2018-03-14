import React, { Component } from "react";
import Form from "react-jsonschema-form";
import * as _ from "lodash";
import Engine from "json-rules-engine-simplified";
import { CSSTransitionGroup } from "react-transition-group";

import "./FormWizard.css";

const getSlugForSchema = ({ title }) => _.kebabCase(title);

class FormWizard extends Component {
  constructor(props) {
    super(props);
    const { steps } = props;
    this.state = {
      formData: {},
      schema: steps[0].schema,
      stepsTaken: [steps[0].schema]
    };
    const rules = steps.map(step => {
      return { conditions: step.conditions, event: { schema: step.schema } };
    });
    this.engine = new Engine(rules);
    this.setNextStep = this.setNextStep.bind(this);
  }

  getNextStep(formData) {
    return this.engine.run(formData).then(events => {
      const validSteps = events.map(event => event.schema);
      return _.find(
        validSteps,
        step => !_.includes(this.state.stepsTaken, step)
      );
    });
  }

  advance(formData) {
    this.getNextStep(formData).then(nextSchema => {
      this.setNextStep(nextSchema);
      this.props.history.push(`./${getSlugForSchema(nextSchema)}`);
    });
    this.updateFormData(formData);
  }

  setNextStep(nextSchema) {
    this.setState({
      schema: nextSchema,
      stepsTaken: [...this.state.stepsTaken, nextSchema]
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

  componentWillMount() {
    if (!this.props.currentStep) return;

    const currentSchema = _.find(this.props.steps, step => {
      return getSlugForSchema(step.schema) === this.props.currentStep;
    });

    this.setNextStep(currentSchema.schema);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.currentStep === this.props.currentStep) return;

    const currentSchema = _.find(nextProps.steps, step => {
      return getSlugForSchema(step.schema) === nextProps.currentStep;
    });

    this.setNextStep(currentSchema.schema);
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
          />
        </CSSTransitionGroup>
      </div>
    );
  }
}
export default FormWizard;
