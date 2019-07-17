import React from "react";
import { Keyboard, Platform } from "react-native";
import { getBottomSpace } from "react-native-iphone-x-helper";
import styled from "styled-components/native";

import { isIos } from "src/utils/Platform";

interface IProps {
  backgroundColor: string;
}

const Container = styled.View`
  width: 100%;
  height: ${getBottomSpace()};
  z-index: 10000;
`;

export class BottomNotch extends React.Component<IProps> {
  public keyboardShow: any;
  public keyboardHide: any;

  public state = {
    showBottomNotch: true
  };

  public componentDidMount() {
    this.keyboardShow = Keyboard.addListener(
      isIos() ? "keyboardWillShow" : "keyboardDidShow",
      () => {
        this.setState({ showBottomNotch: false });
      }
    );

    this.keyboardHide = Keyboard.addListener(
      isIos() ? "keyboardWillHide" : "keyboardDidHide",
      () => {
        this.setState({ showBottomNotch: true });
      }
    );
  }

  public componentWillUnmount() {
    Keyboard.removeSubscription(this.keyboardShow);
    Keyboard.removeSubscription(this.keyboardHide);
  }

  public render() {
    const { showBottomNotch } = this.state;
    return showBottomNotch ? (
      <Container style={{ backgroundColor: this.props.backgroundColor }} />
    ) : (
      <React.Fragment />
    );
  }
}
