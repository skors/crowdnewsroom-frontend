import Polyglot from "node-polyglot";

/* eslint-disable no-unused-vars*/
const en = {
  form: {
    loading: "Loading...",
    error: "There was an error loading the form data..."
  },
  summary: {
    message: "Please confirm your details:",
    edit_item: "Edit from here"
  }
};
/* eslint-enable */

const de = {
  form: {
    loading: "Lädt...",
    error: "Beim Laden des Formulars ist ein Fehler aufgetreten..."
  },
  summary: {
    message: "Bitte bestätigen Sie Ihre Angaben:",
    edit_item: "Von diesem Schritt aus bearbeiten"
  }
};

// this would be the place where we decide if we pass the
// `en` or the `de` object. Right now we just always pass
// the German translations
const polyglot = new Polyglot({ phrases: de });

const t = key => polyglot.t(key);

export { t };
