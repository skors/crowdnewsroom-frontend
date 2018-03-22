import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import StateHolder from "./StateHolder";

configure({ adapter: new Adapter() });

describe("StateHolder", () => {
  it("render loading by default", () => {
    jest
      .spyOn(StateHolder.prototype, "componentDidMount")
      .mockImplementation(() => {});
    const wrapper = shallow(<StateHolder />);
    expect(wrapper.contains(<div>Loading...</div>)).toBeTruthy();
  });
});
