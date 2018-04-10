import React from "react";
import { Link, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import * as _ from "lodash";

import Card from "./Card";
import { t } from "./i18n";
import "./Summary.css";

class Summary extends React.Component {
  static propTypes = {
    steps: PropTypes.arrayOf(PropTypes.object),
    formData: PropTypes.object,
    uiSchema: PropTypes.object,
    stepsTaken: PropTypes.object
  };

  render() {
    if (Object.keys(this.props.formData).length === 0) {
      return <Redirect to="./start" />;
    }

    return (
      <Card
        logo={this.props.investigation.logo}
        title={this.props.investigation.name}
      >
        <div className="summary">
          <h1 className="summary__message">{t("summary.message")}</h1>
          <div className="summary__buttons">{this.props.children}</div>
          {Array.from(this.props.stepsTaken).map(schema => (
            <Step
              schema={schema}
              key={schema.title}
              formData={this.props.formData}
              uiSchema={_.get(this.props.uiSchema, schema.slug, {})}
            />
          ))}
          <div className="summary__buttons">{this.props.children}</div>
        </div>
      </Card>
    );
  }
}

function getValueText(property, formData, values) {
  if (values.type === "boolean") {
    return formData[property] ? t("summary.yes") : t("summary.no");
  }
  if (values.enum && values.enumNames) {
    return values.enumNames[values.enum.indexOf(formData[property])];
  }
  return formData[property];
}

function getKeyText(propertyKey, values, uiSchema) {
  const uiTitle = _.get(uiSchema, [propertyKey, "ui:title"]);
  const schemaTitle = values.title;
  return uiTitle || schemaTitle || propertyKey;
}

export function Row({ values, property, formData, uiSchema }) {
  const keyText = getKeyText(property, values, uiSchema);
  const isSignature =
    _.get(uiSchema, [property, "ui:widget"]) === "signatureWidget";
  const isFile = values.format === "data-url";
  const isFileCollection =
    values.type === "array" && values.items.format === "data-url";

  let value;
  if (isFile) {
    value = <i>{t("summary.file_uploaded")}</i>;
  } else if (isSignature) {
    value = <i>{t("summary.signature_given")}</i>;
  } else if (isFileCollection) {
    value = (
      <i>
        {t("summary.files_uploaded", {
          smart_count: formData[property].length
        })}
      </i>
    );
  } else {
    value = getValueText(property, formData, values);
  }

  return (
    <li>
      <h4 className="summary-step__question">{keyText}</h4>
      <p className="summary-step__answer">{value}</p>
    </li>
  );
}

export function Step({ schema, formData, uiSchema }) {
  const title = schema.title;

  const visibleFields = _.pickBy(schema.properties, (values, property) => {
    const isHidden = _.get(uiSchema, [property, "ui:widget"]) === "hidden";
    return !isHidden;
  });

  // If this step has only hidden inputs we hide the whole
  // thing completely. This is the case if this is a faked
  // purely informative step.
  if (_.isEmpty(visibleFields)) {
    return <div />;
  }

  const rows = _.map(visibleFields, (values, property) => (
    <Row
      key={property}
      values={values}
      property={property}
      formData={formData}
      uiSchema={uiSchema}
    />
  ));

  const order = uiSchema["ui:order"];
  if (order) {
    rows.sort((a, b) => order.indexOf(a.key) > order.indexOf(b.key));
  }

  return (
    <div className="summary-step">
      <h2 className="summary-step__title">{title}</h2>
      <ul className="summary-step__list">{rows}</ul>
      <Link className="btn btn-outline-primary btn-sm mb-4" to={schema.slug}>
        {t("summary.edit_item")}
      </Link>
    </div>
  );
}

export default Summary;
