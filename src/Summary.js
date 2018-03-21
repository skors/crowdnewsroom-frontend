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

    return (
      <tr key={property}>
        <th>{keyText}</th>
        <td>{valueText}</td>
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