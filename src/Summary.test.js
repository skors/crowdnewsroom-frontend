import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import { Step, Row } from "./Summary";

configure({ adapter: new Adapter() });

const makeStep = (schema, uiSchema = {}) => {
  const formData = {};
  return shallow(
    <Step schema={schema} formData={formData} uiSchema={uiSchema} />
  );
};

describe("Step", () => {
  describe("render visible properties", () => {
    it("should render if properties are visible", async () => {
      const schema = {
        title: "First Step",
        slug: "first-step",
        properties: { name: { type: "string" } }
      };
      const wrapper = makeStep(schema);
      expect(wrapper.find("div h2")).toHaveLength(1);
    });

    it("should not render if all properties are hidden", async () => {
      const schema = {
        title: "First Step",
        slug: "first-step",
        properties: { name: { type: "string" } }
      };
      const uiSchema = { name: { "ui:widget": "hidden" } };
      const wrapper = makeStep(schema, uiSchema);
      expect(wrapper.find("div h2")).toHaveLength(0);
    });
  });

  describe("keep order", () => {
    it("should keep order given in uiSchema", async () => {
      const schema = {
        title: "First Step",
        slug: "first-step",
        properties: {
          lastName: { type: "string" },
          firstName: { type: "string" }
        }
      };
      const uiSchema = { "ui:order": ["firstName", "lastName"] };
      const wrapper = makeStep(schema, uiSchema);
      const rows = wrapper.find("div ul");
      expect(rows.childAt(0).key()).toEqual("firstName");
      expect(rows.childAt(1).key()).toEqual("lastName");
    });
  });
});

describe("Row", () => {
  let wrapper;

  describe("should render a nice list element", () => {
    beforeEach(() => {
      const values = {};
      const property = {};
      const formData = {};
      const uiSchema = {};
      wrapper = shallow(
        <Row
          values={values}
          property={property}
          formData={formData}
          uiSchema={uiSchema}
        />
      );
    });

    it("should set first step", async () => {
      expect(wrapper.find("li")).toHaveLength(1);
    });
  });
});
