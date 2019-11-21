import { inject, observer } from "mobx-react";
import React from "react";
import { RefreshControl } from "react-native";
import { getBottomSpace } from "react-native-iphone-x-helper";
import { NavigationScreenProp } from "react-navigation";
import styled from "styled-components/native";

import { observable } from "mobx";
import { Button } from "src/components/buttons/Button";
import { ContentList } from "src/components/lists/ContentList";
import FeedList from "src/components/lists/FeedList";
import { Text } from "src/components/Text";
import { IContentBundle } from "src/stores/ContentBundle";
import { IContentStore } from "src/stores/ContentStore";
import { IFeedStore } from "src/stores/FeedStore";
import { IRootStore } from "src/stores/RootStore";
import { IUserStore } from "src/stores/UserStore";
import { navigateListenDetailScreen } from "./ListenDetailScreen";

interface IInjectProps {
  contentStore: IContentStore;
  feedStore: IFeedStore;
  userStore: IUserStore;
}

interface IProps extends IInjectProps {
  navigation: NavigationScreenProp<any, any>;
}

const FEED_CONTENT_BUNDLE = "FEED_CONTENT_BUNDLE";

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 44px;
  background-color: rgba(247, 247, 247, 0.8);
`;

const SubHeader = styled(Button)`
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
`;

const HeaderText = styled(Text).attrs({ type: "bold" })<{ isActive: boolean }>`
  font-size: 15px;
  color: rgb(79, 79, 79);
  text-align: center;
  opacity: ${props => (props.isActive ? 1 : 0.5)};
`;

const HeaderBar = styled.View`
  position: absolute;
  bottom: 0;
  align-self: center;
  width: 100px;
  height: 3px;
  background-color: rgb(25, 86, 212);
`;

const BodyContainer = styled.View`
  width: 100%;
  flex: 1;
  background-color: #ebebeb;
`;

@inject(
  ({ store }: { store: IRootStore }): IInjectProps => ({
    contentStore: store.contentStore,
    feedStore: store.feedStore,
    userStore: store.userStore
  })
)
@observer
export class FeedScreen extends React.Component<IProps> {
  public static options: IScreenOptions = {
    statusBarProps: {
      backgroundColor: "white"
    }
  };

  public contentBundle: IContentBundle;
  @observable public tab: "FOLLOWING" | "FEED" = "FOLLOWING";

  constructor(props: IProps) {
    super(props);

    this.contentBundle = props.contentStore.createContentBundle(
      FEED_CONTENT_BUNDLE
    );
    this.contentBundle.initializeContents({}, "FOLLOWED");
  }

  public componentDidMount() {
    const { feedStore, userStore, navigation } = this.props;

    feedStore.initializeFeeds();

    navigation.addListener("didFocus", () => {
      if (userStore.client && userStore.client.has_unread_feeds) {
        feedStore.initializeFeeds();
      }

      userStore.upsertUserById(userStore.clientId!, {
        has_unread_feeds: false
      });
    });
  }

  public render() {
    return (
      <>
        <Header>
          <SubHeader onPress={() => (this.tab = "FOLLOWING")}>
            <HeaderText isActive={this.tab === "FOLLOWING"}>팔로잉</HeaderText>
            {this.tab === "FOLLOWING" ? <HeaderBar /> : null}
          </SubHeader>
          <SubHeader onPress={() => (this.tab = "FEED")}>
            <HeaderText isActive={this.tab === "FEED"}>내소식</HeaderText>
            {this.tab === "FEED" ? <HeaderBar /> : null}
          </SubHeader>
        </Header>
        <BodyContainer>
          {this.tab === "FOLLOWING" ? this.FollowingSection : this.FeedSection}
        </BodyContainer>
      </>
    );
  }

  public get FollowingSection() {
    const { navigation } = this.props;
    return (
      <ContentList
        contentBundle={this.contentBundle}
        type="CARD"
        onCardPress={item => {
          navigateListenDetailScreen(navigation, { contentId: item.id });
        }}
      />
    );
  }

  public get FeedSection() {
    const { feedStore } = this.props;
    const { feedArray, appendFeeds, refreshFeeds, refreshing } = feedStore;
    return (
      <FeedList
        style={{ paddingBottom: getBottomSpace() }}
        data={feedArray}
        onEndReached={appendFeeds}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshFeeds} />
        }
        refreshing={refreshing}
      />
    );
  }
}

export function navigateFeedScreen(navigation: NavigationScreenProp<any, any>) {
  navigation.navigate("FeedScreen");
}
