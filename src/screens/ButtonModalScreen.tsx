import _ from "lodash";
import React from "react";
import { BackHandler, Dimensions } from "react-native";
import { NavigationScreenProp } from "react-navigation";
import styled from "styled-components/native";

import { Text } from "src/components/Text";

type ModalType = "DEFAULT" | "INFO" | "ERROR";

interface IParams {
  type: ModalType;
  content: string;
  leftText?: string;
  rightText?: string;
  onLeftPress?: () => any;
  onRightPress?: () => any;
}

interface IProps {
  navigation: NavigationScreenProp<any, IParams>;
}

const { width } = Dimensions.get("window");

const modalTypeToTextColor = new Map<ModalType, string>()
  .set("DEFAULT", "black")
  .set("INFO", "rgb(25, 86, 212)")
  .set("ERROR", "rgb(255, 10, 10)");

const Container = styled.TouchableOpacity.attrs({ activeOpacity: 1 })`
  width: 100%;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const Overlay = styled.View`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
`;

const BoxContainer = styled.View`
  width: ${width - 60};
  align-self: center;
  text-align: center;
  background-color: white;
  border-radius: 14px;
  margin: 0 30px;
  z-index: 100;
`;

const BodyContainer = styled.View`
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 25px 20px;
`;

const FooterContainer = styled.View`
  flex-direction: row;
  height: 53px;
  border-top-width: 1px;
  border-top-color: #e6e6e6;
`;

const ButtonWrapper = styled.TouchableOpacity`
  flex: 1;
  height: 100%;
  align-items: center;
  justify-content: center;
`;

const LeftButtonWrapper = styled(ButtonWrapper)`
  border-right-width: 1px;
  border-right-color: #e6e6e6;
`;

const BodyText = styled(Text).attrs({ type: "regular" })`
  width: 100%;
  color: black;
  text-align: center;
`;
const FooterText = styled(Text).attrs({
  type: "bold"
})<{ modalType?: ModalType }>`
  color: ${props =>
    props.modalType ? modalTypeToTextColor.get(props.modalType) : "#888888"};
`;

export class ButtonModalScreen extends React.Component<IProps> {
  public static options: IScreenOptions = {
    statusBarProps: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      translucent: false
    },
    forceInset: {
      top: "never"
    }
  };

  public componentDidMount() {
    BackHandler.addEventListener("hardwareBackPress", this.goBack);
  }

  public componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.goBack);
  }

  public render() {
    const { navigation } = this.props;

    const modalType = navigation.getParam("type");

    const onLeftPress = _.defaultTo(
      navigation.getParam("onLeftPress"),
      this.goBack
    );

    const onRightPress = _.defaultTo(
      navigation.getParam("onRightPress"),
      this.goBack
    );

    const content = _.defaultTo(navigation.getParam("content"), "");
    const leftText = _.defaultTo(navigation.getParam("leftText"), "아니요");
    const rightText = _.defaultTo(navigation.getParam("rightText"), "예");

    return (
      <Container onPress={this.goBack}>
        <Overlay />
        <BoxContainer>
          <BodyContainer>
            <BodyText>{content}</BodyText>
          </BodyContainer>
          <FooterContainer>
            <LeftButtonWrapper onPress={onLeftPress}>
              <FooterText>{leftText}</FooterText>
            </LeftButtonWrapper>
            <ButtonWrapper onPress={onRightPress}>
              <FooterText modalType={modalType}>{rightText}</FooterText>
            </ButtonWrapper>
          </FooterContainer>
        </BoxContainer>
      </Container>
    );
  }

  private goBack = () => {
    const { navigation } = this.props;
    navigation.goBack(null);
    return true;
  };
}

export const navigateButtonModalScreen = (
  navigation: NavigationScreenProp<any, any>,
  params: IParams
) => {
  navigation.navigate("ButtonModalScreen", params);
};
