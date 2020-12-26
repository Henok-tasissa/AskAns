import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Button, Icon } from "react-native-elements";

const HorizontalTopics = (props) => {
  const { topics } = props;
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
      }}
    >
      {/* <View style={{ margin: 5, padding: 5 }}>
        <Icon name="minus" type="font-awesome" size={20} />
      </View> */}
      <ScrollView horizontal={true} containerStyle={{ padding: 5, flex: 1 }}>
        {topics.map((topic, key) => (
          <Button
            title={topic.name}
            type="solid"
            containerStyle={{ margin: 5 }}
            buttonStyle={
              props.selectedCategory != "" &&
              props.selectedCategory == topic.name
                ? { backgroundColor: "#add8e6" }
                : { backgroundColor: "#D3D3D3" }
            }
            titleStyle={{ color: "black" }}
            key={key}
            size="small"
            onPress={() => {
              props.selectedCategory == topic.name
                ? props.unselectCategory()
                : props.onChangeCategory(topic.name);
            }}
          />
        ))}
      </ScrollView>
      {/* <View style={{ margin: 6, padding: 5 }}>
        <Icon name="plus" type="font-awesome" size={20} />
      </View> */}
    </View>
  );
};
export default HorizontalTopics;
