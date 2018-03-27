import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import StateHolder from "./StateHolder";
import { t } from "./i18n";

configure({ adapter: new Adapter() });

describe("StateHolder", () => {
  it("render loading by default", () => {
    jest
      .spyOn(StateHolder.prototype, "componentDidMount")
      .mockImplementation(() => {});
    const wrapper = shallow(<StateHolder />);
    expect(
      wrapper.contains(
        <div className="state-holder__message state-holder__message--loading">
          {t("form.loading")}
        </div>
      )
    ).toBeTruthy();
  });
});
