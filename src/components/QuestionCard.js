import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Avatar, Icon, Image } from "react-native-elements";
import { connect } from "react-redux";
const QuestionCard = (props) => {
  const {
    id,
    name,
    date,
    profileImage,
    title,
    text,
    upvotes,
    downvotes,
    answers,
    navigation,
    upvote,
    downvote,
    upvoted,
    downvoted,
    askedBy,
    userId,
    imageLink,
    readMore,
    app,
  } = props;

  return (
    <View
      style={{
        margin: 5,
        backgroundColor: "white",
        borderWidth: 0.25,
        borderColor: "gray",
        padding: 5,
        borderRadius: 5,
      }}
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
              uri: profileImage,
            }}
            size="medium"
            onPress={() =>
              userId == askedBy
                ? navigation.navigate("Profile")
                : navigation.navigate("UsersProfile", { userId: askedBy })
            }
          />
        </View>
        <View style={{ flex: 1, padding: 10 }}>
          <Text
            onPress={() =>
              userId == askedBy
                ? navigation.navigate("Profile")
                : navigation.navigate("UsersProfile", { userId: askedBy })
            }
          >
            {name}
          </Text>
        </View>
        <View style={{ padding: 10 }}>
          <Text>{date}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={{ margin: 5, padding: 5 }}
        onPress={() => navigation.navigate("Question", { questionId: id })}
      >
        <Text style={{ fontWeight: "600", marginBottom: 8, fontSize: 18 }}>
          {title}
        </Text>
        <Text>
          {readMore && text.length > 250 ? text.substring(0, 250) : text}
          {readMore && text.length > 250 ? (
            <Text style={{ color: "darkblue", fontWeight: "500" }}>
              {" "}
              ... [Read More]
            </Text>
          ) : null}
        </Text>
        {imageLink ? (
          <Image
            source={{ uri: imageLink }}
            style={{ width: "100%", height: 250 }}
            resizeMode="contain"
          />
        ) : null}
      </TouchableOpacity>
      <View style={{ flexDirection: "row", padding: 5, alignItems: "center" }}>
        <View style={{ paddingLeft: 5, flexDirection: "row" }}>
          <Icon
            name="thumbs-up"
            type="font-awesome"
            onPress={() => upvote(id)}
            iconStyle={upvoted ? { color: "blue" } : { color: "black" }}
          />
          <Text style={{ paddingTop: 5, paddingLeft: 5 }}>
            {upvotes} {app.upvotes}
          </Text>
        </View>
        <View style={{ paddingLeft: 15, flexDirection: "row" }}>
          <Icon
            name="thumbs-down"
            type="font-awesome"
            onPress={() => downvote(id)}
            iconStyle={downvoted ? { color: "blue" } : { color: "black" }}
          />
          <Text style={{ paddingTop: 5, paddingLeft: 5 }}>
            {downvotes} {app.downvotes}
          </Text>
        </View>
        <View
          style={{
            paddingLeft: 10,
            flex: 1,
            paddingTop: 5,
          }}
        >
          <Text
            style={{
              textAlign: "center",
            }}
          >
            {answers} {app.answers}
          </Text>
        </View>
      </View>
    </View>
  );
};

const mapState = (state) => {
  return {
    app: state.app.app,
  };
};
export default connect(mapState)(QuestionCard);
