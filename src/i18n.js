import Polyglot from "node-polyglot";

/* eslint-disable no-unused-vars*/
const en = {
  form: {
    loading: "Loading...",
    error: "There was an error loading the form data...",
    back: "Back",
    submit: "Submit",
    submitting: "Submitting...",
    confirm_close: "Do you really want to close the before submitting?"
  },
  errors: {
    required: "This field is required.",
    boolean: "Please choose one of the options.",
    signature: "Please sign with your finger or your mouse."
  },
  summary: {
    message: "Please confirm your details:",
    edit_item: "Edit from here",
    yes: "Yes",
    no: "No",
    file_uploaded: "File uploaded",
    signature_given: "Signature given"
  },
  card: {
    data_privacy: "Data Privacy"
  }
};
/* eslint-enable */

const de = {
  form: {
    loading: "Lädt...",
    error: "Beim Laden des Formulars ist ein Fehler aufgetreten...",
    back: "Zurück",
    submit: "Abschicken",
    submitting: "Wird abgeschickt...",
    confirm_close: "Möchten Sie das Fenster wirklich schließen?"
  },
  errors: {
    required: "Dieses Feld muss ausgefüllt sein.",
    boolean: "Bitte wählen Sie eine der Optionen aus.",
    signature:
      "Bitte unterschreiben Sie in diesem Feld mit der Maus oder dem Finger."
  },
  summary: {
    message:
      "Bitte überprüfen Sie Ihre Angaben und klicken Sie abschließend unten auf den Button “Abschicken”",
    edit_item: "Von diesem Schritt aus bearbeiten",
    yes: "Ja",
    no: "Nein",
    file_uploaded: "Datei hochgeladen",
    signature_given: "Unterschrift geleistet"
  },
  card: {
    data_privacy: "Datenschutz"
  }
};

// this would be the place where we decide if we pass the
// `en` or the `de` object. Right now we just always pass
// the German translations
const polyglot = new Polyglot({ phrases: de });

const t = key => polyglot.t(key);

export { t };
