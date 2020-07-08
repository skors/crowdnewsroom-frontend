import React, { Component } from "react";

class PatternTypeTextInputWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ""
    };
  }

  render() {
    const props = this.props;
    const own_this = this;

    return (
      <input
        placeholder={props.placeholder}
        className="form-control"
        value={own_this.state.value}
        name={this.props.id}
        onChange={e => {
          own_this.setState({ value: e.target.value });
        }}
        id={props.id}
        pattern={props.schema.pattern}
        type={props.schema.field_type ? props.schema.field_type : "text"}
      />
    );
  }
}

export default PatternTypeTextInputWidget;
