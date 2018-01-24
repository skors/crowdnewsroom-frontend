import Polyglot from "node-polyglot";

const en = {
  form: {
    loading: "Loading...",
    error: "There was an error loading the form data..."
  }
};

const polyglot = new Polyglot({ phrases: en });

const t = (key) => polyglot.t(key);

export { t };
