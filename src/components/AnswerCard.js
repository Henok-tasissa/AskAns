import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Avatar, Icon } from "react-native-elements";
import { connect } from "react-redux";
const AnswerCard = (props) => {
  const {
    name,
    date,
    profileImage,
    answer,
    upvotes,
    downvotes,
    downvote,
    upvoted,
    downvoted,
    upvote,
    userId,
    answeredBy,
    id,
    navigation,
    app,
  } = props;

  return (
    <View style={{ flexDirection: "row" }}>
      <View style={{ marginBottom: 5 }}>
        <Avatar
          rounded
          source={{
            uri: profileImage,
          }}
          size="medium"
          onPress={() => {
            userId == answeredBy
              ? navigation.navigate("Profile")
              : navigation.navigate("UsersProfile", { userId: answeredBy });
          }}
        />
      </View>
      <View
        style={{
          margin: 5,
          backgroundColor: "white",
          borderWidth: 0.25,
          borderColor: "gray",
          padding: 5,
          borderRadius: 5,
          flex: 1,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 5,
            paddingBottom: 0,
          }}
        >
          <View style={{ flex: 1, padding: 5 }}>
            <Text
              style={{ fontWeight: "bold" }}
              onPress={() => {
                userId == answeredBy
                  ? navigation.navigate("Profile")
                  : navigation.navigate("UsersProfile", { userId: answeredBy });
              }}
            >
              {name}
            </Text>
          </View>
          <View style={{ padding: 5 }}>
            <Text>{date}</Text>
          </View>
        </View>
        <View style={{ margin: 5, padding: 5, marginTop: 0 }}>
          <Text>{answer}</Text>
        </View>
        <View
          style={{ flexDirection: "row", padding: 5, alignItems: "center" }}
        >
          <View style={{ paddingLeft: 5, flexDirection: "row", flex: 1 }}>
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
          <View style={{ paddingLeft: 15, flexDirection: "row", flex: 1 }}>
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
export default connect(mapState)(AnswerCard);
