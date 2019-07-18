import Polyglot from "node-polyglot";

/* eslint-disable no-unused-vars*/
const en = {
  form: {
    loading: "Loading …",
    error: "There was an error loading the form data …",
    next: "Next",
    back: "Back",
    submit: "Submit",
    submitting: "Submitting …",
    confirm_close: "Do you really want to close the before submitting?",
    location_more: "Click here to learn more"
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
    files_uploaded:
      "%{smart_count} file uploaded |||| %{smart_count} files uploaded",
    signature_given: "Signature given"
  },
  card: {
    data_privacy: "Data Privacy"
  }
};
/* eslint-enable */

const de = {
  form: {
    loading: "Lädt …",
    error: "Beim Laden des Formulars ist ein Fehler aufgetreten …",
    next: "Weiter",
    back: "Zurück",
    submit: "Abschicken",
    submitting: "Wird abgeschickt …",
    confirm_close: "Möchten Sie das Fenster wirklich schließen?",
    location_more: "Hier klicken, um mehr zu erfahren"
  },
  errors: {
    required: "Dieses Feld muss ausgefüllt sein.",
    boolean: "Bitte wählen Sie eine der Optionen aus.",
    signature:
      "Bitte unterschreiben Sie in diesem Feld mit der Maus oder dem Finger."
  },
  summary: {
    message:
      "Bitte überprüfen Sie Ihre Angaben und klicken Sie abschließend auf den Button “Abschicken”",
    edit_item: "Von diesem Schritt aus bearbeiten",
    yes: "Ja",
    no: "Nein",
    file_uploaded: "Datei hochgeladen",
    files_uploaded:
      "%{smart_count} Datei hochgeladen |||| %{smart_count} Dateien hochgeladen",
    signature_given: "Unterschrift geleistet"
  },
  card: {
    data_privacy: "Datenschutz"
  }
};

// add more languages if you need
const translations = {
  de: new Polyglot({ phrases: de, locale: "de" }),
  en: new Polyglot({ phrases: en, locale: "en" })
};

// FIXME
let activeLocale = "de";
const t = (key, ...rest) => translations[activeLocale || "de"].t(key, ...rest);
t.setLocale = (code = "de") => (activeLocale = code);

export { t };
