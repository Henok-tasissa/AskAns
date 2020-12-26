import React, { Component } from "react";
import { View, Text, ScrollView } from "react-native";
import {
  Header,
  Icon,
  Avatar,
  ButtonGroup,
  Divider,
} from "react-native-elements";
import QuestionCard from "./components/QuestionCard";
import { connect } from "react-redux";
import { getQuestionsByUserId } from "./redux/questionsReducer";
import {
  upvoteQuestionFromUserProfile,
  downvoteQuestionFromUserProfile,
} from "./redux/questionsReducer";
import firebase from "../firebaseConfig";

class Profile extends Component {
  state = {
    profile: {},
    questions: [],
  };
  handleGetProfile = () => {
    this.setState({
      profile: this.props.user,
    });
  };
  handleGetQuestionsByUserId = async () => {
    await this.props.getQuestionsByUserId(this.props.user.uid);
    this.setState({
      ...this.state,
      questions: this.props.questions,
    });
  };
  handleUpvote = async (questionId, askedBy) => {
    let userId = this.props.user.uid;
    const questionInfo = { userId, questionId, askedBy };
    await this.props.upvoteQuestionFromUserProfile(questionInfo);
  };

  handleDownvote = async (questionId, askedBy) => {
    const questionInfo = {
      userId: this.props.user.uid,
      questionId,
      askedBy,
    };
    this.props.downvoteQuestionFromUserProfile(questionInfo);
  };

  componentDidMount = async () => {
    this.handleGetProfile();
    await this.handleGetQuestionsByUserId();
  };
  render() {
    return (
      <View
        style={{
          flex: 1,
        }}
      >
        <Header
          leftComponent={
            <Icon
              name="power-off"
              type="font-awesome"
              onPress={() => firebase.auth().signOut()}
            />
          }
          centerComponent={{
            text: "AskAns",
            style: { color: "#000000", fontWeight: "800", fontSize: 25 },
          }}
          rightComponent={
            <Icon
              name="user-edit"
              type="font-awesome-5"
              onPress={() => this.props.navigation.navigate("EditProfile")}
            />
          }
          containerStyle={{ backgroundColor: "#D3D3D3" }}
        />
        <ScrollView style={{ flex: 1 }}>
          <View style={{ margin: 15 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Avatar
                rounded
                size="large"
                source={{ uri: this.props.user.photoURL }}
              />
              <Text style={{ marginLeft: 20, fontSize: 22, fontWeight: "500" }}>
                {this.state.profile.firstName +
                  " " +
                  this.state.profile.lastName}
              </Text>
            </View>
            <View style={{ margin: 5 }}>
              <Text
                style={{
                  fontSize: 16,
                }}
              >
                {this.props.user.bio}
              </Text>
            </View>
          </View>

          <Divider
            style={{ backgroundColor: "gray", height: 0.25, margin: 10 }}
          />
          {/* <View>
            <ButtonGroup
              selectedIndex={0}
              buttons={["Questions", "Answers"]}
              containerStyle={{}}
            />
          </View> */}
          <View style={{ padding: 5 }}>
            {this.props.questions
              ? this.props.questions.map((question, key) => {
                  return (
                    <QuestionCard
                      name={question.name}
                      profileImage={question.profileImage}
                      title={question.title}
                      text={question.text}
                      upvotes={question.upvotes}
                      downvotes={question.downvotes}
                      answers={question.answers}
                      date={question.date}
                      key={key}
                      navigation={this.props.navigation}
                      upvote={(questionId) =>
                        this.handleUpvote(questionId, question.askedBy)
                      }
                      downvote={(questionId) =>
                        this.handleDownvote(questionId, question.askedBy)
                      }
                      upvoted={
                        question.upvotedBy.includes(this.props.user.uid)
                          ? true
                          : false
                      }
                      downvoted={
                        question.downvotedBy.includes(this.props.user.uid)
                          ? true
                          : false
                      }
                      id={question.id}
                      imageLink={question.imageLink}
                      readMore={true}
                    />
                  );
                })
              : null}
          </View>
        </ScrollView>
      </View>
    );
  }
}
const mapState = (state) => {
  return {
    user: state.user,
    questions: state.questions.userQuestions,
  };
};
const actionCreators = {
  getQuestionsByUserId,
  upvoteQuestionFromUserProfile,
  downvoteQuestionFromUserProfile,
};
export default connect(mapState, actionCreators)(Profile);
