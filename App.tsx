/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/emin93/react-native-template-typescript
 *
 * @format
 */

import _ from "lodash";
import React, { Fragment } from "react";
import { StatusBar } from "react-native";
import ImagePicker from "react-native-image-picker";

const App = () => {
  const options = {
    title: "사진 선택",
    takePhotoButtonTitle: "",
    cancelButtonTitle: "취소"
  };

  ImagePicker.launchCamera(options, response => {
    if (_.some([response.didCancel, response.error, response.customButton])) {
      return;
    }
  });

  return (
    <Fragment>
      <StatusBar barStyle="dark-content" />
    </Fragment>
  );
};

export default App;
