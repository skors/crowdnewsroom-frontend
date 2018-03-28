import React from "react";
import PropTypes from "prop-types";
import Engine from "json-rules-engine-simplified";
import * as _ from "lodash";
import "./Summary.css";

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
      Bitte überprüfen Sie Ihre Angaben:
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
        <div className="card">
          <div className="card-body">
            <StatusMessage />
            {this.state.stepsTaken.map(step => (
              <Step
                step={step}
                key={step.schema.title}
                formData={this.props.formData}
                uiSchema={_.get(this.props.uiSchema, step.schema.slug, {})}
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
  const title = step.schema.title;
  const rows = _.map(step.schema.properties, (values, property) => {
    const valueText = getValueText(property, formData, values);
    const keyText = getKeyText(property, values.type, uiSchema);
    const isSignature =
      _.get(uiSchema, [property, "ui:widget"]) === "signatureWidget";
    const isFile = values.format === "data-url";
    const isHidden = _.get(uiSchema, [property, "ui:widget"]) === "hidden";

    let value;
    if (isFile) {
      value = <i>Datei hochgeladen</i>;
    } else if (isSignature) {
      value = <i>Unterschrift geleistet</i>;
    } else {
      value = valueText;
    }

    if (isHidden) {
      return <tr />;
    }

    return (
      <li key={property}>
        <h4 className="summary-step__question">{keyText}</h4>
        <p className="summary-step__answer">{value}</p>
      </li>
    );
  });

  return (
    <div className="summary-step">
      <h2 className="summary-step__title">{title}</h2>
      <ul className="summary-step__list">{rows}</ul>
    </div>
  );
}

export default Summary;
