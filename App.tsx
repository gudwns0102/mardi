import React from "react";
import { createStackNavigator, createAppContainer } from "react-navigation";
import { BoxShadow } from "react-native-shadow";
import LinearGradient from "react-native-linear-gradient";
import styled from "styled-components/native";
import Video from "react-native-video"
const Container = styled(LinearGradient).attrs({
  colors: ["rgb(23, 135, 217)", "rgb(25, 86, 212)"]
})`
  align-items: center;
  justify-content: center;
  width: 100%;
  flex: 1;
  padding: 178px 52px 21px;
`;

class HomeScreen extends React.Component {
  render() {
    return (
        <Video style={{width: "100%", flex: 1}} source={{uri: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"}}/>
    );
  }
}

const AppNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen
  }
});

export default createAppContainer(AppNavigator);