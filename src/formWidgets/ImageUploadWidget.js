import React from "react";
import FileWidget from "react-jsonschema-form";

class ImageUploadWidget extends FileWidget {
  encodedValue = "";

  constructor(props) {
    super(props);
    // init the value property, example had this so I just copied it over
    this.state = { value: "" };
    this.set = this.set.bind(this);
  }

  set(event) {
    // get the file data
    var files = event.target.files;
    var reader = new FileReader();
    reader.readAsBinaryString(files[0]);
    // we can't use 'this' to refer to the widget inside the onload callback below
    var widget = this;
    reader.onload = function() {
      // now convert to base64 and save it
      // the hidden field is bound to state.value so will update itself
      widget.setState({ value: btoa(reader.result) });
    };
    reader.onerror = function() {
      console.log("Error using FileReader to get base64 image data.");
    };
  }

  render() {
    const { multiple, id, readonly, disabled, autofocus } = this.props;
    // const { filesInfo } = this.state;
    return (
      <div>
        <p>
          <input
            ref={ref => (this.inputRef = ref)}
            id={id + "-wrapper"}
            type="file"
            disabled={readonly || disabled}
            onChange={this.set}
            autoFocus={autofocus}
            multiple={multiple}
            accept="image/*"
            capture="environment"
          />
          <input
            ref={ref => (this.inputRef = ref)}
            id={id}
            name={this.props.id}
            type="hidden"
            value={this.state.value}
          />
        </p>
      </div>
    );
  }
}
/*
        <FilesInfo filesInfo={filesInfo} />
        */

export default ImageUploadWidget;

/*
function FilesInfo(props) {
  const { filesInfo } = props;
  if (filesInfo.length === 0) {
    return null;
  }
  return (
    <ul className="file-info">
      {filesInfo.map((fileInfo, key) => {
        const { name, size, type } = fileInfo;
        return (
          <li key={key}>
            <strong>{name}</strong> ({type}, {size} bytes)
          </li>
        );
      })}
    </ul>
  );
}
*/
