import React, { Component } from "react";

import "./OneLineWidget.css";

class OneLineWidget extends Component {
  render() {
    const props = this.props;
    return (
      <div>
        <p className="oneline">{props.schema.placeholder}</p>
      </div>
    );
  }
}

export default OneLineWidget;
