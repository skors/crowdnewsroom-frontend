// Vue.http.options.emulateJSON = true;

var vm = new Vue({
  el: "#chat",
  name: "chat",
  delimiters: ["${", "}"],
  data: {
    messages: [{ from: "user", content: "Hello bot!" }],
    formschema: "",
    uischema: "",
    fields: [],
    fieldIndex: -1,
    formData: new FormData(),
    loading: true,
    errored: false,
    errorMessage: "Sample error message"
  },
  mounted: function() {
    console.log("mounted");

    var uri = window.location.search.substring(1);
    var params = new URLSearchParams(uri);
    var investigation = params.get("investigation");
    if (!investigation) {
      investigation = "where-do-you-live-again";
    }
    var interviewer = params.get("interviewer");
    if (!interviewer) {
      interviewer = "wo-stehst-du-bahn";
    }

    var formURL =
      "https://crowdnewsroom-staging.correctiv.org/forms/investigations/" +
      investigation +
      "/forms/" +
      interviewer;

    var vm = this;
    axios
      .get(formURL)
      .then(function(response) {
        vm.formschema = response.data.form_json;
        vm.uischema = response.data.ui_schema_json;
      })
      .catch(error => {
        console.log(error);
        vm.errored = true;
      })
      .finally(() => {
        vm.initChat();
      });
  },
  computed: {
    currentField: function() {
      if (!this.fields[this.fieldIndex]) {
        console.log("Error: currentField returns nothing!");
      }
      return this.fields[this.fieldIndex];
    },
    currentFieldWantsText: function() {
      if (this.currentField) {
        // returns true if the current field requires text input by user
        if (
          ["", "email", "number", "longtext"].includes(this.currentField.widget)
        ) {
          return true;
        }
        return false;
      }
    }
  },
  methods: {
    initChat: function() {
      // called when all form data (form + ui) has been loaded

      for (var idx in this.formschema) {
        var slide = this.formschema[idx];
        // to get the proper field ordering, we have to get it from
        // the UIschema
        var fieldOrdering = this.uischema[slide.schema.slug]["ui:order"];
        for (var i in fieldOrdering) {
          var field = slide.schema.properties[fieldOrdering[i]];
          field.slideSlug = slide.schema.slug;
          var widgetType = this.getFieldType(field);
          if (widgetType == "text") {
            widgetType = "";
          }
          if (widgetType == "location") {
            console.log("Location field info:");
            fieldUI = this.uischema[slide.schema.slug][field.slug];
            if ("ui:location_button" in fieldUI) {
              console.log("I have location data! Please check this.");
              field.location_label = "Click here to send your location";
            } else {
              field.location_label = "Click here to send your location";
            }
            console.log();
            //console.log(this.uischema[slide.schema.slug][field.slug]['ui:location_button']);
          } else if (
            ["dropdown", "radio", "boolean", "checkboxes"].includes(widgetType)
          ) {
            field.answered = false;
          }
          field.widget = widgetType;
          this.fields.push(field);
        }
      }
      this.loading = false;
      this.showNextField();
    },

    showNextField: function() {
      this.fieldIndex += 1;
      var field = this.fields[this.fieldIndex];
      this.messages.push({
        from: "bot",
        content: field.title,
        field: field
      });
      var objDiv = document.getElementById("chat-content");
      objDiv.scrollTop = objDiv.scrollHeight;
    },

    sendMessage: function() {
      var el = document.getElementById("input-box");
      var msg = el.value;
      if (msg) {
        this.messages.push({ from: "user", content: msg });
        this.formData.set(this.currentField.slug, msg);
        // clear message box and return focus to it
        el.value = "";
        el.focus();
        var objDiv = document.getElementById("chat-content");
        objDiv.scrollTop = objDiv.scrollHeight;

        for (var pair of this.formData.entries()) {
          console.log(pair[0] + ", " + pair[1]);
        }

        this.showNextField();
      }
    },
    sendOption: function(ev, field, value) {
      // for multiple-choice fields
      this.formData.set(field.slug, value);
      // mark selected option
      ev.target.className += " selected";
      // ensure we disable the buttons
      field.answered = true;
      this.showNextField();
    },
    setFile: function(ev, field) {
      // for file upload fields
      // var f = ev.target.files[0]
      var f = "file";
      console.log(f);
      this.formData.append(field.slug, f);
      this.showNextField();
    },
    setLocation: function(ev, field) {
      var vm = this;
      navigator.geolocation.getCurrentPosition(
        function(position) {
          var value =
            position.coords.latitude + "," + position.coords.longitude;
          vm.formData.append(field.slug, value);
          console.log(value);
          vm.showNextField();
        },
        function(error) {
          console.log(error);
          /*
          var errorMessage = error.message;
          if (error.message) {
            if (widget.props.options.location_help_url) {
              errorMessage +=
                '. <a href="' +
                widget.props.options.location_help_url +
                '" target="_blank">Click here to learn more.</a>';
            }
          }
          if (error.code === 1) {
            reason = "permission denied";
          } else if (error.code === 2) {
            reason = "position unavailable";
          } else if (error.code === 3) {
            reason = "timed out";
          } else {
            reason = "unknown reason";
          }
          reason = reason.charAt(0).toUpperCase() + reason.slice(1);
          console.log(error);
          widget.setState({
            errorMessage: "<strong>" + reason + "</strong>: " + errorMessage,
            label: widget.props.options.location_error,
            stateclass: "button alert"
          });
          return widget.props.onChange("");
          */
        }
      );
    },

    getFieldType: function(field) {
      if (this.getFieldWidget(field) == "oneLineWidget") {
        return "oneline";
      }
      if (field.type == "boolean") {
        return "boolean";
      }
      if (field.type == "integer" || field.type == "number") {
        return "number";
      }
      if (field.type == "array") {
        return "checkboxes";
      }

      if (field.type == "string") {
        if (field.format == "email") {
          return "email";
        }
        if (field.format == "date") {
          return "date";
        }
        if (this.getFieldWidget(field) == "textarea") {
          return "longtext";
        }
        if (this.getFieldWidget(field) == "signatureWidget") {
          return "signature";
        }
        if (this.getFieldWidget(field) == "locationWidget") {
          return "location";
        }
        if (this.getFieldWidget(field) == "radio") {
          return "radio";
        }
        if (field.format == "data-url") {
          if (this.getFieldWidget(field) == "imageUpload") {
            return "imageupload";
          }
          return "fileupload";
        }
        if (field.enum && !this.getFieldWidget(field)) {
          return "dropdown";
        }
        return "text";
      }
      console.log("Unrecognized field");
      console.log(field);
      return "";
    },
    getFieldWidget: function(field) {
      // if a specific widget is specified in the UI Schema, return its name
      if (!(field.slideSlug in this.uischema)) {
        return null;
      }
      if (!(field.slug in this.uischema[field.slideSlug])) {
        return null;
      }
      if (!("ui:widget" in this.uischema[field.slideSlug][field.slug])) {
        return null;
      }
      return this.uischema[field.slideSlug][field.slug]["ui:widget"];
    }
  }
});
