import React, { Component } from "react";
import { View, Text } from "react-native";
import { Header, Avatar, Icon, Button, Image } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import HorizontalTopics from "./components/HorizontalTopics";
import QuestionCard from "./components/QuestionCard";
import firebase, { db } from "../firebaseConfig";
import { setUser } from "./redux/userReducer";
import { getCategories } from "./redux/categoriesReducer";
import {
  getQuestionsByLanguage,
  getQuestionsByCategories,
  upvoteQuestionFromFeed,
  downvoteQuestionFromFeed,
} from "./redux/questionsReducer";
import { connect } from "react-redux";

class Feed extends Component {
  state = {
    questions: [],
    topics: [],
    selectedCategory: "",
  };

  fetchQuestionsByLanguage = async () => {
    const language = this.props.user.language;
    await this.props.getQuestionsByLanguage(language);
    this.setState({
      ...this.state,
      questions: this.props.questions,
      selectedCategory: "",
    });
  };
  handleUpvote = async (questionId, askedBy) => {
    const questionInfo = { userId: this.props.user.uid, questionId, askedBy };
    await this.props.upvoteQuestionFromFeed(questionInfo);
  };

  handleDownvote = async (questionId, askedBy) => {
    const questionInfo = {
      userId: this.props.user.uid,
      questionId,
      askedBy,
    };
    this.props.downvoteQuestionFromFeed(questionInfo);
  };

  getCategories = async () => {
    if (this.props.user) {
      await this.props.getCategories(this.props.user.language);
    }
  };

  getUser = async () => {
    let uid = firebase.auth().currentUser.uid;
    await this.props.setUser(uid);
  };

  componentDidMount = async () => {
    await this.getUser();
    await this.getCategories();
    await this.fetchQuestionsByLanguage();
  };

  handleChangeByCategories = async (category) => {
    await this.props.getQuestionsByCategories(category);
    this.setState({
      ...this.state,
      questions: this.props.questions,
      selectedCategory: category,
    });
  };
  handleUnselectCategory = async () => {
    await this.fetchQuestionsByLanguage();
  };
  render() {
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

        <ScrollView
          style={{ flex: 1, padding: 5, paddingTop: 10, paddingBottom: 60 }}
        >
          {this.props.categories ? (
            <HorizontalTopics
              topics={this.props.categories.categories}
              onChangeCategory={(category) =>
                this.handleChangeByCategories(category)
              }
              selectedCategory={this.state.selectedCategory}
              unselectCategory={() => this.handleUnselectCategory()}
            />
          ) : null}

          {this.props.questions.map((question, key) => {
            return (
              <QuestionCard
                name={question.name}
                profileImage={
                  question.askedBy == this.props.user.uid
                    ? this.props.user.photoURL
                    : question.profileImage
                }
                title={question.title}
                text={question.text}
                upvotes={question.upvotes}
                downvotes={question.downvotes}
                answers={question.answers}
                date={question.date}
                key={key}
                askedBy={question.askedBy}
                userId={this.props.user.uid}
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
          })}
        </ScrollView>
      </View>
    );
  }
}

const mapState = (state) => {
  return {
    user: state.user,
    categories: state.categories,
    questions: state.questions.questions,
    app: state.app.app,
  };
};
const actionCreators = {
  setUser,
  getCategories,
  getQuestionsByLanguage,
  getQuestionsByCategories,
  upvoteQuestionFromFeed,
  downvoteQuestionFromFeed,
};

export default connect(mapState, actionCreators)(Feed);
