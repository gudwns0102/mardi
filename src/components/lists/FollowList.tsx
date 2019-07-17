import _ from "lodash";
import { inject, Observer, observer } from "mobx-react";
import React, { ComponentClass } from "react";
import {
  FlatList,
  FlatListProps,
  ListRenderItem,
  RefreshControl
} from "react-native";
import { NavigationScreenProp, withNavigation } from "react-navigation";
import styled from "styled-components/native";

import { FollowCard } from "src/components/cards/FollowCard";
import { navigateUserPageScreen } from "src/screens/UserPageScreen";
import { IFollowBundle } from "src/stores/FollowBundle";
import { IFollowStore } from "src/stores/FollowStore";
import { IRootStore } from "src/stores/RootStore";
import { IUserStore } from "src/stores/UserStore";

interface IInjectProps {
  followStore?: IFollowStore;
  userStore?: IUserStore;
}

interface IProps extends IInjectProps {
  navigation: NavigationScreenProp<any, any>;
  followBundle: IFollowBundle;
  style?: FlatListProps<IFollow>["style"];
}

const List = styled<ComponentClass<FlatListProps<IFollow>>>(FlatList).attrs({
  contentContainerStyle: {
    paddingHorizontal: 12
  }
})`
  width: 100%;
  flex: 1;
`;

@inject(
  ({ store }: { store: IRootStore }): IInjectProps => ({
    followStore: store.followStore,
    userStore: store.userStore
  })
)
@observer
class C extends React.Component<IProps> {
  public render() {
    const { followBundle, ...props } = this.props;

    const data = followBundle.followArray;
    return (
      <List
        renderItem={this.renderFollowingItem}
        keyExtractor={this.keyExtractor}
        data={data}
        onEndReached={followBundle.appendFollows}
        refreshControl={
          <RefreshControl
            refreshing={followBundle.refreshing}
            onRefresh={followBundle.refreshFollows}
          />
        }
        {...props}
      />
    );
  }

  public renderFollowingItem: ListRenderItem<IFollow> = ({ item }) => {
    const { followStore, userStore } = this.props;
    const showFollowButton = userStore!.clientId !== item.uuid;
    return (
      <Observer>
        {() => (
          <FollowCard
            name={item.name}
            username={item.username}
            photo={item.photo}
            followedByMe={item.follow_by_me}
            onFollowPress={_.partial(followStore!.toggleFollow, item.uuid)}
            onAvatarPress={_.partial(this.onAvatarPress, item.uuid)}
            showFollowButton={showFollowButton}
          />
        )}
      </Observer>
    );
  };

  public keyExtractor = (item: IFollow) => item.uuid.toString();

  private onAvatarPress = (uuid: IFollow["uuid"]) => {
    const { navigation } = this.props;
    navigateUserPageScreen(navigation, { uuid });
  };
}

export const FollowList = withNavigation(C);
