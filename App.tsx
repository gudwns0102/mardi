import React from "react";
import { createStackNavigator, createAppContainer } from "react-navigation";
import { BoxShadow } from "react-native-shadow";
import LinearGradient from "react-native-linear-gradient";
import styled from "styled-components/native";
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
      <Container />
    );
  }
}

const AppNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen
  }
});

export default createAppContainer(AppNavigator);