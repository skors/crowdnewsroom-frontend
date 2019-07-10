import React, { Component } from "react";

import "./LocationWidget.css";

class LocationWidget extends Component {
  constructor(props) {
    super(props);
    this.state = { latlon: "" };
    this.buttonText = this.props.options.location_button;
    this.buttonState = "button";
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
        return widget.props.onChange(value === "" ? "" : value);
      },
      function(error) {
        console.log(error);
        widget.buttonText = widget.props.options.location_error;
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
