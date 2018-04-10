import React, { Component } from "react";
import classNames from "classnames";

import "./ButtonWidget.css";

class ButtonWidget extends Component {
  constructor(props) {
    super(props);
    this.set = this.set.bind(this);
  }

  set(event) {
    this.props.onChange(event.target.value === "true");
  }

  activeClassName(isActive) {
    return classNames("button-widget__button", "btn", {
      "btn-primary": this.props.value === isActive,
      "btn-secondary": this.props.value !== isActive
    });
  }

  render() {
    if (this.props.schema.type === "boolean") {
      return (
        <div>
          <div>
            <label className={this.activeClassName(true)}>
              {this.props.schema.enumNames[0]}
              <input
                className="sr-only"
                type="radio"
                name={this.props.id}
                value="true"
                onChange={this.set}
              />
            </label>
          </div>
          <div>
            <label className={this.activeClassName(false)}>
              {this.props.schema.enumNames[1]}
              <input
                type="radio"
                className="sr-only"
                name={this.props.id}
                value="false"
                onChange={this.set}
              />
            </label>
          </div>
        </div>
      );
    }

    return <div />;
  }
}

export default ButtonWidget;
