import _ from "lodash";
import React from "react";
import { Animated, Dimensions } from "react-native";
import { NavigationScreenProp } from "react-navigation";
import styled from "styled-components/native";

import { images } from "assets/images";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { IconButton } from "src/components/buttons/IconButton";
import { Text } from "src/components/Text";
import { Bold } from "src/components/texts/Bold";
import { IMagazine } from "src/models/Magazine";

interface IParams {
  content: string;
}

interface IProps {
  navigation: NavigationScreenProp<any, IParams>;
}

const { width } = Dimensions.get("window");

const Container = styled.View`
  width: 100%;
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const BackgroundOverlay = styled.TouchableOpacity.attrs({ activeOpacity: 1 })`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const Logo = styled.View`
  flex-direction: row;
  align-items: center;
`;

const LogoImage = styled.Image.attrs({
  source: images.icLogoBigBlue
})`
  width: 90px;
  height: 20px;
  tint-color: rgb(25, 86, 212);
`;

const LifeText = styled(Text).attrs({ type: "bradley" })`
  font-size: 28px;
  line-height: 36px;
  color: #000000;
  margin-top: 7px;
  margin-left: 4px;
`;

const Modal = styled.View`
  width: ${width - 50}px;
  height: 397px;
  background-color: white;
  z-index: 100;
`;

const ModalHeader = styled.View`
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 93px;
`;

const ModalBody = styled.ScrollView.attrs({
  contentContainerStyle: {
    paddingVertical: 23,
    paddingHorizontal: 25
  }
})`
  width: 100%;
  flex: 1;
`;

const ModalBodyText = styled(Bold)`
  font-size: 14px;
  line-height: 22px;
  color: rgb(51, 51, 51);
`;

const Close = styled(IconButton).attrs({ source: images.btnTextDelete })`
  position: absolute;
  top: 9px;
  right: 9px;
  width: 24px;
  height: 24px;
`;

@observer
export class MagazineInfoModal extends React.Component<IProps> {
  public static options: IScreenOptions = {
    statusBarProps: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      translucent: false
    },
    forceInset: {
      top: "never"
    }
  };

  public magazineContentsRef = React.createRef<any>();
  public scroll = new Animated.Value(0);

  @observable public magazineContentIndex = 0;
  @observable public magazine = null as IMagazine | null;

  public render() {
    const { navigation } = this.props;

    return (
      <Container>
        <BackgroundOverlay onPress={this.goBack} />
        <Modal>
          <ModalHeader>
            <Close onPress={this.goBack} />
            <Logo>
              <LogoImage />
              <LifeText>Life</LifeText>
            </Logo>
          </ModalHeader>
          <ModalBody>
            <ModalBodyText>{navigation.getParam("content")}</ModalBodyText>
          </ModalBody>
        </Modal>
      </Container>
    );
  }

  private goBack = () => {
    const { navigation } = this.props;
    navigation.goBack(null);
    return true;
  };
}

export function navigateMagazineInfoModal(
  navigation: NavigationScreenProp<any, any>,
  params: IParams
) {
  navigation.navigate("MagazineInfoModal", params);
}
