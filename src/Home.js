import React from "react";
import { View, Text } from "react-native";
import { Header } from "ract-native-elements";

const Home = ({ navigation }) => {
  return (
    <View>
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
    </View>
  );
};

export default Home;
