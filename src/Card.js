import React from "react";
import PropTypes from "prop-types";

import { t } from "./i18n";
import "./Card.css";

function Card(props) {
  return (
    <div>
      <div className="card">
        <img className="card__logo" src={props.logo} alt={props.title} />
        <div className="card__body">{props.children}</div>
      </div>
      <div className="footer">
        {props.dataPrivacyUrl ? (
          <a href={props.dataPrivacyUrl} target="_blank" rel="noopener">
            {t("card.data_privacy")}
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
