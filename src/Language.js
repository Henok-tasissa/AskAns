import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { Button } from "react-native-elements";
import { connect } from "react-redux";
import { setAppLanguage, setSelectedLanguage } from "./redux/appReducer";
import firebase, { db } from "../firebaseConfig";
class Language extends Component {
  state = {
    language: "",
  };
  componentDidMount = async () => {
    if (this.props.selectedLanguage != "") {
      let language = this.props.selectedLanguage;
      this.props.setAppLanguage(language);
    } else {
      this.props.setAppLanguage("English");
    }
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        // let userId = firebase.auth().currentUser.uid;
        // let userData = await db.collection("Users").doc(userId).get();
        // userData = userData.data();
        // if (userData.language != "") {
        //   if (this.props.selectedLanguage != "") {
        //     this.props.setAppLanguage(this.props.selectedLanguage);
        //   } else {
        //     this.props.setAppLanguage(userData.language);
        //   }
        //   this.props.navigation.navigate("Home");
        // }
        this.props.navigation.navigate("Home");
      } else {
        this.props.navigation.navigate("Language");
      }
    });
  };
  render() {
    const { app } = this.props;
    return (
      <View style={styles.container}>
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
          defaultValue={this.state.language}
          zIndex={100}
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
          onChangeItem={(item) => {
            this.props.setAppLanguage(item.value);
            this.setState({ language: item.value });
            console.log(item.value);
          }}
          placeholder={app.selectLanguage}
        />
        <Button
          title={app.next}
          buttonStyle={{ marginHorizontal: 10, padding: 5 }}
          type="outline"
          onPress={() => {
            this.props.setAppLanguage(this.state.language);
            this.props.navigation.navigate("Login");
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#EEEEEE",
    justifyContent: "center",
  },
});

const mapState = (state) => {
  return {
    app: state.app.app,
    selectedLanguage: state.app.selectedLanguage,
  };
};
const actionCreators = {
  setAppLanguage,
  setSelectedLanguage,
};
export default connect(mapState, actionCreators)(Language);
