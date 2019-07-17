import _ from "lodash";
import React from "react";
import { FlatList, FlatListProps, ListRenderItem } from "react-native";
import { NavigationScreenProp, withNavigation } from "react-navigation";

import { FeedCard } from "src/components/cards/FeedCard";
import { navigateListenDetailScreen } from "src/screens/ListenDetailScreen";
import { navigateUserPageScreen } from "src/screens/UserPageScreen";

interface IProps
  extends RemoveKeys<FlatListProps<IFeed>, ["renderItem", "keyExtractor"]> {
  navigation: NavigationScreenProp<any, any>;
}

class FeedListClass extends React.Component<IProps> {
  public render() {
    return (
      <FlatList
        {...this.props}
        renderItem={this.renderFeedItem}
        keyExtractor={this.keyExtractor}
      />
    );
  }

  public renderFeedItem: ListRenderItem<IFeed> = ({ item }) => {
    return (
      <FeedCard
        feed={item}
        onPress={_.partial(this.onFeedPress, item)}
        onAvatarPress={_.partial(this.onAvatarPress, item)}
        onNamePress={_.partial(this.onAvatarPress, item)}
      />
    );
  };

  public onFeedPress = (item: IFeed) => {
    const { navigation } = this.props;
    const { onesignal_extra_data } = item;

    if (onesignal_extra_data.action === "navigateContent") {
      navigateListenDetailScreen(navigation, {
        contentId: onesignal_extra_data.contentId
      });
    } else if (onesignal_extra_data.action === "navigateUser") {
      navigateUserPageScreen(navigation, { uuid: onesignal_extra_data.userId });
    }
  };

  public onAvatarPress = (item: IFeed) => {
    const { navigation } = this.props;
    navigateUserPageScreen(navigation, { uuid: item.related_user.uuid });
  };

  public keyExtractor = (item: IFeed) => item.id.toString();
}

export default withNavigation(FeedListClass);
