import _ from "lodash";
import { Observer } from "mobx-react";
import React from "react";
import {
  FlatList,
  FlatListProps,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent
} from "react-native";
import { NavigationScreenProp, withNavigation } from "react-navigation";

import { ReplyCard } from "src/components/cards/ReplyCard";
import { navigateButtonModalScreen } from "src/screens/ButtonModalScreen";
import { navigateUserPageScreen } from "src/screens/UserPageScreen";
import { navigateWebViewScreen } from "src/screens/WebViewScreen";
import { getStore } from "src/stores/RootStore";

interface IProps extends RemoveKeys<FlatListProps<IReply>, ["renderItem"]> {
  innerRef?: any;
  navigation: NavigationScreenProp<any, any>;
  onAvatarPress: (item: IReply) => void;
  onTextPress: (item: IReply) => void;
  onAudioPress: (item: IReply) => void;
  onDeletePress: (item: IReply) => void;
  onReportPress: (item: IReply) => void;
}

export class List extends React.Component<IProps> {
  public replyCardRefs = new Map<number, React.RefObject<any>>();

  public render() {
    return (
      <FlatList
        ref={this.props.innerRef}
        renderItem={this.renderItem}
        {...this.props}
      />
    );
  }

  public renderItem: ListRenderItem<IReply> = ({ item, index }) => {
    const {
      audioStore,
      userStore: { clientId }
    } = getStore();
    const {
      // swipeBackOnButtonPress,
      // onPress,
      // contentId,
      onAvatarPress,
      onTextPress,
      onAudioPress,
      onDeletePress,
      onReportPress
    } = this.props;

    let ref = this.replyCardRefs.get(item.id);
    if (!ref) {
      ref = React.createRef();
      this.replyCardRefs.set(item.id, ref);
    }

    return (
      <Observer>
        {() => (
          <ReplyCard
            ref={ref}
            reply={item}
            isMyReply={item.user.uuid === clientId}
            isPlaying={
              item.type === "audio"
                ? audioStore.instantPlaying &&
                  audioStore.instantAudio === item.audio
                : false
            }
            scrollEnabled={true}
            swipeBackOnButtonPress={true}
            // onPress={onPress}
            onAvatarPress={_.partial(onAvatarPress, item)}
            onNamePress={_.partial(this.onAvatarPress, item.user.uuid)}
            onTagPress={this.onTagPress}
            onLinkPress={this.onLinkPress}
            onUserTagPress={
              item.tagged_user
                ? _.partial(this.onUserPress, item.tagged_user.uuid)
                : undefined
            }
            onTextPress={_.partial(onTextPress, item)}
            onAudioPress={_.partial(onAudioPress, item)}
            onDeletePress={_.partial(onDeletePress, item)}
            onReportPress={_.partial(onReportPress, item)}
            onMomentumScrollEnd={_.partial(this.swipeBackOtherReplies, item.id)}
          />
        )}
      </Observer>
    );
  };

  private onAvatarPress = (uuid: string) => {
    const { navigation } = this.props;
    navigateUserPageScreen(navigation, { uuid });
  };

  private onLinkPress = (uri: string) => {
    const { navigation } = this.props;
    navigateWebViewScreen(navigation, { uri });
  };

  // private onDeletePress = ({
  //   contentId,
  //   replyId
  // }: {
  //   contentId: IContent["id"];
  //   replyId: IReply["id"];
  // }) => {
  //   const { replyStore } = getStore();
  //   const { navigation } = this.props;
  //   navigateButtonModalScreen(navigation, {
  //     type: "ERROR",
  //     content: "댓글을 삭제하시겠습니까?",
  //     rightText: "예",
  //     onRightPress: () => {
  //       replyStore.deleteReply({ contentId, replyId });
  //       navigation.goBack(null);
  //     }
  //   });
  // };

  // private onReportPress = ({ replyId }: { replyId: IReply["id"] }) => {
  //   const { replyStore, userStore } = getStore();
  //   const { navigation } = this.props;
  //   navigateButtonModalScreen(navigation, {
  //     type: "ERROR",
  //     content: "댓글을 신고하시겠습니까?",
  //     rightText: "예",
  //     onRightPress: () => {
  //       replyStore.reportReply({
  //         uuid: userStore.clientId!,
  //         content: "신고",
  //         replyId
  //       });
  //       navigation.goBack(null);
  //     }
  //   });
  // };

  private onTagPress = (text: string) => {
    const { navigation } = this.props;
    navigation.navigate("SearchScreen", { defaultText: text });
  };

  private onUserPress = (uuid: string) => {
    const { navigation } = this.props;
    navigateUserPageScreen(navigation, { uuid });
  };

  private swipeBackOtherReplies = (
    id: number,
    e: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    if (e.nativeEvent.contentOffset.x === 0) {
      return;
    }

    this.replyCardRefs.forEach((ref, key) => {
      if (key === id) {
        return;
      }

      this.swipeBackReplyByRef(ref);
    });
  };

  private swipeBackReplyByRef = (ref: any) => {
    _.invoke(ref, ["current", "swipeBack"]);
  };
}

export const MagazineReplyList = withNavigation(
  React.forwardRef(
    (props: Omit<IProps, "innerRef">, ref: React.Ref<FlatList<IReply>>) => {
      return <List {...props} innerRef={ref} />;
    }
  )
);
