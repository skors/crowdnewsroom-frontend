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
    props.onChange(this.state.value === "" ? "" : this.state.value);
    return (
      <input
        placeholder={props.placeholder}
        className="form-control"
        value={own_this.state.value}
        onChange={e => {
          own_this.setState({ value: e.target.value });
        }}
        id={props.id}
        pattern={props.schema.pattern ? props.schema.pattern : false}
        type={props.schema.field_type ? props.schema.field_type : "text"}
      />
    );
  }
}

export default PatternTypeTextInputWidget;
