import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { connect } from "react-redux";
import { Button, Input } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import firebase, { db } from "../firebaseConfig";
import DropDownPicker from "react-native-dropdown-picker";

const Register = ({ navigation, app }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [language, setLanguage] = useState({
    label: "ENGLISH",
    value: "English",
  });

  const [error, setError] = useState({
    status: false,
    message: "",
  });

  const validateForm = (firstName, lastName, email, password) => {
    let err = {
      status: false,
      message: "",
    };
    if (firstName == "" || lastName == "" || email == "" || password == "") {
      err = {
        status: true,
        message: "Make sure you filled all the required fields.",
      };
      setError(err);
    } else {
      err = {
        status: false,
        message: "",
      };
      setError(err);
    }

    return err.status ? false : true;
  };

  const registerUser = async (firstName, lastName, email, password) => {
    let isValid = validateForm(firstName, lastName, email, password);

    if (isValid) {
      await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((data) => {
          const { user } = data;

          let userData = {
            uid: user.uid,
            firstName: firstName,
            lastName: lastName,
            photoURL:
              "https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png",
            email: user.email,
            age: "",
            gender: "",
            bio: "",
            questionsCount: 0,
            answersCount: 0,
            language: language.value,
          };
          console.log(userData);
          db.collection("Users").doc(user.uid).set(userData);
          console.log("Registered");
          setFirstName("");
          setLastName("");
          setEmail("");
          setPassword("");
        })
        .catch((err) => console.log(err));
    }
  };
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS == "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.signUpFormContainer}>
          {error.status ? (
            <Text
              style={{
                color: "red",
                textAlign: "center",
                padding: 5,
                fontWeight: "bold",
              }}
            >
              {app.checkPassOrEmail}
            </Text>
          ) : null}

          <Input
            placeholder={app.firstName}
            leftIcon={<Icon name="user" size={24} color="black" />}
            onChangeText={(firstName) => setFirstName(firstName)}
            value={firstName}
          />
          <Input
            placeholder={app.lastName}
            leftIcon={<Icon name="user" size={24} color="black" />}
            onChangeText={(lastName) => setLastName(lastName)}
            value={lastName}
          />
          <Input
            placeholder={app.emailAddress}
            leftIcon={<Icon name="envelope" size={24} color="black" />}
            onChangeText={(email) => setEmail(email)}
            value={email}
          />
          <Input
            placeholder={app.password}
            leftIcon={<Icon name="key" size={24} color="black" />}
            onChangeText={(password) => setPassword(password)}
            secureTextEntry={true}
            value={password}
            textContentType="newPassword"
          />
          <DropDownPicker
            items={[
              {
                label: "ENGLISH",
                value: "English",
              },
              {
                label: "AMHARIC",
                value: "Amharic",
              },
              {
                label: "OROMIFFA",
                value: "Oromiffa",
              },
              {
                label: "SPANISH",
                value: "Spanish",
              },
            ]}
            zIndex={100}
            defaultValue={language.value}
            containerStyle={{ height: 40, marginBottom: 15 }}
            style={{
              backgroundColor: "#fafafa",
              marginHorizontal: 10,
              fontSize: 13,
            }}
            itemStyle={{
              justifyContent: "flex-start",
            }}
            dropDownStyle={{ backgroundColor: "#fafafa" }}
            onChangeItem={(item) => setLanguage(item)}
          />
          <Button
            title={app.signUp}
            style={styles.signUpButton}
            buttonStyle={{ marginHorizontal: 10 }}
            onPress={() => {
              registerUser(firstName, lastName, email, password);
            }}
          />
          <Text style={styles.question}>{app.haveAcnt}</Text>
          <Button
            title={app.signInHere}
            style={styles.signUpButton}
            buttonStyle={{ marginHorizontal: 10 }}
            type="outline"
            onPress={() => navigation.navigate("Login")}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#EEEEEE",
  },
  signUpButton: {
    padding: 10,
  },
  signUpFormContainer: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  question: {
    textAlign: "center",
    margin: 10,
  },
});
const mapState = (state) => {
  return {
    app: state.app.app,
  };
};
export default connect(mapState)(Register);
