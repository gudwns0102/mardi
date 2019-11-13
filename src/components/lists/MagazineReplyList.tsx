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

import { ReplyCard } from "src/components/cards/ReplyCard";
import { getStore } from "src/stores/RootStore";

interface IProps extends RemoveKeys<FlatListProps<IReply>, ["renderItem"]> {
  innerRef?: any;
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
            // onNamePress={_.partial(this.onAvatarPress, item.user.uuid)}
            // onTagPress={this.onTagPress}
            // onLinkPress={this.onLinkPress}
            // onPlayPress={audioStore.pushInstantAudio}
            // onUserTagPress={
            //   item.tagged_user
            //     ? _.partial(this.onUserPress, item.tagged_user.uuid)
            //     : undefined
            // }
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

export const MagazineReplyList = React.forwardRef(
  (props: Omit<IProps, "innerRef">, ref: React.Ref<FlatList<IReply>>) => {
    return <List {...props} innerRef={ref} />;
  }
);
