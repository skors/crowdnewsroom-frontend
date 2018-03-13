import React, { Component } from "react";
import Form from "react-jsonschema-form";
import * as _ from "lodash";
import Engine from "json-rules-engine-simplified";

class StepForm extends Component {
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
      <Form
        schema={this.state.schema}
        uiSchema={this.props.uiSchema}
        onSubmit={this.onSubmit}
        formData={this.state.formData}
      />
    );
  }
}
export default StepForm;
