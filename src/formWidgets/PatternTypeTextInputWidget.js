import React, { Component } from "react";

class PatternTypeTextInputWidget extends Component {
  render() {
    const props = this.props;
    return (
      <input
        placeholder={this.props.placeholder}
        className="form-control"
        value=""
        pattern={this.props.schema.pattern}
        type={
          this.props.schema.field_type ? this.props.schema.field_type : "text"
        }
      />
    );
  }
}

export default PatternTypeTextInputWidget;
