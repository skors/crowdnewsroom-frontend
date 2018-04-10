import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import { Step, Row } from "./Summary";
import { t } from "./i18n";

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

const makeRow = (values = {}, property = "", formData = {}, uiSchema = {}) => {
  return shallow(
    <Row
      values={values}
      property={property}
      formData={formData}
      uiSchema={uiSchema}
    />
  );
};

describe("Row", () => {
  it("should render list elements", async () => {
    const wrapper = makeRow();
    expect(wrapper.find("li")).toHaveLength(1);
  });

  it("should display files correctly", async () => {
    const property = "proof";
    const values = { format: "data-url", type: "string" };

    const wrapper = makeRow(values, property);
    expect(wrapper.find("li h4").text()).toEqual("proof");
    expect(wrapper.find("li p").text()).toEqual(t("summary.file_uploaded"));
  });

  it("should display signatures correctly", async () => {
    const property = "signature";
    const values = { type: "string" };
    const uiSchema = { signature: { "ui:widget": "signatureWidget" } };

    const wrapper = makeRow(values, property, {}, uiSchema);
    expect(wrapper.find("li h4").text()).toEqual("signature");
    expect(wrapper.find("li p").text()).toEqual(t("summary.signature_given"));
  });
});
