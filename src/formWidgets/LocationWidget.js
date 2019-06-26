import React, { Component } from "react";

import "./LocationWidget.css";

class LocationWidget extends Component {
  constructor(props) {
    super(props);
    //this.set = this.set.bind(this);
    this.state = { latlon: "" };
  }

  /*
  set(event) {
    this.props.onChange(event.target.value === "true");
  }
  */

  onClick = event => {
    event.preventDefault();
    const widget = this;
    navigator.geolocation.getCurrentPosition(
      function(position) {
        widget.setState({
          latlon: position.coords.latitude + "," + position.coords.longitude
        });
      },
      function(error) {
        console.log(error);
      }
    );
  };

  render() {
    console.log("latlon: " + this.state.latlon);
    return (
      <div className="location">
        <button
          className="button"
          ref={ref => (this.inputRef = ref)}
          name={this.props.id}
          onClick={this.onClick}
        >
          <i className="fi-marker" />
          <span>{this.props.schema.title}</span>
        </button>
        <input
          ref={ref => (this.inputRef = ref)}
          name={this.props.id}
          value={this.state.latlon}
          type="text"
          readOnly={true}
          // disabled={readonly || disabled}
        />
      </div>
    );
  }
}

export default LocationWidget;
