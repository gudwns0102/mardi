/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/emin93/react-native-template-typescript
 *
 * @format
 */

import React, { Fragment } from "react";
import { StatusBar } from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

const App = () => {
  AsyncStorage.getItem("ACCESS_TOKEN").then(console.log);
  return (
    <Fragment>
      <StatusBar barStyle="dark-content" />
    </Fragment>
  );
};

export default App;
