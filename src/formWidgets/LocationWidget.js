import React, { Component } from "react";

import "./LocationWidget.css";

class LocationWidget extends Component {
  constructor(props) {
    super(props);
    this.state = { latlon: "" };
    this.buttonText = this.props.schema.title;
    this.buttonState = "button";
  }

  onClick = event => {
    event.preventDefault();
    const widget = this;
    widget.buttonText = "Getting your location...";
    navigator.geolocation.getCurrentPosition(
      function(position) {
        var value = position.coords.latitude + "," + position.coords.longitude;
        widget.setState({ latlon: value });
        widget.buttonText = "Location received!";
        widget.buttonState = "button success";
        return widget.props.onChange(value === "" ? "" : value);
      },
      function(error) {
        console.log(error);
        widget.buttonText = "Error fetching location! Click to try again.";
        widget.buttonState = "button alert";
      }
    );
  };

  render() {
    return (
      <div className="location">
        <input
          ref={ref => (this.inputRef = ref)}
          name={this.props.id}
          id={this.props.id}
          type="hidden"
          readOnly={true}
        />
        <button className={this.buttonState} onClick={this.onClick}>
          <i className="fi-marker" />
          <span>{this.buttonText}</span>
        </button>
      </div>
    );
  }
}

export default LocationWidget;
