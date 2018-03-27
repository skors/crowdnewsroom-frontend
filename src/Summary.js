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

function StatusMessage() {
  return (
    <div className={`alert alert-success`}>
      You're submission is currently in the draft state. Feel free to make
      changes and submit it.
    </div>
  );
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
        <StatusMessage />

        <div className="card">
          <div className="card-body">
            {this.state.stepsTaken.map(step => (
              <Step
                step={step}
                key={step.schema.title}
                formData={this.props.formData}
                uiSchema={this.props.uiSchema}
              />
            ))}
            <div className="buttons">{this.props.children}</div>
          </div>
        </div>
      </div>
    );
  }
}

function getValueText(property, formData, values) {
  if (values.type === "boolean") {
    return formData[property] ? "Ja" : "Nein";
  }
  if (values.enum && values.enumNames) {
    return values.enumNames[values.enum.indexOf(formData[property])];
  }
  console.log(values);
  return values.title || formData[property];
}

function getKeyText(property, types, uiSchema) {
  return _.get(uiSchema, [property, "ui:title"], property);
}

function Step({ step, formData, uiSchema }) {
  const title = <h2> {step.schema.title} </h2>;
  const rows = _.map(step.schema.properties, (values, property) => {
    const valueText = getValueText(property, formData, values);
    const keyText = getKeyText(property, values.type, uiSchema);
    const isSignature =
      _.get(uiSchema, [property, "ui:widget"]) === "signatureWidget";
    const isFile = values.format === "data-url";
    const isHidden = _.get(uiSchema, [property, "ui:widget"]) === "hidden";

    let value;
    if (isFile) {
      value = <i>Datei</i>;
    } else if (isSignature) {
      value = <i>Unterschrift</i>;
    } else {
      value = valueText;
    }

    if (isHidden) {
      return <tr />;
    }

    return (
      <tr key={property}>
        <th style={{ width: "50%" }}>{keyText}</th>
        <td style={{ width: "50%" }}>{value}</td>
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
