import React from "react";
import { NavigationScreenProp } from "react-navigation";
import styled from "styled-components/native";

import { images } from "assets/images";
import { PlainHeader } from "src/components/PlainHeader";
import { Text } from "src/components/Text";

const Container = styled.View`
  width: 100%;
  flex: 1;
  background-color: #ebebeb;
`;

const Logo = styled.Image.attrs({ source: images.icLogoBigBlueCopy30 })``;

const PrevText = styled(Text).attrs({ type: "bold" })`
  font-size: 16px;
  line-height: 27px;
  color: rgb(187, 57, 119);
`;

export class MagazineScreen extends React.Component {
  public static options: IScreenOptions = {
    statusBarProps: {
      backgroundColor: "#ebebeb"
    }
  };

  public render() {
    return (
      <Container>
        <PlainHeader>
          <React.Fragment />
          <Logo />
          <PrevText>지난호</PrevText>
        </PlainHeader>
      </Container>
    );
  }
}

export function navigateMagazineScreen(
  navigation: NavigationScreenProp<any, any>
) {
  navigation.navigate("MagazineScreen");
}
