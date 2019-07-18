import React, { Fragment } from "react";
import {
  ScrollView,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { Formik, FieldArray } from "formik";
import { compose } from "recompose";
import { CheckBox } from "react-native-elements";
import SelectInput from "@tele2/react-native-select-input";

import { TextField } from "react-native-material-textfield";

import makeInput, {
  handleTextInput,
  withNextInputAutoFocusInput,
  withNextInputAutoFocusForm,
  withPickerValues
} from "react-native-formik";

const Input = compose(
  handleTextInput,
  withNextInputAutoFocusInput
)(TextField);

const Select = compose(
  makeInput,
  withPickerValues
)(TextInput);

const Field = ({ field, repeater, index }) => {
  if (field.component === "input" || !field.component) {
    return (
      <Input
        label={field.label}
        type={field.type}
        name={repeater ? `${repeater}.${index}.${field.name}` : field.name}
      />
    );
  } else if (field.component === "checkbox") {
    return (
      <CheckBox
        title="Click Here"
        name={repeater ? `${repeater}.${index}.${field.name}` : field.name}
      />
    );
  } else if (field.component === "select") {
    return (
      <Select
        values={field.options}
        label={field.label}
        name={repeater ? `${repeater}[${index}]-${field.name}` : field.name}
      />
    );
  }
};

const Form = withNextInputAutoFocusForm(View);

const centres = [
  {
    name: "title",
    label: "Centre title",
    type: "input",
    component: "input",
    required: true,
    yup: {
      type: "string",
      checks: [
        {
          key: "minLength",
          val: 5
        },
        {
          key: "maxLength",
          val: 100
        }
      ]
    }
  },
  {
    name: "profilePicture",
    label: "Profile Pciture",
    type: "file",
    component: "input"
  },
  {
    name: "headerImage",
    label: "Header Image",
    type: "select",
    component: "select",
    options: [{ label: "two", value: 2 }]
  },
  {
    name: "checkbox",
    label: "Marketing Tariff",
    type: "checkbox",
    component: "checkbox"
  },

  {
    name: "email",
    label: "Email address",
    type: "input",
    required: true,
    validation: {
      type: "string",
      checks: [
        {
          key: "email",
          val: true
        }
      ]
    }
  },
  {
    name: "telephone",
    label: "Telephone Number",
    type: "input"
  },
  {
    name: "mobile",
    label: "Mobile Number",
    type: "input"
  },
  {
    name: "about",
    label: "About",
    type: "textarea"
  },
  {
    name: "howItWorks",
    label: "How it works",
    type: "textarea"
  },
  {
    name: "nextSteps",
    label: "Next Steps",
    type: "textarea"
  },
  {
    name: "address",
    label: "Address",
    type: "input"
  },
  {
    name: "openingTimes",
    label: "Opening Times",
    object: [
      {
        name: "day",
        label: "Day",
        type: "select",
        component: "select",
        options: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
      },
      {
        name: "address",
        label: "Address",
        component: "input"
      }
    ],
    buttonLabel: "Add opening time"
  }
];

export default function App() {
  return (
    <ScrollView>
      <Text>Open up App.js to start working on your app!</Text>
      <ScrollView>
        <Formik
          render={({
            handleSubmit,
            isSubmitting,
            handleChange,
            status,
            values
          }) => (
            <Form>
              {centres.map(field => {
                return field.object ? (
                  <>
                    {/* Repeater */}
                    <FieldArray
                      name={field.name}
                      render={({ insert, remove, push }) => (
                        <>
                          <Text
                            style={{
                              fontSize: 18,
                              marginLeft: 20,
                              marginTop: 20,
                              marginBottom: 10
                            }}
                          >
                            {field.label}
                          </Text>
                          {values[field.name] &&
                            values[field.name].length > 0 &&
                            values[field.name].map((friend, index) => (
                              <>
                                <View
                                  key={index}
                                  style={{
                                    margin: 20,
                                    padding: 20,
                                    borderWidth: 1
                                  }}
                                >
                                  <Text>{`#${index + 1}`}</Text>
                                  {field.object.map(repeaterField => {
                                    return (
                                      <Field
                                        field={repeaterField}
                                        repeater={field.name}
                                        index={index}
                                      />
                                    );
                                  })}
                                  <Button
                                    onPress={() => remove(index)}
                                    title={field.removeLabel || "Remove"}
                                  />
                                </View>
                              </>
                            ))}
                          <Button
                            type="button"
                            className="tickle__button"
                            icon="plus"
                            title={field.buttonLabel}
                            onPress={() => {
                              const object = {};
                              field.object.map((repeaterField, i) => {
                                object[repeaterField.name] = "";
                              });
                              push(object);
                              console.log("test");
                            }}
                          />
                        </>
                      )}
                    />
                  </>
                ) : (
                  <Field field={field} onChange={handleChange(field.name)} />
                );
              })}
              <Button
                className="tickle__button tickle__submit"
                disabled={isSubmitting}
                title={"Submit"}
              />
            </Form>
          )}
        />
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 400,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
