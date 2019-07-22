import _ from "lodash";
import { observer } from "mobx-react";
import React, { ComponentClass } from "react";
import {
  FlatList,
  FlatListProps,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent
} from "react-native";
import { NavigationScreenProp, withNavigation } from "react-navigation";
import styled from "styled-components/native";

import { ReplyCard } from "src/components/cards/ReplyCard";
import { TextReplyCardContent } from "src/components/cards/TextReplyCardContent";
import { navigateButtonModalScreen } from "src/screens/ButtonModalScreen";
import { navigateUserPageScreen } from "src/screens/UserPageScreen";
import { navigateWebViewScreen } from "src/screens/WebViewScreen";
import { IReplyBundle } from "src/stores/ReplyBundle";
import { getStore } from "src/stores/RootStore";
import { colors } from "src/styles/colors";
import { deviceWidth } from "src/utils/Dimensions";

interface IProps
  extends RemoveKeys<
    FlatListProps<IReply>,
    ["renderItem", "keyExtractor", "data"]
  > {
  navigation: NavigationScreenProp<any, any>;
  innerRef: React.Ref<FlatList<IReply>>;
  replyBundle: IReplyBundle;
  content?: IContent;
  contentId: IContent["id"];
  onPress?: () => any;
  onTextPress?: (reply: IReply) => any;
  onAudioPress?: (reply: IReply) => any;
  onRef?: any;
  scrollEnabled?: boolean;
  swipeBackOnButtonPress?: boolean;
}

const StyledReplyList = styled<ComponentClass<FlatListProps<IReply>>>(FlatList)`
  flex: 1;
  background-color: ${colors.white};
`;

const ReplySeperator = styled.View`
  width: ${deviceWidth - 40};
  height: 1px;
  align-self: center;
  background-color: rgb(238, 238, 238);
`;

@observer
class ReplyListClass extends React.Component<IProps, any> {
  public replyCardRefs = new Map<number, React.RefObject<any>>();
  public clientId = getStore().userStore.clientId;

  public render() {
    const { innerRef, ...rest } = this.props;
    const { audioStore } = getStore();

    return (
      <StyledReplyList
        {...rest}
        ref={innerRef}
        data={this.replyBundle.replyArray}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
        ListHeaderComponent={this.HeaderReplyCard}
        extraData={{
          instantAudio: audioStore.instantAudio,
          instantPlaying: audioStore.instantPlaying
        }}
        onEndReached={this.replyBundle.append}
        onRefresh={this.replyBundle.refresh}
        refreshing={this.replyBundle.isRefreshing}
        contentContainerStyle={{
          paddingBottom: 54
        }}
      />
    );
  }

  private renderItem: ListRenderItem<IReply> = ({ item }) => {
    const { audioStore } = getStore();
    const {
      swipeBackOnButtonPress,
      onPress,
      contentId,
      onTextPress,
      onAudioPress,
      scrollEnabled
    } = this.props;

    let ref = this.replyCardRefs.get(item.id);
    if (!ref) {
      ref = React.createRef();
      this.replyCardRefs.set(item.id, ref);
    }

    const isPlaying =
      item.type === "audio"
        ? audioStore.instantPlaying && audioStore.instantAudio === item.audio
        : false;

    return (
      <ReplyCard
        ref={ref}
        reply={item}
        isMyReply={this.isMyReply(item.user.uuid)}
        isPlaying={isPlaying}
        scrollEnabled={scrollEnabled}
        swipeBackOnButtonPress={swipeBackOnButtonPress}
        onPress={onPress}
        onAvatarPress={_.partial(this.onAvatarPress, item.user.uuid)}
        onNamePress={_.partial(this.onAvatarPress, item.user.uuid)}
        onTagPress={this.onTagPress}
        onLinkPress={this.onLinkPress}
        onPlayPress={audioStore.pushInstantAudio}
        onUserTagPress={
          item.tagged_user
            ? _.partial(this.onUserPress, item.tagged_user.uuid)
            : undefined
        }
        onTextPress={onTextPress ? _.partial(onTextPress, item) : undefined}
        onAudioPress={onAudioPress ? _.partial(onAudioPress, item) : undefined}
        onDeletePress={_.partial(this.onDeletePress, {
          contentId,
          replyId: item.id
        })}
        onReportPress={_.partial(this.onReportPress, { replyId: item.id })}
        onMomentumScrollEnd={_.partial(this.swipeBackOtherReplies, item.id)}
      />
    );
  };

  private get HeaderReplyCard() {
    const { content, onPress } = this.props;

    if (!content) {
      return null;
    }

    const headerReplyMock: ITextReply = {
      id: -1,
      created_at: content.created_at,
      hidden: false,
      tagged_user: null,
      text: content.title,
      type: "text",
      user: {
        ...content.user,
        username: content.user.username
      }
    };

    return (
      <React.Fragment>
        <TextReplyCardContent
          reply={headerReplyMock}
          onPress={onPress}
          onAvatarPress={_.partial(
            this.onAvatarPress,
            headerReplyMock.user.uuid
          )}
          onNamePress={_.partial(this.onAvatarPress, headerReplyMock.user.uuid)}
          onLinkPress={this.onLinkPress}
          onTagPress={this.onTagPress}
        />
        <ReplySeperator />
      </React.Fragment>
    );
  }

  private get replyBundle() {
    return this.props.replyBundle;
  }

  private keyExtractor = (item: IReply) => item.id.toString();

  private isMyReply = (uuid: string) => {
    return this.clientId === uuid;
  };

  private onAvatarPress = (uuid: string) => {
    const { navigation } = this.props;
    navigateUserPageScreen(navigation, { uuid });
  };

  private onLinkPress = (uri: string) => {
    const { navigation } = this.props;
    navigateWebViewScreen(navigation, { uri });
  };

  private onDeletePress = ({
    contentId,
    replyId
  }: {
    contentId: IContent["id"];
    replyId: IReply["id"];
  }) => {
    const { replyStore } = getStore();
    const { navigation } = this.props;
    navigateButtonModalScreen(navigation, {
      type: "ERROR",
      content: "댓글을 삭제하시겠습니까?",
      rightText: "예",
      onRightPress: () => {
        replyStore.deleteReply({ contentId, replyId });
        navigation.goBack(null);
      }
    });
  };

  private onReportPress = ({ replyId }: { replyId: IReply["id"] }) => {
    const { replyStore, userStore } = getStore();
    const { navigation } = this.props;
    navigateButtonModalScreen(navigation, {
      type: "ERROR",
      content: "댓글을 신고하시겠습니까?",
      rightText: "예",
      onRightPress: () => {
        replyStore.reportReply({
          uuid: userStore.clientId!,
          content: "신고",
          replyId
        });
        navigation.goBack(null);
      }
    });
  };

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
  }
}

export const ReplyList = withNavigation(
  React.forwardRef(
    (props: Omit<IProps, "innerRef">, ref: React.Ref<FlatList<IReply>>) => {
      return <ReplyListClass {...props} innerRef={ref} />;
    }
  )
);
