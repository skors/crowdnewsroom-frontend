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

const moreSteps = [
  {
    schema: {
      title: "first",
      properties: {
        first_first: {
          type: "boolean"
        },
        first_second: {
          type: "string"
        }
      }
    },
    conditions: {}
  },
  {
    schema: {
      title: "third"
    },
    conditions: {
      or: [
        { first_first: { equal: true } },
        { first_second: { equal: "banana" } }
      ]
    }
  }
];

const existsStep = [
  {
    schema: {
      title: "first",
      properties: {
        first_first: {
          type: "string"
        }
      }
    },
    conditions: {}
  },
  {
    schema: {
      title: "second"
    },
    conditions: {
      other: { exists: true }
    }
  },
  {
    schema: {
      title: "third"
    },
    conditions: {}
  }
];

describe("FormWizard", () => {
  let instance;

  describe("easy conditions", () => {
    beforeEach(() => {
      const wrapper = shallow(
        <FormWizard
          formData={{}}
          steps={steps}
          history={[]}
          investigation={{}}
          match={{ params: { step: "" } }}
        />
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
      instance.setState({
        formData: { first_first: true, second_first: false }
      });
      const nextStep = await instance.getNextStep({ first_first: false });

      expect(nextStep.title).toBe("third");

      await instance.updateFormData({ first_first: false });
      // note that the - now invalid - second_first is not in the data anymore
      expect(instance.state.formData).toEqual({ first_first: false });
    });
  });

  describe("or conditions", () => {
    beforeEach(() => {
      const wrapper = shallow(
        <FormWizard
          formData={{}}
          steps={moreSteps}
          history={[]}
          investigation={{}}
          match={{ params: { step: "" } }}
        />
      );
      instance = wrapper.instance();
    });

    it("should work if the first condition is met", async () => {
      const nextStep = await instance.getNextStep({ first_first: true });
      expect(nextStep.title).toBe("third");
    });

    it("should work if the second condition is met", async () => {
      const nextStep = await instance.getNextStep({ first_second: "banana" });
      expect(nextStep.title).toBe("third");
    });

    it("should not work if the conditions are not met", async () => {
      const nextStep = await instance.getNextStep({
        first_first: false,
        first_second: "bread"
      });
      expect(nextStep).toBeUndefined();
    });

    it("should not work if one of the conditions is met", async () => {
      const nextStep = await instance.getNextStep({
        first_first: false,
        first_second: "banana"
      });
      expect(nextStep.title).toBe("third");
    });
  });

  describe("exists conditions", () => {
    beforeEach(() => {
      const wrapper = shallow(
        <FormWizard
          formData={{}}
          steps={existsStep}
          history={[]}
          investigation={{}}
          match={{ params: { step: "" } }}
        />
      );
      instance = wrapper.instance();
    });

    it("should advance if the exists condition is met", async () => {
      const nextStep = await instance.getNextStep({ other: "test" });
      expect(nextStep.title).toBe("second");
    });

    it("should not advance if the exists condition is not met", async () => {
      const nextStep = await instance.getNextStep({ first_first: true });
      expect(nextStep.title).toBe("third");
    });
  });
});
