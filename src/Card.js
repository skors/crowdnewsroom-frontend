import React, { Component } from "react";
import PropTypes from "prop-types";

import "./Card.css";

class Card extends Component {
  static propTypes = {
    logo: PropTypes.string,
    title: PropTypes.string
  };

  render() {
    return (
      <div className="card">
        <img
          className="card__logo"
          src={this.props.logo}
          alt={this.props.title}
        />
        <div className="card__body">{this.props.children}</div>
      </div>
    );
  }
}
export default Card;
