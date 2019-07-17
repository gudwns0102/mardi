import { inject, observer } from "mobx-react";
import React from "react";
import { RefreshControl } from "react-native";
import { getBottomSpace } from "react-native-iphone-x-helper";
import { NavigationScreenProp } from "react-navigation";
import styled from "styled-components/native";

import FeedList from "src/components/lists/FeedList";
import { PlainHeader } from "src/components/PlainHeader";
import { Text } from "src/components/Text";
import { HedaerText } from "src/components/texts/HeaderText";
import { IFeedStore } from "src/stores/FeedStore";
import { IRootStore } from "src/stores/RootStore";
import { IUserStore } from "src/stores/UserStore";

interface IInjectProps {
  feedStore: IFeedStore;
  userStore: IUserStore;
}

interface IProps extends IInjectProps {
  navigation: NavigationScreenProp<any, any>;
}

const CloseText = styled(Text)`
  font-size: 16px;
  line-height: 27px;
  color: rgb(177, 177, 177);
`;

@inject(
  ({ store }: { store: IRootStore }): IInjectProps => ({
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

  public componentDidMount() {
    const { feedStore, userStore, navigation } = this.props;

    feedStore.initializeFeeds();

    navigation.addListener("didFocus", () => {
      userStore.upsertUserById(userStore.clientId!, {
        has_unread_feeds: false
      });
    });
  }

  public render() {
    const { feedStore } = this.props;
    const { feedArray, appendFeeds, refreshFeeds, refreshing } = feedStore;
    return (
      <>
        <PlainHeader>
          <React.Fragment />
          <HedaerText>노티</HedaerText>
          <React.Fragment />
        </PlainHeader>
        <FeedList
          style={{ paddingBottom: getBottomSpace() }}
          data={feedArray}
          onEndReached={appendFeeds}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refreshFeeds} />
          }
          refreshing={refreshing}
        />
      </>
    );
  }

  private goBack = () => {
    const { navigation } = this.props;
    navigation.goBack(null);
  };
}

export function navigateFeedScreen(navigation: NavigationScreenProp<any, any>) {
  navigation.navigate("FeedScreen");
}
