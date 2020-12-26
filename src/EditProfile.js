import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  Header,
  Avatar,
  Input,
  Button,
  Accessory,
} from "react-native-elements";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import DropDownPicker from "react-native-dropdown-picker";
import { connect } from "react-redux";
import {
  updateProfile,
  updateBio,
  setProfileBio,
  uploadProfilePicture,
} from "./redux/userReducer";

class EditProfile extends Component {
  state = {
    bio: "",
    firstName: "",
    lastName: "",
    gender: "",
    language: "",
    photoURL: "",
  };
  handleUpdateBio = async (bio) => {
    if (bio != "") {
      const userBio = {
        userId: this.props.user.uid,
        bio,
      };
      await this.props.updateBio(userBio);
      this.props.setProfileBio(bio);
    }
  };

  handleUpdateProfile = async (firstName, lastName, gender, language) => {
    if (firstName != "" && lastName != "" && gender != "" && language != "") {
      const userInfo = {
        userId: this.props.user.uid,
        firstName,
        lastName,
        language,
        gender,
      };
      await this.props.updateProfile(userInfo);
    }
  };
  handleFillInformation = () => {
    this.setState({
      ...this.props.user,
    });
  };
  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        //alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  componentDidMount = () => {
    this.handleFillInformation();
  };

  _pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.6,
      });

      if (!result.cancelled) {
        const allowedImageFormats = [
          "jpg",
          "jpeg",
          "png",
          "image/png",
          "image/jpg",
          "image/jpeg",
        ];
        const { uri } = result;
        let imageType = uri.split(".");
        imageType = imageType[imageType.length - 1];
        imageType = imageType.toLowerCase();

        let imageBlob = await (await fetch(uri)).blob();
        if (Platform.OS == "web") {
          imageType = imageBlob.type;
        }
        if (allowedImageFormats.includes(imageType)) {
          // console.log("imageBlob");
          const info = {
            userId: this.props.user.uid,
            imageBlob: imageBlob,
          };
          await this.props.uploadProfilePicture(info);
        } else {
          console.log(124, imageBlob);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
  render() {
    const { app } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <Header
          centerComponent={{
            text: "AskAns",
            style: {
              color: "#000000",
              fontWeight: "bold",
              fontSize: 25,
            },
          }}
          containerStyle={{ backgroundColor: "#D3D3D3" }}
        />
        <ScrollView style={{ flex: 1, padding: 10 }}>
          <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS == "ios" ? "padding" : "height"}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 10,
                paddingBottom: 0,
              }}
            >
              <View style={{ marginBottom: 5 }}>
                <Avatar
                  rounded
                  source={{
                    uri: this.props.user.photoURL
                      ? this.props.user.photoURL
                      : null,
                  }}
                  size="medium"
                >
                  <Accessory
                    style={{ width: 15, height: 15, borderRadius: 50 }}
                    onPress={async () => {
                      this._pickImage();
                    }}
                  />
                </Avatar>
              </View>
              <View style={{ flex: 1, padding: 10 }}>
                <Text>{this.state.firstName + " " + this.state.lastName}</Text>
              </View>
            </View>
            <View style={{ marginVertical: 10 }}>
              <TextInput
                style={styles.detailinput}
                multiline={true}
                style={[styles.inputContainer, { minHeight: 150 }]}
                placeholder={app.updateBio}
                onChangeText={(text) => {
                  this.setState({
                    ...this.state,
                    bio: text,
                  });
                }}
                value={this.state.bio}
              />
              <Button
                style={{ marginLeft: 200 }}
                title={app.updateBioButton}
                onPress={() => {
                  this.handleUpdateBio(this.state.bio);
                }}
              />
            </View>

            <View
              style={{
                marginVertical: 10,
              }}
            >
              <TextInput
                style={styles.inputContainer}
                placeholder={app.firstName}
                onChangeText={(text) => {
                  this.setState({
                    ...this.state,
                    firstName: text,
                  });
                }}
                value={this.state.firstName}
              />
              <TextInput
                style={styles.inputContainer}
                placeholder={app.lastName}
                onChangeText={(text) => {
                  this.setState({
                    ...this.state,
                    lastName: text,
                  });
                }}
                value={this.state.lastName}
              />

              <View style={styles.dropdown}>
                <DropDownPicker
                  items={[
                    {
                      label: "AMHARIC",
                      value: "Amharic",
                      hidden: true,
                    },
                    {
                      label: "OROMIFFA",
                      value: "Oromiffa",
                    },
                    {
                      label: "ENGLISH",
                      value: "English",
                    },
                    {
                      label: "SPANISH",
                      value: "Spanish",
                    },
                  ]}
                  defaultValue={this.state.language}
                  containerStyle={{ height: 40 }}
                  style={{ backgroundColor: "#fafafa" }}
                  itemStyle={{
                    justifyContent: "flex-start",
                  }}
                  dropDownStyle={{ backgroundColor: "#fafafa" }}
                  onChangeItem={(item) => {
                    this.setState({
                      ...this.state,
                      language: item.value,
                    });
                  }}
                  placeholder={app.languageName}
                />
              </View>
              <View style={[styles.dropdown, { zIndex: 90 }]}>
                <DropDownPicker
                  style={{ marginTop: 50 }}
                  items={[
                    {
                      label: app["FEMALE"],
                      value: "Female",
                      hidden: true,
                    },
                    {
                      label: app["MALE"],
                      value: "Male",
                    },
                  ]}
                  defaultValue={this.state.any}
                  containerStyle={{ height: 40 }}
                  style={{ backgroundColor: "#fafafa" }}
                  itemStyle={{
                    justifyContent: "flex-start",
                  }}
                  dropDownStyle={{ backgroundColor: "#fafafa" }}
                  onChangeItem={(item) =>
                    this.setState({
                      ...this.state,
                      gender: item.value,
                    })
                  }
                  defaultValue={this.state.gender}
                  placeholder={app.gender}
                />
              </View>

              <Button
                style={{ marginTop: 20, marginHorizontal: 10 }}
                title={app.updateInfo}
                onPress={() => {
                  this.handleUpdateProfile(
                    this.state.firstName,
                    this.state.lastName,
                    this.state.gender,
                    this.state.language
                  );
                }}
              />
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    borderWidth: 0.25,
    minHeight: 50,
    borderRadius: 4,
    padding: 10,
    fontSize: 15,
    backgroundColor: "white",
    borderColor: "gray",
    marginBottom: 10,
  },
  dropdown: {
    zIndex: 100,
    marginTop: 15,
    borderWidth: 0.25,
    minHeight: 50,
    borderRadius: 4,
    padding: 10,
    fontSize: 15,
    backgroundColor: "white",
    borderColor: "gray",
    marginBottom: 10,
  },
});
const mapState = (state) => {
  return {
    user: state.user,
    app: state.app.app,
  };
};
const actionCreators = {
  updateProfile,
  updateBio,
  setProfileBio,
  uploadProfilePicture,
};
export default connect(mapState, actionCreators)(EditProfile);
