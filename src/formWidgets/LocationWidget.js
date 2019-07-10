import React, { Component } from "react";

import "./LocationWidget.css";

class LocationWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latlon: "",
      label: this.props.options.location_button,
      stateclass: "button",
      errorMessage: ""
    };
  }

  onClick = event => {
    event.preventDefault();
    const widget = this;
    this.setState({
      label: widget.props.options.location_load,
      stateclass: "button"
    });
    navigator.geolocation.getCurrentPosition(
      function(position) {
        var value = position.coords.latitude + "," + position.coords.longitude;
        widget.setState({
          latlon: value,
          label: widget.props.options.location_success,
          stateclass: "button success",
          errorMessage: ""
        });
        return widget.props.onChange(value === "" ? "" : value);
      },
      function(error) {
        var reason;
        if (error.code === 1) {
          reason = "permission denied";
        } else if (error.code === 2) {
          reason = "position unavailable";
        } else if (error.code === 3) {
          reason = "timed out";
        } else {
          reason = "unknown reason";
        }
        if (error.message) {
          widget.setState({ errorMessage: error.message });
        }
        console.log(error);
        widget.setState({
          errorMessage: reason + ": " + error.message,
          label: widget.props.options.location_error,
          stateclass: "button alert"
        });
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
        <button className={this.state.stateclass} onClick={this.onClick}>
          <i className="fi-marker" />
          <span>{this.state.label}</span>
        </button>
        <span className="location-errors">{this.state.errorMessage}</span>
      </div>
    );
  }
}

export default LocationWidget;
