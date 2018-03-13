import React, { Component } from "react";
import Form from "react-jsonschema-form";
import * as _ from "lodash";
import Engine from "json-rules-engine-simplified";
import { CSSTransitionGroup } from "react-transition-group";

import "./FormWizard.css";

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
  }

  getNextStep(formData) {
    return this.engine.run(formData).then(events => {
      const validSteps = events.map(event => event.schema);
      const nextStep = _.find(
        validSteps,
        step => !_.includes(this.state.stepsTaken, step)
      );
      this.setState({ stepsTaken: [...this.state.stepsTaken, nextStep] });
      return nextStep;
    });
  }

  advance(formData) {
    this.getNextStep(formData).then(nextSchema => {
      this.setState({
        schema: nextSchema,
        formData: {
          ...this.state.formData,
          ...formData
        }
      });
    });
  }

  componentWillMount() {
    if (!this.props.currentStep) return;

    const currentSchema = _.find(this.props.steps, step => {
      return _.kebabCase(step.schema.title) === this.props.currentStep;
    });

    this.setState({ schema: currentSchema.schema });
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
