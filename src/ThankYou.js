import React from "react";
import { Link } from "react-router-dom";

export default function ThankYou(props) {
  const { returnUrl } = props.location.state;
  return (
    <div>
      <h1> Thank you! </h1>
      <p>
        You can go back and edit your form at
        <Link to={returnUrl}>
          {window.location.origin}
          {returnUrl}
        </Link>
      </p>
    </div>
  );
}
