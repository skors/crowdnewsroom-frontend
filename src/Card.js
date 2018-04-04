import React from "react";
import PropTypes from "prop-types";

import "./Card.css";

function Card(props) {
  return (
    <div className="card">
      <img className="card__logo" src={props.logo} alt={props.title} />
      <div className="card__body">{props.children}</div>
      <div className="card__footer">
        {props.dataPrivacyUrl ? (
          <a
            className="card__footer--data-privacy"
            href={props.dataPrivacyUrl}
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

Card.propTypes = {
  logo: PropTypes.string,
  title: PropTypes.string,
  dataPrivacyUrl: PropTypes.string
};

export default Card;
