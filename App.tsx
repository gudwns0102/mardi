import React from "react";
import { createStackNavigator, createAppContainer } from "react-navigation";
import styled from "styled-components/native";
import firebase from "react-native-firebase";

class HomeScreen extends React.Component {
  render() {
    firebase.analytics().logEvent("test");
    return (
      <></>
    );
  }
}

const AppNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen
  }
});

export default createAppContainer(AppNavigator);