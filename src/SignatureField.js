import React, { Component } from "react";
import SignaturePad from "react-signature-pad-wrapper";

class SignatureComponent extends Component {
  signaturePad = undefined;

  componentDidMount() {
    if (this.signaturePad && this.props.value) {
      this.signaturePad.fromDataURL(this.props.value);
    }
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
          redrawOnResize={true}
          options={options}
          ref={ref => (this.signaturePad = ref)}
          debounceInterval={100}
          width={300}
          height={200}
        />
        <button onClick={() => this.signaturePad.clear()}> Clear </button>
      </div>
    );
  }
}

export default SignatureComponent;
