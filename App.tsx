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
import { BlurView } from "@react-native-community/blur";
import { AudioRecorder, AudioUtils } from "react-native-audio";


const App = () => {
  console.log(AudioRecorder);
  AudioRecorder.startRecording();
  return (
    <Fragment>
      <StatusBar barStyle="dark-content" />
      <BlurView blurAmount={17} blurType="light" />
    </Fragment>
  );
};

export default App;
