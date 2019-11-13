import _ from "lodash";
import { inject, observer } from "mobx-react";
import React from "react";
import { Animated, Dimensions, SectionListData } from "react-native";
import { NavigationScreenProp, SectionList } from "react-navigation";
import styled from "styled-components/native";

import { images } from "assets/images";
import { observable } from "mobx";
import { getMagazines } from "src/apis/magazines/getMagazines";
import { getPastMagazines } from "src/apis/magazines/getPastMagazines";
import { IconButton } from "src/components/buttons/IconButton";
import { PlainHeader } from "src/components/PlainHeader";
import { Text } from "src/components/Text";
import { withAudioPlayer } from "src/hocs/withAudioPlayer";
import { IMagazineStore } from "src/stores/MagazineStore";
import { IRootStore } from "src/stores/RootStore";
import { colors } from "src/styles/colors";
import { MagazineScreen, navigateMagazineScreen } from "./MagazineScreen";

interface IParams {
  onPress: (data: {
    magazine: Magazine;
    magazineContent: MagazineContent;
    index: number;
  }) => void;
}

interface IInjectProps {
  magazineStore: IMagazineStore;
}

interface IProps extends IInjectProps {
  navigation: NavigationScreenProp<any, IParams>;
}

const Container = styled.View`
  width: 100%;
  flex: 1;
  background-color: #ebebeb;
`;

const Header = styled(PlainHeader)`
  background-color: rgba(247, 247, 247, 0.8);
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

const SectionHeader = styled.View<{ backgroundColor: string }>`
  justify-content: center;
  width: 294px;
  height: 32px;
  padding: 0 9px;
  background-color: ${props => props.backgroundColor};
  margin-bottom: 8px;
`;

const SectionText = styled(Text).attrs({ type: "bold" })`
  font-size: 15px;
  color: ${colors.white};
`;

const PrevMagazineContainer = styled.TouchableOpacity`
  padding: 18px 18px 12px;
  background-color: white;
  margin: 0 12px 8px 9px;
`;

const PrevMagazineTitle = styled(Text).attrs({ type: "bold" })`
  font-size: 28px;
  line-height: 36px;
  color: rgb(0, 0, 0);
  margin-bottom: 10px;
`;

const Name = styled(Text).attrs({ type: "bold" })`
  font-size: 13px;
  color: rgb(155, 155, 155);
  flex: 1;
`;

@inject(
  ({ store }: { store: IRootStore }): IInjectProps => ({
    magazineStore: store.magazineStore
  })
)
@withAudioPlayer
@observer
export class PrevMagazineScreen extends React.Component<
  IProps,
  { magazines: Magazine[] }
> {
  public static options: IScreenOptions = {
    statusBarProps: {
      backgroundColor: "rgba(247, 247, 247, 0.8)"
    }
  };

  public scroll = new Animated.Value(0);

  // @observable public magazines = [] as Magazine[];

  public state = {
    magazines: [] as Magazine[]
  };

  public async componentDidMount() {
    const { results } = await getMagazines({ page: 1, page_size: 100 });
    this.setState({ magazines: results });
    // this.magazines = results;
  }

  public render() {
    const {
      navigation,
      magazineStore: { fetchMagazine }
    } = this.props;
    const { magazines } = this.state;

    const onPress = navigation.getParam("onPress");

    return (
      <Container>
        <Header>
          <Back onPress={() => navigation.goBack(null)} />
          <HeaderTitle>지난호 보기</HeaderTitle>
          <React.Fragment />
        </Header>
        <SectionList
          contentContainerStyle={{
            paddingTop: 9
          }}
          sections={magazines.map(magazine => ({
            magazine,
            title: magazine.title,
            color: magazine.color,
            data: magazine.contents
          }))}
          renderItem={({
            item,
            section,
            index
          }: {
            item: MagazineContent;
            section: SectionListData<{ magazine: Magazine }>;
            index: number;
          }) => {
            return (
              <PrevMagazineContainer
                onPress={async () => {
                  await fetchMagazine(section.magazine.id);
                  navigateMagazineScreen(navigation, {
                    magazine: section.magazine
                  });
                  onPress({
                    magazine: section.magazine,
                    magazineContent: item,
                    index
                  });
                }}
              >
                <PrevMagazineTitle>{item.title}</PrevMagazineTitle>
                <Name>{item.user_name}</Name>
              </PrevMagazineContainer>
            );
          }}
          renderSectionHeader={({
            section
          }: {
            section: SectionListData<{
              color: Magazine["color"];
              title: Magazine["title"];
            }>;
          }) => {
            return (
              <SectionHeader backgroundColor={section.color}>
                <SectionText>{section.title}</SectionText>
              </SectionHeader>
            );
          }}
          stickySectionHeadersEnabled={false}
        />
      </Container>
    );
  }
}

export function navigatePrevMagazineScreen(
  navigation: NavigationScreenProp<any, any>,
  params: IParams
) {
  navigation.navigate("PrevMagazineScreen", params);
}
