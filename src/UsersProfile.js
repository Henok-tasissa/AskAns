import React, { Component } from "react";
import { View, Text, ScrollView } from "react-native";
import { Header, Icon, Avatar, ButtonGroup } from "react-native-elements";
import QuestionCard from "./components/QuestionCard";
import { connect } from "react-redux";
import { getQuestionsByUserId } from "./redux/questionsReducer";
import {
  upvoteQuestionFromUserProfile,
  downvoteQuestionFromUserProfile,
} from "./redux/questionsReducer";

import { getUserById } from "./redux/usersReducer";

class UsersProfile extends Component {
  state = {
    profile: {},
    questions: [],
  };
  handleGetProfile = async () => {
    const { userId } = this.props.route.params;
    const userInfo = { userId };
    await this.props.getUserById(userInfo);
    this.setState({
      ...this.state,
      profile: this.props.users,
    });
  };
  handleGetQuestionsByUserId = async () => {
    await this.props.getQuestionsByUserId(this.props.users.uid);
    this.setState({
      ...this.state,
      questions: this.props.questions,
    });
  };
  handleUpvote = async (questionId, askedBy) => {
    const questionInfo = { userId: this.props.user.uid, questionId, askedBy };
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
    await this.handleGetProfile();
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
          centerComponent={{
            text: "AskAns",
            style: { color: "#000000", fontWeight: "800", fontSize: 25 },
          }}
          containerStyle={{ backgroundColor: "#D3D3D3" }}
        />
        <ScrollView style={{ flex: 1 }}>
          <View style={{ margin: 15 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Avatar
                rounded
                size="large"
                source={{ uri: this.state.profile.photoURL }}
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
                {this.state.profile.bio}
              </Text>
            </View>
          </View>

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
                      imageLink={question.imageLink}
                      id={question.id}
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
    users: state.users.user,
  };
};
const actionCreators = {
  getQuestionsByUserId,
  upvoteQuestionFromUserProfile,
  downvoteQuestionFromUserProfile,

  getUserById,
};
export default connect(mapState, actionCreators)(UsersProfile);
