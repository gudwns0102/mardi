import { BlurView } from "@react-native-community/blur";
import _ from "lodash";
import React from "react";
import { Animated, Dimensions, ListRenderItem, ViewToken } from "react-native";
import { FlatList, NavigationScreenProp } from "react-navigation";
import styled from "styled-components/native";

import { images } from "assets/images";
import { observable } from "mobx";
import { inject, observer, Observer } from "mobx-react";
import { IconButton } from "src/components/buttons/IconButton";
import { MagazineContentCard } from "src/components/cards/MagazineContentCard";
import { MagazineContentList } from "src/components/lists/MagazineContentList";
import { PlainHeader } from "src/components/PlainHeader";
import { Text } from "src/components/Text";
import { withAudioPlayer } from "src/hocs/withAudioPlayer";
import { IMagazine } from "src/models/Magazine";
import { IMagazineContent } from "src/models/MagazineContent";
import { IAudioStore } from "src/stores/AudioStore";
import { IMagazineStore } from "src/stores/MagazineStore";
import { IRootStore } from "src/stores/RootStore";
import { colors } from "src/styles/colors";

interface IInjectProps {
  audioStore: IAudioStore;
  magazineStore: IMagazineStore;
}

interface IParams {
  magazineId: number;
  magazineContentId?: number;
}

interface IProps extends IInjectProps {
  navigation: NavigationScreenProp<any, IParams>;
}

const { width } = Dimensions.get("window");

const Container = styled.View`
  width: 100%;
  flex: 1;
  background-color: #ebebeb;
`;

const Back = styled(IconButton).attrs({ source: images.btnCommonBack })`
  width: 24px;
  height: 24px;
`;

const HeaderTitle = styled(Text).attrs({ type: "bold" })`
  font-size: 15px;
  line-height: 24px;
  color: rgb(69, 69, 69);
`;

const BodyContainer = styled.View`
  width: 100%;
  flex: 1;
`;

const Page = styled.ImageBackground`
  justify-content: space-between;
  width: ${width}px;
  flex: 1;
  padding-top: 9px;
  padding-bottom: 12px;
  background: powderblue;
`;

const PageTitleContainer = styled.View<{ themeColor: string }>`
  position: absolute;
  top: 9px;
  justify-content: center;
  width: 284px;
  height: 32px;
  padding-left: 9px;
  background-color: ${props => props.themeColor};
`;

const PageTitle = styled(Text).attrs({ type: "bold" })`
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
export class PrevMagazineDetailScreen extends React.Component<IProps> {
  public static options: IScreenOptions = {
    statusBarProps: {
      backgroundColor: "#ebebeb"
    },
    forceInset: {
      bottom: "always"
    }
  };

  public magazineContentsRef = React.createRef<any>();
  public scroll = new Animated.Value(0);

  @observable public magazineContentIndex = 0;
  @observable public magazine = null as null | IMagazine;

  public async componentDidMount() {
    const { navigation } = this.props;
    this.magazine = await this.props.magazineStore.fetchMagazine(
      navigation.getParam("magazineId")
    );

    const magazineContentId = navigation.getParam("magazineContentId");

    if (magazineContentId) {
      this.scrollToMagazineContent(magazineContentId);
    }
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
          <Back onPress={() => navigation.goBack(null)} />
          <HeaderTitle>지난호 보기</HeaderTitle>
          <React.Fragment />
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
          <PageTitleContainer themeColor={this.magazine.color}>
            <PageTitle>{this.magazine.title}</PageTitle>
          </PageTitleContainer>
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

  public scrollToMagazineContent = (magazineContentId: number) => {
    if (!this.magazine) {
      return;
    }

    const index = this.magazine.contents.findIndex(
      content => content.id === magazineContentId
    );

    if (index !== -1) {
      setTimeout(
        () =>
          _.invoke(this.magazineContentsRef.current, ["scrollToIndex"], {
            animated: true,
            index
          }),
        100
      );
    }
  };
}

export function navigatePrevMagazineDetailScreen(
  navigation: NavigationScreenProp<any, any>,
  params: IParams
) {
  navigation.navigate("PrevMagazineDetailScreen", params);
}
