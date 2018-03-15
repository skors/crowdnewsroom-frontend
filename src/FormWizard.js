import React, { Component } from "react";
import Form from "react-jsonschema-form";
import * as _ from "lodash";
import Engine from "json-rules-engine-simplified";
import { CSSTransitionGroup } from "react-transition-group";
import PropTypes from "prop-types";

import "./FormWizard.css";

class FormWizard extends Component {
  static propTypes = {
    currentStep: PropTypes.string,
    submitCallback: PropTypes.func
  };

  constructor(props) {
    super(props);
    const { steps, formData } = props;
    this.state = {
      formData: formData,
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
    this.getNextStep(formData).then(this.setNextStep);
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
      return _.kebabCase(step.schema.title) === this.props.currentStep;
    });

    this.setNextStep(currentSchema.schema);
  }

  onSubmit = ({ formData }) => {
    if (this.state.schema.final) {
      this.props.submitCallback(formData);
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
