import React, { Component } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

class PatternTypeTextInputWidget extends Component {
  constructor(props) {
    super(props);
    var startDate = new Date();
    this.state = {
      value: "",
      date: "",
      startDate: startDate,
      setStartDate: startDate,
      showDatepicker: props.schema.field_type
    };
  }

  setStartDate(date) {
    this.setState({
      startDate: date
    });

    var mm = date.getMonth() + 1;
    var dd = date.getDate();
    var yy = date.getFullYear();

    var date_value = yy + "-" + mm + "-" + dd;

    this.setState({
      value: date_value
    });

    return date;
  }

  render() {
    const props = this.props;
    const own_this = this;
    props.onChange(this.state.value === "" ? "" : this.state.value);
    if (this.state.showDatepicker == "date") {
      return (
        <div>
          <DatePicker
            className="form-control"
            dateFormat="dd.MM.yyyy"
            selected={this.state.startDate}
            onChange={date => this.setStartDate(date)}
          />
        </div>
      );
    } else {
      return (
        <div>
          <input
            placeholder={props.placeholder}
            className="form-control"
            value={own_this.state.value}
            onChange={e => {
              own_this.setState({ value: e.target.value });
            }}
            id={props.id}
            pattern={props.schema.pattern ? props.schema.pattern : false}
            type={props.schema.field_type ? props.schema.field_type : "text"}
          />
        </div>
      );
    }
  }
}

export default PatternTypeTextInputWidget;

// return (
//   <div>
//     <div v-if="this.state.showDatepicker">
//       <DatePicker className="form-control" dateFormat="dd.MM.yyyy" selected={this.state.startDate} onChange={date => this.setStartDate(date)} />
//     </div>

//     <input
//     v-if="this.state.showDatepicker"
//       placeholder={props.placeholder}
//       className="form-control"
//       value={own_this.state.value}
//       onChange={e => {
//         own_this.setState({ value: e.target.value });
//       }}
//       id={props.id}
//       pattern={props.schema.pattern ? props.schema.pattern : false}
//       type={props.schema.field_type ? props.schema.field_type : "text"}
//     />
//   </div>
// );
