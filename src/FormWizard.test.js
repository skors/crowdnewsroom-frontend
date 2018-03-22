import React from "react";
import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import App from "./App";
import { Route } from "react-router-dom";
import FormWizard from "./FormWizard";

configure({ adapter: new Adapter() });

const steps = [
  {
    schema: {
      title: "first",
      properties: {
        first_first: {
          type: "boolean"
        }
      }
    },
    conditions: {}
  },
  {
    schema: {
      title: "second",
      properties: {
        second_first: {
          type: "boolean"
        }
      }
    },
    conditions: {
      first_first: { equal: true }
    }
  },
  {
    schema: {
      title: "third",
      properties: {
        third_first: {
          type: "boolean"
        }
      }
    },
    conditions: {
      first_first: { equal: false }
    }
  }
];

describe("FormWizard", () => {
  let instance;

  beforeEach(() => {
    const wrapper = shallow(
      <FormWizard formData={{}} steps={steps} history={[]} investigation={{}} />
    );
    instance = wrapper.instance();
  });

  it("should set first step", async () => {
    expect(instance.state.schema.title).toBe("first");
  });

  it("should advance to correct state", async () => {
    const nextStep = await instance.getNextStep({ first_first: false });
    expect(nextStep.title).toBe("third");
  });

  it("should advance to another correct state", async () => {
    const nextStep = await instance.getNextStep({ first_first: true });
    expect(nextStep.title).toBe("second");
  });

  it("should reset formState if path changed", async () => {
    instance.setState({ formData: { first_first: true, second_first: false } });
    const nextStep = await instance.getNextStep({ first_first: false });

    expect(nextStep.title).toBe("third");

    await instance.updateFormData({ first_first: false });
    // note that the - now invalid - second_first is not in the data anymore
    expect(instance.state.formData).toEqual({ first_first: false });
  });
});
