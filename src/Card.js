import React, { Component } from "react";
import PropTypes from "prop-types";

import "./Card.css";

class Card extends Component {
  static propTypes = {
    logo: PropTypes.string,
    title: PropTypes.string,
    dataPrivacyUrl: PropTypes.string
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
        <div className="card__footer">
          {this.props.dataPrivacyUrl ? (
            <a
              className="card__footer--data-privacy"
              href={this.props.dataPrivacyUrl}
              target="_blank"
              rel="noopener"
            >
              Datenschutz
            </a>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}
export default Card;
