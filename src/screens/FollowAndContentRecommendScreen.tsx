import { inject, observer, propTypes } from "mobx-react";
import React from "react";
import { NavigationScreenProp } from "react-navigation";
import styled from "styled-components/native";
import uuid from "uuid";

import { ContentList } from "src/components/lists/ContentList";
import { FollowList } from "src/components/lists/FollowList";
import { PlainHeader } from "src/components/PlainHeader";
import { Text } from "src/components/Text";
import { navigateContentRecommendScreen } from "src/screens/ContentRecommendScreen";
import { navigateFollowRecommendScreen } from "src/screens/FollowRecommendScreen";
import { navigateListenDetailScreen } from "src/screens/ListenDetailScreen";
import { IContentStore } from "src/stores/ContentStore";
import { IFollowStore } from "src/stores/FollowStore";
import { IRootStore } from "src/stores/RootStore";

interface IInjectProps {
  contentStore: IContentStore;
  followStore: IFollowStore;
}

interface IProps extends IInjectProps {
  navigation: NavigationScreenProp<any, any>;
}

const CloseText = styled(Text)`
  font-size: 16px;
  color: rgb(69, 69, 69);
`;

const HeaderTitle = styled(Text).attrs({ type: "bold" })`
  font-size: 16px;
  line-height: 27px;
  color: rgb(69, 69, 69);
`;

const BodyContainer = styled.View`
  width: 100%;
  flex: 1;
  background-color: rgb(232, 232, 232);
`;

const SectionContainer = styled.View`
  width: 100%;
  flex: 1;
`;

const SectionRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 42px;
  padding-left: 32px;
  padding-right: 18px;
`;

const SectionText = styled(Text).attrs({ type: "bold" })`
  font-size: 14px;
  color: rgb(0, 0, 0);
`;

const ShowMoreText = styled(Text)`
  font-size: 14px;
  color: rgb(155, 155, 155);
`;

const StyledFollowList = styled(FollowList)`
  background-color: white;
`;

@inject(
  ({ store }: { store: IRootStore }): IInjectProps => ({
    contentStore: store.contentStore,
    followStore: store.followStore
  })
)
@observer
export class FollowAndContentRecommendScreen extends React.Component<IProps> {
  public static options: IScreenOptions = {
    statusBarProps: {
      backgroundColor: "#EBEBEB"
    }
  };
  public contentBundleId: string;
  public followBundleId: string;

  constructor(props: IProps) {
    super(props);

    props.contentStore.createContentBundle((this.contentBundleId = uuid()));
    props.followStore.createBundle((this.followBundleId = uuid()));
  }

  public componentDidMount() {
    this.contentBundle.initializeTrendContents({});
    this.followBundle.initializeFollows("RECOMMEND", {
      uuid: "",
      order: "-num_followers"
    });
  }

  public componentWillUnmount() {
    this.props.contentStore.clearContentBundle(this.contentBundleId);
    this.props.followStore.clearBundle(this.followBundleId);
  }

  public render() {
    return (
      <>
        <PlainHeader>
          <CloseText onPress={this.goBack}>닫기</CloseText>
          <HeaderTitle>추천</HeaderTitle>
          <React.Fragment />
        </PlainHeader>
        <BodyContainer>
          {this.FollowRecommendSection}
          {this.ContentRecommendSection}
        </BodyContainer>
      </>
    );
  }

  private get FollowRecommendSection() {
    return (
      <SectionContainer>
        <SectionRow>
          <SectionText>팔로우 추천</SectionText>
          <ShowMoreText
            onPress={() => navigateFollowRecommendScreen(this.navigation)}
          >
            더보기
          </ShowMoreText>
        </SectionRow>
        <StyledFollowList followBundle={this.followBundle} />
      </SectionContainer>
    );
  }

  private get ContentRecommendSection() {
    return (
      <SectionContainer>
        <SectionRow>
          <SectionText>한마디 추천</SectionText>
          <ShowMoreText
            onPress={() => navigateContentRecommendScreen(this.navigation)}
          >
            더보기
          </ShowMoreText>
        </SectionRow>
        <ContentList
          contentBundle={this.contentBundle}
          type="LIST"
          onCardPress={this.onCardPress}
        />
      </SectionContainer>
    );
  }

  private get navigation() {
    return this.props.navigation;
  }

  private get contentBundle() {
    return this.props.contentStore.bundles.get(this.contentBundleId)!;
  }

  private get followBundle() {
    return this.props.followStore.bundles.get(this.followBundleId)!;
  }

  private onCardPress = (content: IContent) => {
    navigateListenDetailScreen(this.navigation, { contentId: content.id });
  };

  private goBack = () => {
    this.navigation.goBack(null);
  };
}

export function navigateFollowAndContentRecommendScreen(
  navigation: NavigationScreenProp<any, any>
) {
  navigation.navigate("FollowAndContentRecommendScreen");
}
