import { BlurView } from "@react-native-community/blur";
import _ from "lodash";
import React from "react";
import { Animated, Dimensions } from "react-native";
import { NavigationScreenProp } from "react-navigation";
import styled from "styled-components/native";

import { images } from "assets/images";
import { MagazineCard } from "src/components/cards/MagazineCard";
import { PlainHeader } from "src/components/PlainHeader";
import { Text } from "src/components/Text";
import { withAudioPlayer } from "src/hocs/withAudioPlayer";
import { navigatePrevMagazineScreen } from "src/screens/PrevMagazineScreen";
import { colors } from "src/styles/colors";

interface IProps {
  navigation: NavigationScreenProp<any, any>;
}

const THEME_COLOR = "orange";

const { width } = Dimensions.get("window");

const Container = styled.View`
  width: 100%;
  flex: 1;
  background-color: #ebebeb;
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
  tint-color: ${THEME_COLOR};
`;

const LifeText = styled(Text).attrs({ type: "bradley" })`
  font-size: 30px;
  line-height: 38px;
  color: #000000;
  margin-top: 7px;
  margin-left: 4px;
`;

const PrevText = styled(Text).attrs({ type: "bold" })`
  font-size: 16px;
  line-height: 27px;
  color: ${THEME_COLOR};
`;

const PageScrollView = styled.ScrollView.attrs({
  horizontal: true,
  pagingEnabled: true
})`
  width: 100%;
  height: 310px;
`;

const Page = styled.ImageBackground.attrs({ source: images.airplane })`
  justify-content: space-between;
  width: ${width}px;
  flex: 1;
  padding-top: 9px;
  padding-bottom: 12px;
  background: powderblue;
`;

const PageTitleContainer = styled.View`
  justify-content: center;
  width: 284px;
  height: 32px;
  padding-left: 9px;
  background-color: ${THEME_COLOR};
`;

const PageTitle = styled(Text).attrs({ type: "bold" })`
  font-size: 15px;
  color: ${colors.white};
`;

const PageGuideText = styled(Text).attrs({ type: "bold" })`
  font-size: 16px;
  color: ${colors.white};
  opacity: 0.7;
  padding-left: 14px;
`;

const PlayButton = styled.TouchableOpacity.attrs({ activeOpacity: 0.8 })`
  position: absolute;
  bottom: 12px;
  right: 12px;
  align-items: center;
  width: 86px;
  height: 79px;
  padding-top: 16px;
  padding-bottom: 4px;
  border: -0.5px solid white;
  border-radius: 16px;
  overflow: hidden;
  background-color: transparent;
`;

const PlayIcon = styled.Image.attrs({ source: images.playBlue })`
  width: 24px;
  height: 26px;
`;

const PlayText = styled(Text).attrs({ type: "bold" })`
  font-size: 16px;
  color: #000000;
`;

const PlayButtonBlurView = styled(BlurView)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgb(255, 255, 255);
`;

const IndicatorRow = styled.View`
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 30px;
  background-color: #ebebeb;
`;

const IndicatorContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 30px;
  background-color: #ebebeb;
`;

const Indicator = styled.View<{ isLast: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.5);
  margin-right: ${props => (props.isLast ? 0 : 10)}px;
  overflow: hidden;
`;

const ActiveIndicator = styled(Animated.View)`
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${THEME_COLOR};
`;

const StyledMagazineCard = styled(MagazineCard)`
  margin: 0 9px 10px;
`;

@withAudioPlayer
export class MagazineScreen extends React.Component<IProps> {
  public static options: IScreenOptions = {
    statusBarProps: {
      backgroundColor: "#ebebeb"
    }
  };

  public scroll = new Animated.Value(0);

  public render() {
    const { navigation } = this.props;
    return (
      <Container>
        <PlainHeader>
          <React.Fragment />
          <Logo>
            <LogoImage />
            <LifeText>life</LifeText>
          </Logo>
          <PrevText onPress={() => navigatePrevMagazineScreen(navigation)}>
            지난호
          </PrevText>
        </PlainHeader>
        <PageScrollView
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event([
            {
              nativeEvent: { contentOffset: { x: this.scroll } }
            }
          ])}
        >
          {_.range(3).map(() => this.Page)}
        </PageScrollView>
        <IndicatorRow>
          <IndicatorContainer>
            {_.range(3).map(index => (
              <Indicator key={index} isLast={index === 2}>
                <ActiveIndicator
                  style={{
                    transform: [
                      {
                        translateX: this.scroll.interpolate({
                          inputRange: [0, 2 * width],
                          outputRange: [8 * -index, 8 * (2 - index)]
                        })
                      }
                    ]
                  }}
                />
              </Indicator>
            ))}
          </IndicatorContainer>
        </IndicatorRow>
        <StyledMagazineCard />
      </Container>
    );
  }

  public get Page() {
    return (
      <Page>
        <PageTitleContainer>
          <PageTitle>#13 - 글자가 냐하하</PageTitle>
        </PageTitleContainer>
        <PageGuideText>재생버튼을 눌러{"\n"}매거진을 들으세요</PageGuideText>
        <PlayButton>
          <PlayButtonBlurView blurAmount={37} blurType="light" />
          <PlayIcon />
          <PlayText>34</PlayText>
        </PlayButton>
      </Page>
    );
  }
}

export function navigateMagazineScreen(
  navigation: NavigationScreenProp<any, any>
) {
  navigation.navigate("MagazineScreen");
}
