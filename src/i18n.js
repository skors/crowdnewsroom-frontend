import Polyglot from "node-polyglot";

const en = {
  form: {
    loading: "Loading...",
    error: "There was an error loading the form data...",
    verified_message:
      "Your response has been verified by the editors already. If you want to make changes contact us at team@crowdnewsroom.org"
  },
  summary: {
    edit_item: "Edit from here"
  }
};

const polyglot = new Polyglot({ phrases: en });

const t = key => polyglot.t(key);

export { t };
