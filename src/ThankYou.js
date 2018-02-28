import React from "react";
import {Link} from "react-router-dom";

function makeUrl(token){
    const current = document.location.toString();
    return current.replace("/thank-you", `/edit/${token}`)

}

export default function ThankYou(props){
    const token = props.location.state.token;
    return (<div>
      <h1> Thank you! </h1>
        <p>You can go back and edit your form at
        <Link to={`/edit/${token}`}>
            {makeUrl(token)}
        </Link>
        </p>
  </div>);
}
