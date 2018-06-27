import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";

import "./StateHolder.css";
import FormWizard from "./FormWizard";
import Summary from "./Summary";
import { t } from "./i18n";
import * as api from "./api";
import { trackSubmission } from "./tracking";

function unloadListener(e) {
  const dialogText = t("form.confirm_close");
  e.returnValue = dialogText;
  return dialogText;
}

const mockFormJson = [
  {
    schema: {
      slug: "start",
      description:
        "Bevor es los geht: Wenn Sie den Eigentümer Ihrer Wohnung kennen oder selber Eigentümer sind, haben Sie bitte einen Beleg (wie z.B. eine Mieterhöhung) zur Hand. Als Journalisten des Recherchezentrums CORRECTIV müssen wir Ihre Angaben überprüfen können. Weder die Dokumente noch die Namen einzelner Eigentümer werden veröffentlicht. Wenn Sie den Eigentümer nicht kennen, finden wir ihn gemeinsam heraus. Sollten Sie Probleme bei der Dateneingabe haben oder Fragen, schreiben Sie uns an hamburg@correctiv.org",
      title: "",
      type: "object",
      properties: {}
    },
    rules: [
      {
        conditions: {},
        event: "bekannt_eigentuemer"
      }
    ]
  },
  {
    schema: {
      description: "",
      title: "",
      required: ["know_eigentuemer"],
      slug: "bekannt_eigentuemer",
      properties: {
        know_eigentuemer: {
          enumNames: ["Ja", "Nein"],
          type: "boolean"
        }
      },
      type: "object"
    },
    rules: [
      {
        conditions: {
          know_eigentuemer: { equal: false }
        },
        event: "lassen_sie_uns_herausfinden"
      },
      {
        conditions: {
          know_eigentuemer: { equal: true }
        },
        event: "eigentuemer_name"
      }
    ]
  },
  {
    schema: {
      slug: "lassen_sie_uns_herausfinden",
      description:
        "Das ist auf verschiedenen Wegen möglich. In vielen Fällen ist der im Mietvertrag genannte Vermieter nicht unbedingt auch der Eigentümer. Der Eigentümer muss aber etwa bei einer Mieterhöhung, in einer Wohnungsgeberbestätigung oder bei einem Eigentümerwechsel in einem Schreiben an Sie angegeben werden.",
      title: "Lassen Sie uns herausfinden, wer Ihr Eigentümer ist",
      type: "object",
      properties: {}
    },
    rules: [
      {
        conditions: {},
        event: "had_mieterhorung"
      }
    ]
  },
  {
    schema: {
      description: "",
      title: "",
      required: ["eigentuemer_name"],
      slug: "eigentuemer_name",
      properties: {
        eigentuemer_name: {
          default: "",
          type: "string"
        }
      },
      type: "object"
    },
    rules: [
      {
        conditions: {},
        event: "addresse"
      }
    ]
  },
  {
    schema: {
      description: "",
      title: "Wo leben Sie zur Miete?",
      required: ["strasse", "Hausnummer", "PLZ"],
      slug: "addresse",
      properties: {
        Stadt: {
          default: "Hamburg",
          type: "string"
        },
        Zusatz: {
          default: "(optional)",
          type: "string"
        },
        strasse: {
          default: "",
          type: "string"
        },
        PLZ: {
          default: "",
          type: "string"
        },
        Hausnummer: {
          default: "",
          type: "string"
        }
      },
      type: "object"
    },
    rules: [
      {
        conditions: {},
        event: "upload_dokument"
      }
    ]
  },
  {
    schema: {
      description: "",
      title: "",
      required: ["had_mieterhorung"],
      slug: "had_mieterhorung",
      properties: {
        had_mieterhorung: {
          enumNames: ["Ja", "Nein"],
          type: "boolean"
        }
      },
      type: "object"
    },
    rules: [
      {
        conditions: { had_mieterhorung: { equal: true } },
        event: "eigentuemer_letter"
      },
      {
        conditions: { had_mieterhorung: { equal: false } },
        event: "text_vermieter_is_eigentuemer"
      }
    ]
  },
  {
    schema: {
      description: "",
      title: "",
      required: ["eigentuemer_letter"],
      slug: "eigentuemer_letter",
      properties: {
        eigentuemer_letter: {
          enumNames: ["Ja", "Nein", "Ich finde den Brief nicht mehr."],
          enum: [1, 2, 3],
          type: "number"
        }
      },
      type: "object"
    },
    rules: [
      {
        conditions: { eigentuemer_letter: { equal: 1 } },
        event: "eigentuemer_name"
      },
      {
        conditions: { eigentuemer_letter: { equal: 2 } },
        event: "text_vermieter_is_eigentuemer"
      },
      {
        conditions: { eigentuemer_letter: { equal: 3 } },
        event: "text_vermieter_is_eigentuemer"
      }
    ]
  },
  {
    schema: {
      slug: "text_vermieter_is_eigentuemer",
      description:
        "Falls Sie keine Mieterhöhung erhalten haben, gibt es andere Wege, um den Eigentümer herauszufinden. Vielleicht gehört in Ihrem Fall dem – im Mietvertrag angegebenen – Vermieter selbst die Wohnung.",
      title: "Ist Ihr Vermieter vielleicht selbst der Eigentümer?",
      type: "object",
      properties: {}
    },
    rules: [
      {
        conditions: {},
        event: "vermieter_ist_eigentuemer"
      }
    ]
  },
  {
    schema: {
      description: "",
      title: "",
      required: ["vermieter_is_owner"],
      slug: "vermieter_ist_eigentuemer",
      properties: {
        vermieter_is_owner: {
          enumNames: ["Ja", "Nein", "Ich weiß es nicht"],
          enum: [1, 2, 3],
          default: "",
          type: "number"
        }
      },
      type: "object"
    },
    rules: [
      {
        conditions: { vermieter_is_owner: { equal: 1 } },
        event: "erklarung"
      },
      {
        conditions: { vermieter_is_owner: { equal: 2 } },
        event: "fragen_grundbuchamt"
      },
      {
        conditions: { vermieter_is_owner: { equal: 3 } },
        event: "fragen_grundbuchamt"
      }
    ]
  },
  {
    schema: {
      description: "",
      title: "Erklärung",
      required: ["vermieter_is_owner_warum"],
      slug: "erklarung",
      properties: {
        vermieter_is_owner_warum: {
          default: "",
          type: "string"
        }
      },
      type: "object"
    },
    rules: [
      {
        conditions: {},
        event: "vermieter_name"
      }
    ]
  },
  {
    schema: {
      description:
        "Tragen Sie den Namen Ihres Vermieters ein, wie er auf dem Mietvertrag steht.",
      title: "",
      required: ["vermieter_name"],
      slug: "vermieter_name",
      properties: {
        vermieter_name: {
          default: "",
          type: "string"
        }
      },
      type: "object"
    },
    rules: [
      {
        conditions: {},
        event: "addresse"
      }
    ]
  },
  {
    schema: {
      slug: "fragen_grundbuchamt",
      description:
        "Falls Sie weiterhin nicht wissen, wer der Eigentümer Ihrer Wohnung ist: Das Grundbuchamt ist verpflichtet, Mietern diese Frage zu ihrer eigenen Wohnung zu beantworten. Sie müssen dafür nicht zum Grundbuchamt gehen. Den Antrag stellen wir für Sie kostenlos.",
      title: "Anfrage beim Grundbuchamt",
      type: "object",
      properties: {}
    },
    rules: [
      {
        conditions: {},
        event: "upload_mietvertrag"
      }
    ]
  },
  {
    schema: {
      final: false,
      description:
        "Das Grundbuchamt fordert einen Beleg für die Anfrage zu Ihrem Wohnsitz. Bitte laden Sie hierzu die erste Seite Ihres Mietvertrages als Handyfoto oder Scan hoch. Darauf müssen zu erkennen sein: Name, Geburtsdatum, Geburtsort und die genaue Adresse Ihrer Wohnung.",
      title: "",
      required: ["upload_mietvertrag"],
      slug: "upload_mietvertrag",
      properties: {
        upload_mietvertrag: {
          format: "data-url",
          type: "string"
        }
      },
      type: "object"
    },
    rules: [
      {
        conditions: {},
        event: "angaben"
      }
    ]
  },
  {
    schema: {
      description:
        "Damit wir die Anfrage zu dem Eigentümer Ihrer Wohnung stellen dürfen, benötigen wir eine Vollmacht von Ihnen. Diese erstellen wir aus den unten stehenden Angaben. Alle Informationen werden ausschließlich ans Grundbuchamt weitergegeben.",
      title: "Anfrage beim Grundbuchamt",
      required: [
        "strasse",
        "Hausnummer",
        "PLZ",
        "fullname",
        "birthdate",
        "birthplace"
      ],
      slug: "angaben",
      properties: {
        Stadt: {
          default: "Hamburg",
          type: "string"
        },
        birthdate: {
          type: "string"
        },
        Hausnummer: {
          type: "string"
        },
        PLZ: {
          type: "string"
        },
        Zusatz: {
          default: "(optional)",
          type: "string"
        },
        fullname: {
          type: "string"
        },
        birthplace: {
          type: "string"
        },
        strasse: {
          type: "string"
        }
      },
      type: "object"
    },
    rules: [
      {
        conditions: {},
        event: "grundbuchamt_bestatigen"
      }
    ]
  },
  {
    schema: {
      final: true,
      description:
        "Vielen Dank! Die Vollmacht muss von Ihnen persönlich unterschrieben sein. Unterschreiben Sie in dem Feld unten mit Ihrer Maus. Wir geben Ihnen Bescheid, sobald das Grundbuchamt geantwortet hat. Dafür benötigen wir Ihre E-Mail Adresse.",
      title: "",
      required: ["bestatigen", "signature"],
      slug: "grundbuchamt_bestatigen",
      properties: {
        bestatigen: {
          title:
            " Ich bestätige, dass alle von mir getätigten Angaben korrekt sind und gebe CORRECTIV eine Vollmacht, befristet bis zum 31. Juli 2018, beim Grundbuchamt eine Mitteilung zu erfragen, wer der Eigentümer meiner Mietwohnung ist.",
          type: "boolean"
        },
        email: {
          type: "string"
        },
        authorize_email: {
          title:
            " Ich möchte über die Ergebnisse dieser Recherche und weitere Veröffentlichungen zum Wohnungmarkt in Hamburg informiert werden.",
          type: "boolean"
        },
        confirm_summary: {
          title:
            "Die Journalisten von CORRECTIV dürfen mich in Bezug auf die „Wem gehört Hamburg?” Recherche per E-Mail kontaktieren.",
          type: "boolean"
        },
        signature: {
          type: "string"
        }
      },
      type: "object"
    }
  },
  {
    schema: {
      final: false,
      description:
        "Fast geschafft! Um Ihre Angaben überprüfen zu können, benötigen wir ein Dokument (z.B. als Handyfoto/Scan), aus dem der Name des Eigentümers und Ihre Adresse hervorgeht. Sie können persönliche Daten in dem Dokument schwärzen.",
      title: "",
      required: ["upload_dokument"],
      slug: "upload_dokument",
      properties: {
        upload_dokument: {
          items: {
            format: "data-url",
            type: "string"
          },
          type: "array"
        }
      },
      type: "object"
    },
    rules: [
      {
        conditions: {},
        event: "story_erzaehlen"
      }
    ]
  },
  {
    schema: {
      slug: "story_erzaehlen",
      description:
        "Vielen Dank! Wenn Sie möchten, erzählen Sie uns hier Ihre Mietergeschichte. Ansonsten klicken Sie „Weiter“ oder kontaktieren Sie uns unter hamburg@correctiv.org",
      title: "",
      properties: {
        story_erzaehlen: {
          type: "string"
        }
      },
      type: "object"
    },
    rules: [
      {
        conditions: {},
        event: "bestatigen"
      }
    ]
  },
  {
    schema: {
      final: true,
      description:
        "Hier können Sie optional Ihre E-Mail-Adresse eintragen. Dies ermöglicht es unseren Journalisten, Sie bei Rückfragen zu kontaktieren. Außerdem erhalten Sie als Dankeschön für Ihre Teilnahme eine Übersicht mit den Eigentumsverhältnissen in Ihrer Nachbarschaft. Im nächsten Schritt können Sie Ihre Angaben überprüfen und anschließend abschicken.",
      title: "",
      required: [],
      slug: "bestatigen",
      properties: {
        confirm_summary: {
          title:
            " Die Journalisten von CORRECTIV dürfen mich in Bezug auf die „Wem gehört Hamburg?” Recherche per E-Mail kontaktieren.",
          type: "boolean"
        },
        email: {
          type: "string"
        },
        authorize_email: {
          title:
            " Ich möchte über die Ergebnisse dieser Recherche und weitere Veröffentlichungen zum Wohnungmarkt in Hamburg informiert werden.",
          type: "boolean"
        }
      },
      type: "object"
    },
    conditions: {
      upload_dokument: {
        exists: true
      }
    }
  }
];

