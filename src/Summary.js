import React from "react";
import * as _ from "lodash";

import PropTypes from "prop-types";

function Summary({ steps, formData, uiSchema }) {
  const stepsByProperties = steps.reduce((agg, step) => {
    const keys = _.keys(step.schema.properties);
    keys.forEach(key => (agg[key] = step.schema.title));
    return agg;
  }, {});

  const stepsTaken = _.uniq(
    _.map(_.keys(formData), entry => stepsByProperties[entry])
  );
  const filteredSteps = steps.filter(step =>
    stepsTaken.includes(step.schema.title)
  );

  return (
    <div className="summary">
      {filteredSteps.map(step => (
        <Step
          step={step}
          key={step.schema.title}
          formData={formData}
          uiSchema={uiSchema}
        />
      ))}
    </div>
  );
}

Summary.propTypes = {
  steps: PropTypes.arrayOf(PropTypes.object),
  formData: PropTypes.object,
  uiSchema: PropTypes.object
};

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
