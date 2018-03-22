import React from "react";
import PropTypes from "prop-types";
import Engine from "json-rules-engine-simplified";
import * as _ from "lodash";

function filterSteps(steps, formData) {
  const rules = steps.map(step => {
    return { conditions: step.conditions, event: { schema: step.schema } };
  });
  const engine = new Engine(rules);
  return engine.run(formData);
}

function StatusMessage({ status }) {
  const messages = {
    D:
      "You're submission is currently in the draft state. Feel free to make changes and submit it.",
    S:
      "You're submission has been submitted but not reviewd yet. Feel free to make changes"
  };
  const classNames = {
    D: "alert-primary",
    S: "alert-success"
  };
  const message = _.get(messages, status, "You cannot change it anymore.");
  const className = _.get(classNames, status, "alert-secondary");

  return <div className={`alert ${className}`}> {message}</div>;
}

class Summary extends React.Component {
  static propTypes = {
    steps: PropTypes.arrayOf(PropTypes.object),
    formData: PropTypes.object,
    uiSchema: PropTypes.object
  };

  state = {
    stepsTaken: []
  };

  async componentDidMount() {
    const { steps, formData } = this.props;
    this.setState({
      stepsTaken: await filterSteps(steps, formData)
    });
  }

  render() {
    return (
      <div className="summary">
        <StatusMessage status={this.props.status} />

        {this.state.stepsTaken.map(step => (
          <Step
            step={step}
            key={step.schema.title}
            formData={this.props.formData}
            uiSchema={this.props.uiSchema}
          />
        ))}
      </div>
    );
  }
}

function getValueText(property, formData, type) {
  if (type === "boolean") {
    return formData[property] ? "Yes" : "No";
  }
  return formData[property];
}

function getKeyText(property, types, uiSchema) {
  return _.get(uiSchema, [property, "ui:title"], property);
}

function Step({ step, formData, uiSchema }) {
  const title = <h2> {step.schema.title} </h2>;
  const rows = _.map(step.schema.properties, (values, property) => {
    const valueText = getValueText(property, formData, values.type);
    const keyText = getKeyText(property, values.types, uiSchema);
    const isFile = values.format === "data-url";
    let value;
    if (isFile) {
      value = (
        <img
          alt="uploaded document"
          src={valueText}
          style={{ maxWidth: "50%", maxHeight: "400px" }}
        />
      );
    } else {
      value = valueText;
    }

    return (
      <tr key={property}>
        <th>{keyText}</th>
        <td>{value}</td>
      </tr>
    );
  });

  return (
    <div className="step">
      {title}
      <table>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}

export default Summary;
