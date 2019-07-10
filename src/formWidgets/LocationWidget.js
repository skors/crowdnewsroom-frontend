import React, { Component } from "react";

import "./LocationWidget.css";

class LocationWidget extends Component {
  constructor(props) {
    super(props);
    this.state = { latlon: "" };
    this.buttonText = this.props.options.location_button;
    this.buttonState = "button";
    this.errorMessage = "";
    console.log(this.props);
  }

  onClick = event => {
    event.preventDefault();
    const widget = this;
    widget.buttonText = widget.props.options.location_load;
    navigator.geolocation.getCurrentPosition(
      function(position) {
        var value = position.coords.latitude + "," + position.coords.longitude;
        widget.setState({ latlon: value });
        widget.buttonText = widget.props.options.location_success;
        widget.buttonState = "button success";
        widget.errorMessage = "";
        return widget.props.onChange(value === "" ? "" : value);
      },
      function(error) {
        var reason;
        if (error.code == 1) {
          reason = "permission denied";
        } else if (error.code == 2) {
          reason = "position unavailable";
        } else if (error.code == 3) {
          reason = "timed out";
        } else {
          reason = "unknown reason";
        }
        if (error.message) {
          widget.errorMessage = error.message;
        }
        console.log(error);
        widget.buttonText =
          widget.props.options.location_error + " (Reason: " + reason + ").";
        widget.buttonState = "button alert";
        return widget.props.onChange("");
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
        <span className="location-errors">{this.errorMessage}</span>
      </div>
    );
  }
}

export default LocationWidget;
