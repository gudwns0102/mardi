import React from "react";
import { createStackNavigator, createAppContainer } from "react-navigation";
import { BoxShadow } from "react-native-shadow";

const createShadowOpt = (color: string) => ({
  width: 196,
  height: 64,
  color,
  border: 8,
  radius: 14,
  opacity: 0.6,
  x: 0,
  y: 3
});
class HomeScreen extends React.Component {
  render() {
    return (
      <BoxShadow setting={createShadowOpt("#FFAD00")} />
    );
  }
}

const AppNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen
  }
});

export default createAppContainer(AppNavigator);