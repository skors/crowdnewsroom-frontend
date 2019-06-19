import React, { Component } from "react";

import "./LocationWidget.css";

class LocationWidget extends Component {
  constructor(props) {
    super(props);
    this.set = this.set.bind(this);
  }

  set(event) {
    this.props.onChange(event.target.value === "true");
  }

  render() {
    return (
      <div class="location">
        <button class="button" name={this.props.id}>
          <i class="fi-marker" />
          <span>{this.props.schema.title}</span>
        </button>
      </div>
    );
  }
}

export default LocationWidget;
