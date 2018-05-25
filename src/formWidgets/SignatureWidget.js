import React, { Component } from "react";
import SignaturePad from "react-signature-pad-wrapper";

import "./SignatureWidget.css";

class SignatureWidget extends Component {
  signaturePad = undefined;

  componentDidMount() {
    if (this.signaturePad && this.props.value) {
      this.signaturePad.fromDataURL(this.props.value);
    }

    this.clear = this.clear.bind(this);
  }

  clear(event) {
    this.signaturePad.clear();
    this.props.onChange(null);
  }

  render() {
    const props = this.props;
    const options = {
      onEnd() {
        props.onChange(this.toDataURL());
      }
    };

    return (
      <div>
        <SignaturePad
          className="signature-widget"
          redrawOnResize={true}
          options={options}
          ref={ref => (this.signaturePad = ref)}
          debounceInterval={100}
        />
        <button type="button" onClick={this.clear}>
          {" "}
          Clear{" "}
        </button>
      </div>
    );
  }
}

export default SignatureWidget;
