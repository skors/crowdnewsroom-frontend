import React, { Component } from "react";

class ButtonWidget extends Component {
  constructor(props) {
    super(props);
    this.set = this.set.bind(this);
  }

  set(event) {
    this.props.onChange(event.target.value === "true");
  }

  render() {
    if (this.props.schema.type === "boolean") {
      return (
        <div>
          <label
            className={
              "btn btn-secondary " + (this.props.value === true && "active")
            }
          >
            {this.props.schema.enumNames[0]}
            <input
              className="sr-only"
              type="radio"
              name={this.props.id}
              value="true"
              onChange={this.set}
            />
          </label>
          <label
            className={
              "btn btn-secondary " + (this.props.value === false && "active")
            }
          >
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
      );
    }

    return <div />;
  }
}

export default ButtonWidget;
