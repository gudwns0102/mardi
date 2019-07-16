import React from "react";
import { createStackNavigator, createAppContainer } from "react-navigation";
import WebView from "react-native-webview";

class HomeScreen extends React.Component {
  render() {
    return (
      <WebView source={{uri: "https://google.com"}}/>
    );
  }
}

const AppNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen
  }
});

export default createAppContainer(AppNavigator);