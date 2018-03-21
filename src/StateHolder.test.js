import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import StateHolder from "./StateHolder";
import Login from "./Login";

configure({ adapter: new Adapter() });

describe("StateHolder", () => {
  it("renders LoginComponent when activeComponent = login", () => {
    const wrapper = shallow(<StateHolder />);
    wrapper.setState({ activeComponent: "login" });
    expect(wrapper.is(Login)).toBe(true);
  });
});
