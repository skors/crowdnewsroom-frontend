import React, { Component } from "react";

class PatternTypeTextInputWidget extends Component {
  render() {
    const props = this.props;
    return (
      <input
        placeholder={props.placeholder}
        className="form-control"
        value=""
        id={props.id}
        pattern={props.schema.pattern}
        type={props.schema.field_type ? props.schema.field_type : "text"}
      />
    );
  }
}

export default PatternTypeTextInputWidget;
