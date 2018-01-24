import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import App from "./App";
import Form from "./Form";

configure({ adapter: new Adapter() });

describe("App", () => {
  it("renders without crashing", () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find(Form)).toHaveLength(1);
  });
});