class StateHolder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uiSchema: {},
      formData: {},
      error: false,
      loading: true,
      formInstanceId: null,
      investigation: {},
      steps: [],
      sending: false,
      stepsTaken: new Set()
    };

    this.send = this.send.bind(this);
    this.finishForm = this.finishForm.bind(this);
  }

  componentDidMount() {
    window.addEventListener("beforeunload", unloadListener);
    this.loadData();
  }

  loadData() {
    const { investigation, form } = this.props.match.params;
    const promises = [
      api.getForm(investigation, form),
      api.getInvestigation(investigation)
    ];

    return Promise.all(promises)
      .then(([formData, investigationData]) => {
        this.setState({
          loading: false,
          steps: formData.form_json,
          uiSchema: formData.ui_schema_json,
          formInstanceId: formData.id,
          investigation: investigationData
        });
      })
      .catch(() => {
        this.setState({ error: true, loading: false });
      });
  }

  send() {
    const { investigation, form } = this.props.match.params;
    this.setState({ sending: true });
    trackSubmission();
    const payload = {
      email: this.state.email,
      form_instance: this.state.formInstanceId,
      json: this.state.formData
    };
    api
      .postResponse(payload, investigation, form, this.state.authToken)
      .then(response => {
        window.removeEventListener("beforeunload", unloadListener);
        window.location = response.redirect_url;
      })
      .catch(console.error);
  }

  finishForm(formData, stepsTaken) {
    this.setState({ formData, stepsTaken }, () => {
      this.props.history.push(`${this.props.match.url}/summary`);
    });
  }

  render() {
    const { loading, error } = this.state;

    if (loading) {
      return (
        <div className="state-holder__message state-holder__message--loading">
          {t("form.loading")}
        </div>
      );
    }

    if (error) {
      return (
        <div className="state-holder__message state-holder__message--error">
          {t("form.error")}
        </div>
      );
    }

    return (
      <Switch>
        <Route exact strict path={`${this.props.match.path}`}>
          <Redirect to={`${this.props.match.url}/start`} />
        </Route>

        <Route exact strict path={`${this.props.match.path}/`}>
          <Redirect to={`${this.props.match.url}start`} />
        </Route>

        <Route path={`${this.props.match.path}/summary`}>
          <Summary
            investigation={this.state.investigation}
            steps={this.state.steps}
            formData={this.state.formData}
            uiSchema={this.state.uiSchema}
            stepsTaken={this.state.stepsTaken}
          >
            {this.state.sending ? (
              <button className="btn btn-primary btn-lg btn-block" disabled>
                <FontAwesomeIcon icon="spinner" spin />
                {t("form.submitting")}
              </button>
            ) : (
              <button
                className="btn btn-primary btn-lg btn-block"
                onClick={this.send}
              >
                {t("form.submit")}
              </button>
            )}
          </Summary>
        </Route>

        <Route
          path={`${this.props.match.path}/:step`}
          render={({ match }) => {
            return (
              <FormWizard
                investigation={this.state.investigation}
                steps={mockFormJson}
                formData={this.state.formData}
                uiSchema={this.state.uiSchema}
                history={this.props.history}
                submitCallback={this.finishForm}
                match={match}
              />
            );
          }}
        />
      </Switch>
    );
  }
}

export default StateHolder;
