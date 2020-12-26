import React, { Component } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Header, Avatar, Input, Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import DropDownPicker from "react-native-dropdown-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";

import { connect } from "react-redux";
import { askQuestion } from "./redux/questionsReducer";
import { getCategories } from "./redux/categoriesReducer";

class Ask extends Component {
  state = {
    categories: [],
    question: {
      title: "",
      text: "",
      category: "",
      imageBlob: "",
    },
    selectedCategory: null,
  };

  handleAsk = async (title, text, category, imageBlob) => {
    if (title != "" && text != "" && category != "") {
      const userId = this.props.user.uid;
      const language = this.props.user.language;
      category = category ? category : "A";
      const questionInfo = {
        userId,
        title,
        text,
        category,
        language,
        imageBlob,
      };
      await this.props.askQuestion(questionInfo);
      this.setState({
        ...this.state,
        question: {
          title: "",
          text: "",
          category: "",
        },
        selectedCategory: null,
      });
    }
  };

  getCategories = async () => {
    if (this.props.user) {
      await this.props.getCategories(this.props.user.language);
    }

    const categories = this.props.categories;
    let categoryList = [];

    categories.categories.map((category) => {
      let ctgry = {};
      ctgry["label"] = category.name;
      ctgry["value"] = category.name;
      categoryList.push(ctgry);
    });
    this.setState({
      ...this.state,
      categories: categoryList,
    });
  };
  _pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
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
          this.setState({
            ...this.state,
            question: {
              ...this.state.question,
              imageBlob: imageBlob,
            },
          });
        } else {
          console.log(124, imageBlob);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
  componentDidMount = async () => {
    await this.getCategories();
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
        <ScrollView style={{ flex: 1 }}>
          <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
          >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View>
                <View style={{ margin: 5 }}>
                  <Text
                    style={{
                      padding: 5,
                      textAlign: "left",
                      fontWeight: "bold",
                      fontSize: 20,
                    }}
                  >
                    {app.askQuestion}
                  </Text>
                </View>
                <View>
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
                          uri: this.props.user.photoURL,
                        }}
                        size="medium"
                      />
                    </View>
                    <View style={{ flex: 1, padding: 10 }}>
                      <Text>
                        {this.props.user.firstName +
                          " " +
                          this.props.user.lastName}
                      </Text>
                    </View>
                    {/* <View style={{ padding: 10 }}>
                      <Text>00/00/0000</Text>
                    </View> */}
                  </View>
                </View>
                <View style={{ margin: 5 }}>
                  <TextInput
                    style={styles.titleinput}
                    placeholder={app.addQuestionTitle}
                    multiline={true}
                    onChangeText={(text) =>
                      this.setState({
                        ...this.state,
                        question: {
                          ...this.state.question,
                          title: text,
                        },
                      })
                    }
                    value={this.state.question.title}
                  />
                </View>

                <View style={{ margin: 5, marginTop: 5 }}>
                  <TextInput
                    style={styles.detailinput}
                    placeholder={app.addQuestionDetail}
                    multiline={true}
                    onChangeText={(text) =>
                      this.setState({
                        ...this.state,
                        question: {
                          ...this.state.question,
                          text: text,
                        },
                      })
                    }
                    value={this.state.question.text}
                  />
                  <Button
                    icon={
                      <Icon
                        name="image"
                        size={20}
                        color="gray"
                        style={{ marginRight: 20 }}
                      />
                    }
                    containerStyle={{
                      marginTop: 5,
                      marginHorizontal: 5,
                    }}
                    buttonStyle={{ backgroundColor: "#D3D3D3", padding: 12 }}
                    title={
                      this.state.question.imageBlob
                        ? app.removeImage
                        : app.attachImage
                    }
                    titleStyle={{ color: "black", fontSize: 14 }}
                    onPress={() => {
                      this.state.question.imageBlob
                        ? this.setState({
                            ...this.state,
                            question: { ...this.state.question, imageBlob: "" },
                          })
                        : this._pickImage();
                    }}
                  />
                </View>

                <View>
                  <DropDownPicker
                    items={this.state.categories}
                    //defaultValue={this.state.any}
                    style={{
                      backgroundColor: "#fafafa",
                      marginHorizontal: 10,
                      marginTop: 10,
                    }}
                    itemStyle={{
                      justifyContent: "flex-start",
                    }}
                    dropDownStyle={{ backgroundColor: "#fafafa" }}
                    onChangeItem={(item) => {
                      this.setState({
                        ...this.state,
                        question: {
                          ...this.state.question,
                          category: item.value,
                        },
                        selectedCategory: item.value,
                      });
                    }}
                    defaultValue={this.state.selectedCategory}
                    placeholder={app.selectCategory}
                  />

                  <Button
                    containerStyle={{ marginTop: 20, marginHorizontal: 10 }}
                    title={app.ask}
                    onPress={() => {
                      this.handleAsk(
                        this.state.question.title,
                        this.state.question.text,
                        this.state.question.category,
                        this.state.question.imageBlob
                      );
                    }}
                  />
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  dropdown: {
    zIndex: 100,
    marginTop: 5,
    borderWidth: 0.25,
    minHeight: 50,
    borderRadius: 4,
    padding: 10,
    fontSize: 15,
    backgroundColor: "white",
    borderColor: "gray",
    marginBottom: 10,
    marginHorizontal: 10,
  },
  titleinput: {
    borderWidth: 0.25,
    minHeight: 50,
    borderRadius: 4,
    padding: 10,
    fontSize: 18,
    backgroundColor: "white",
    borderColor: "gray",
    marginBottom: 10,
    marginHorizontal: 5,
    fontWeight: "bold",
  },
  detailinput: {
    borderWidth: 0.25,
    minHeight: 150,
    borderRadius: 4,
    padding: 10,
    fontSize: 15,
    backgroundColor: "white",
    borderColor: "gray",
    marginBottom: 10,
    marginHorizontal: 5,
  },
});

const mapState = (state) => {
  return {
    categories: state.categories,
    questions: state.questions,
    user: state.user,
    app: state.app.app,
  };
};
const actionCreators = {
  askQuestion,
  getCategories,
};
export default connect(mapState, actionCreators)(Ask);
