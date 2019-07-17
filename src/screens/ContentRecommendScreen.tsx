import { inject, observer } from "mobx-react";
import React from "react";
import { NavigationScreenProp } from "react-navigation";
import styled from "styled-components/native";
import uuid from "uuid";

import { BackButton } from "src/components/buttons/BackButton";
import { ContentSortTypeButtonGroup } from "src/components/buttons/ContentSortTypeButtonGroup";
import { ContentList } from "src/components/lists/ContentList";
import { PlainHeader } from "src/components/PlainHeader";
import { Text } from "src/components/Text";
import { navigateListenDetailScreen } from "src/screens/ListenDetailScreen";
import { IContentStore } from "src/stores/ContentStore";
import { IRootStore } from "src/stores/RootStore";

interface IInjectProps {
  contentStore: IContentStore;
}

interface IProps extends IInjectProps {
  navigation: NavigationScreenProp<any, any>;
}

const Container = styled.View`
  width: 100%;
  flex: 1;
  background-color: rgb(232, 232, 232);
`;

const BackText = styled(Text)`
  font-size: 16px;
  color: rgb(69, 69, 69);
`;

const HeaderTitle = styled(Text).attrs({ type: "bold" })`
  font-size: 16px;
  line-height: 27px;
  color: rgb(69, 69, 69);
`;

const SectionRow = styled.View`
  flex-direction: row;
  align-items: center;
  height: 40px;
  padding-left: 20px;
`;

const SectionText = styled(Text).attrs({ type: "bold" })`
  font-size: 16px;
  color: rgb(69, 69, 69);
  margin-right: 10px;
`;

@inject(
  ({ store }: { store: IRootStore }): IInjectProps => ({
    contentStore: store.contentStore
  })
)
@observer
export class ContentRecommendScreen extends React.Component<IProps> {
  public static options: IScreenOptions = {
    statusBarProps: {
      backgroundColor: "#EBEBEB"
    }
  };
  public contentBundleId: string;

  constructor(props: IProps) {
    super(props);

    props.contentStore.createContentBundle((this.contentBundleId = uuid()));

    this.state = {
      contentSortType: "LATEST"
    };
  }

  public componentDidMount() {
    this.contentBundle.initializeTrendContents({});
  }

  public componentWillUnmount() {
    this.props.contentStore.clearContentBundle(this.contentBundleId);
  }

  public render() {
    return (
      <>
        <PlainHeader>
          <BackButton onPress={this.goBack} />
          <HeaderTitle>한마디 추천</HeaderTitle>
          <React.Fragment />
        </PlainHeader>
        <Container>
          <SectionRow>
            <SectionText>전체보기</SectionText>
            <ContentSortTypeButtonGroup
              sortType={this.contentBundle.sortType}
              onLatestPress={this.onLatestPress}
              onTrendPress={this.onTrendPress}
            />
          </SectionRow>
          <ContentList
            contentBundle={this.contentBundle}
            type="LIST"
            onCardPress={this.onCardPress}
          />
        </Container>
      </>
    );
  }

  private get navigation() {
    return this.props.navigation;
  }

  private get contentBundle() {
    return this.props.contentStore.bundles.get(this.contentBundleId)!;
  }

  private onLatestPress = () => {
    const { sortType } = this.contentBundle;
    if (sortType !== "LATEST") {
      this.contentBundle.initializeLatestContents();
    }
  };

  private onTrendPress = () => {
    const { sortType } = this.contentBundle;
    if (sortType !== "TREND") {
      this.contentBundle.initializeTrendContents();
    }
  };

  private onCardPress = (content: IContent) => {
    navigateListenDetailScreen(this.navigation, { contentId: content.id });
  };

  private goBack = () => {
    this.navigation.goBack(null);
  };
}

export function navigateContentRecommendScreen(
  navigation: NavigationScreenProp<any, any>
) {
  navigation.navigate("ContentRecommendScreen");
}
