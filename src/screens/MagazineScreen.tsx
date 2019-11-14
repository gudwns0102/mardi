import { BlurView } from "@react-native-community/blur";
import _ from "lodash";
import React from "react";
import { Animated, Dimensions, ViewToken } from "react-native";
import { FlatList, NavigationScreenProp } from "react-navigation";
import styled from "styled-components/native";

import { images } from "assets/images";
import { observable } from "mobx";
import { inject, observer, Observer } from "mobx-react";
import { MagazineContentCard } from "src/components/cards/MagazineContentCard";
import { MagazineContentList } from "src/components/lists/MagazineContentList";
import { PlainHeader } from "src/components/PlainHeader";
import { Text } from "src/components/Text";
import { withAudioPlayer } from "src/hocs/withAudioPlayer";
import { IMagazine } from "src/models/Magazine";
import { navigatePrevMagazineScreen } from "src/screens/PrevMagazineScreen";
import { IAudioStore } from "src/stores/AudioStore";
import { IMagazineStore } from "src/stores/MagazineStore";
import { IRootStore } from "src/stores/RootStore";
import { colors } from "src/styles/colors";

interface IInjectProps {
  audioStore: IAudioStore;
  magazineStore: IMagazineStore;
}

interface IProps extends IInjectProps {
  navigation: NavigationScreenProp<any, any>;
}

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
})<{ themeColor: string }>`
  width: 90px;
  height: 20px;
  tint-color: ${props => props.themeColor};
`;

const LifeText = styled(Text).attrs({ type: "bradley" })`
  font-size: 30px;
  line-height: 38px;
  color: #000000;
  margin-top: 7px;
  margin-left: 4px;
`;

const PrevText = styled(Text).attrs({ type: "bold" })<{ themeColor: string }>`
  font-size: 16px;
  line-height: 27px;
  color: ${props => props.themeColor};
`;

const BodyContainer = styled.View`
  width: 100%;
  flex: 1;
`;

const MagazineTitleContainer = styled.View<{ themeColor: string }>`
  position: absolute;
  top: 9px;
  justify-content: center;
  min-width: 284px;
  height: 32px;
  padding: 0 9px;
  background-color: ${props => props.themeColor};
  z-index: 1;
`;

const MagazineTitle = styled(Text).attrs({ type: "bold" })`
  font-size: 15px;
  color: ${colors.white};
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

const ActiveIndicator = styled(Animated.View)<{ themeColor: string }>`
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${props => props.themeColor};
`;

const StyledMagazineCard = styled(MagazineContentCard)`
  margin: 0 9px 10px;
`;

@inject(
  ({ store }: { store: IRootStore }): IInjectProps => ({
    audioStore: store.audioStore,
    magazineStore: store.magazineStore
  })
)
@withAudioPlayer
@observer
export class MagazineScreen extends React.Component<IProps> {
  public static options: IScreenOptions = {
    statusBarProps: {
      backgroundColor: "#ebebeb"
    }
  };

  public magazineContentsRef = React.createRef<any>();
  public scroll = new Animated.Value(0);

  @observable public magazineContentIndex = 0;
  @observable public magazine = null as IMagazine | null;

  public async componentDidMount() {
    this.magazine = await this.props.magazineStore.fetchLatestMagazine();
  }

  public render() {
    const { navigation } = this.props;

    if (!this.magazine) {
      return null;
    }

    const themeColor = this.magazine.color;

    return (
      <Container>
        <PlainHeader>
          <React.Fragment />
          <Logo>
            <LogoImage themeColor={themeColor} />
            <LifeText>life</LifeText>
          </Logo>
          <PrevText
            themeColor={themeColor}
            onPress={() => navigatePrevMagazineScreen(navigation, {})}
          >
            지난호
          </PrevText>
        </PlainHeader>
        <BodyContainer>
          <MagazineContentList
            ref={this.magazineContentsRef}
            data={this.magazine.contents}
            magazineId={this.magazine.id}
            scrollEventThrottle={16}
            onScroll={Animated.event([
              {
                nativeEvent: { contentOffset: { x: this.scroll } }
              }
            ])}
            onViewableItemsChanged={this.onViewableItemChanged}
          />
          <IndicatorRow>
            <IndicatorContainer>
              {_.range(this.magazine.contents.length).map(index => (
                <Indicator key={index} isLast={index === 2}>
                  <ActiveIndicator
                    themeColor={themeColor}
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
          <StyledMagazineCard
            magazineId={this.magazine.id}
            magazineContent={this.magazine.contents[this.magazineContentIndex]}
          />
          <MagazineTitleContainer themeColor={this.magazine.color}>
            <MagazineTitle>{this.magazine.title}</MagazineTitle>
          </MagazineTitleContainer>
        </BodyContainer>
      </Container>
    );
  }

  public onViewableItemChanged = ({
    viewableItems
  }: {
    viewableItems: ViewToken[];
  }) => {
    if (viewableItems.length === 1) {
      this.magazineContentIndex = viewableItems[0].index!;
    }
  };
}

export function navigateMagazineScreen(
  navigation: NavigationScreenProp<any, any>,
  params: any
) {
  navigation.navigate("MagazineScreen", params);
}
